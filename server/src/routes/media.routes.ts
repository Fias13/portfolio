import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();
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

router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "No file uploaded");
    const folder = (req.body.folder as string) || "general";
    const url = `/uploads/${req.file.filename}`;
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
    await prisma.media.delete({ where: { id: req.params.id } }).catch(() => {
      throw new ApiError(404, "Media not found");
    });
    res.status(204).send();
  })
);

export default router;
