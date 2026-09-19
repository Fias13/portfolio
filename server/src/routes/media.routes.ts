import fs from "node:fs/promises";
import path from "node:path";
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { deleteFromSupabase, extractSupabaseStoragePath, isSupabaseConfigured, uploadToSupabase } from "../lib/supabaseStorage.js";

const router = Router();
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { folder } = req.query as Record<string, string | undefined>;
    const media = await prisma.media.findMany({
      where: folder ? { folder } : {},
      orderBy: { createdAt: "desc" },
    });
    res.json(media);
  })
);

function buildFilename(originalname: string): string {
  const ext = path.extname(originalname).toLowerCase();
  const base = path
    .basename(originalname, ext)
    .replace(/[^a-z0-9-_]/gi, "-")
    .toLowerCase()
    .slice(0, 40);
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${base}-${unique}${ext}`;
}

router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "No file uploaded");
    const folder = (req.body.folder as string) || "general";
    const filename = buildFilename(req.file.originalname);

    let url: string;
    if (isSupabaseConfigured) {
      url = await uploadToSupabase(req.file.buffer, `${folder}/${filename}`, req.file.mimetype);
    } else {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      await fs.writeFile(path.join(UPLOAD_DIR, filename), req.file.buffer);
      url = `/uploads/${filename}`;
    }

    const media = await prisma.media.create({
      data: {
        url,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        folder,
      },
    });
    res.status(201).json(media);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });
    if (!media) throw new ApiError(404, "Media not found");

    if (isSupabaseConfigured) {
      const storagePath = extractSupabaseStoragePath(media.url);
      if (storagePath) await deleteFromSupabase(storagePath);
    } else if (media.url.startsWith("/uploads/")) {
      await fs.unlink(path.join(UPLOAD_DIR, path.basename(media.url))).catch(() => {});
    }

    await prisma.media.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
