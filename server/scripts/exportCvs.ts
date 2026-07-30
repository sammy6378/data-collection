import fs from "fs";
import path from "path";
import { DataModel } from "../model/data";
import { connectDb } from "../utils/db";
import mongoose from "mongoose";
import "dotenv/config";

// One-off script for system handover.
// Downloads every applicant's CV (currently stored on Cloudinary) to
// server/export-cvs/ so the actual PDF files (not just links) are handed over.

const OUT_DIR = path.join(__dirname, "..", "export-cvs");
const CONCURRENCY = 8;

const sanitize = (value: string) =>
    value
        .normalize("NFKD")
        .replace(/[^\w\- ]+/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .slice(0, 60);

async function downloadOne(doc: any, index: number, total: number) {
    const { _id, name, cvFile } = doc;
    if (!cvFile) {
        console.warn(`[${index}/${total}] Skipping ${_id} — no cvFile URL`);
        return { id: _id, name, status: "skipped-no-url" as const };
    }

    const ext = path.extname(new URL(cvFile).pathname) || ".pdf";
    const fileName = `${sanitize(name || "unknown")}_${_id}${ext}`;
    const filePath = path.join(OUT_DIR, fileName);

    try {
        const res = await fetch(cvFile);
        if (!res.ok) {
            console.error(`[${index}/${total}] HTTP ${res.status} for ${_id} (${cvFile})`);
            return { id: _id, name, cvFile, status: "failed" as const, httpStatus: res.status };
        }
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        console.log(`[${index}/${total}] Saved ${fileName} (${buffer.length} bytes)`);
        return { id: _id, name, cvFile, status: "ok" as const, fileName, bytes: buffer.length };
    } catch (err: any) {
        console.error(`[${index}/${total}] Error downloading ${_id}: ${err.message}`);
        return { id: _id, name, cvFile, status: "failed" as const, error: err.message };
    }
}

async function main() {
    await connectDb();

    const docs = await DataModel.find().lean();
    console.log(`Fetched ${docs.length} submissions from MongoDB`);

    fs.mkdirSync(OUT_DIR, { recursive: true });

    const results: any[] = [];
    let cursor = 0;

    async function worker() {
        while (cursor < docs.length) {
            const i = cursor++;
            const result = await downloadOne(docs[i], i + 1, docs.length);
            results.push(result);
        }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

    const ok = results.filter((r) => r.status === "ok");
    const failed = results.filter((r) => r.status !== "ok");

    fs.writeFileSync(
        path.join(OUT_DIR, "_download-report.json"),
        JSON.stringify({ total: docs.length, downloaded: ok.length, failed: failed.length, results }, null, 2),
        "utf-8"
    );

    console.log(`\nDone. Downloaded ${ok.length}/${docs.length}. Failed: ${failed.length}.`);
    if (failed.length) {
        console.log("See _download-report.json for details on failures.");
    }

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error("CV export failed:", err);
    process.exit(1);
});
