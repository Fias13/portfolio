import multer from "multer";
import { ApiError } from "./errorHandler.js";

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB || 5);

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

// Files are buffered in memory, then the route handler sends them to Supabase
// Storage (if configured) or writes them to local disk (dev fallback).
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  },
});
