import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { connectDb } from "../utils/db";
import { DataModel } from "../model/data";

// One-off export script for system handover.
// Dumps all submissions from the "Data" collection to JSON and CSV
// under server/export/ so they can be handed to the client.

const OUT_DIR = path.join(__dirname, "..", "export");

const escapeCsv = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    const str = typeof value === "string" ? value : JSON.stringify(value);
    if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

async function main() {
    await connectDb();

    const docs = await DataModel.find().lean();
    console.log(`Fetched ${docs.length} submissions from MongoDB`);

    fs.mkdirSync(OUT_DIR, { recursive: true });

    // JSON export (full fidelity)
    fs.writeFileSync(
        path.join(OUT_DIR, "submissions.json"),
        JSON.stringify(docs, null, 2),
        "utf-8"
    );

    // CSV export (flattened, for spreadsheet use)
    const columns = [
        "_id",
        "name",
        "jobTitle",
        "jobType",
        "supervisor",
        "department",
        "section",
        "location",
        "country",
        "school",
        "educationLevel",
        "otherEducation",
        "otherSkills",
        "qualifications",
        "experienceSummary",
        "experienceList",
        "cvFile",
        "dataConsent",
        "createdAt",
        "updatedAt",
    ];

    const rows = docs.map((doc: any) =>
        columns
            .map((col) => {
                if (col === "experienceList") {
                    return escapeCsv(JSON.stringify(doc.experienceList ?? []));
                }
                return escapeCsv(doc[col]);
            })
            .join(",")
    );

    const csv = [columns.join(","), ...rows].join("\n");
    fs.writeFileSync(path.join(OUT_DIR, "submissions.csv"), csv, "utf-8");

    console.log(`Export written to ${OUT_DIR}`);
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error("Export failed:", err);
    process.exit(1);
});
