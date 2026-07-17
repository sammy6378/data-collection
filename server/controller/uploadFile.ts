import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file provided" });
  }

  if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type. Only PDF, DOC, and DOCX are allowed.",
    });
  }

  try {
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "cv_uploads",
            resource_type: "raw",
            allowed_formats: ["pdf", "doc", "docx"],
          },
          (error, result) => {
            if (error || !result) reject(error ?? new Error("Upload failed"));
            else resolve(result as { secure_url: string });
          }
        );
        stream.end(req.file!.buffer);
      }
    );

    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "File upload failed. Please try again." });
  }
};
