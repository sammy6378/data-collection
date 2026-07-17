import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { createData, getData } from "../controller/createData";
import { uploadFile } from "../controller/uploadFile";
import { requireAdminToken } from "../middleware/auth";

const dataRouter = Router();

// Rate limiter: max 15 form submissions per IP per 15 minutes
const submitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many submissions. Please try again later." },
});

// Rate limiter: max 20 upload requests per IP per 15 minutes
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many upload requests. Please try again later." },
});

// Multer: memory storage, 5 MB limit, single file named "cv"
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
        }
    },
});

dataRouter.post("/create", submitLimiter, createData);
dataRouter.post("/upload-cv", uploadLimiter, upload.single("cv"), uploadFile);
dataRouter.get("/get-data", requireAdminToken, getData);

export default dataRouter;
