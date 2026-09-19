import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

const achievementSchema = z.object({
  titleEn: z.string().min(1),
  titleTh: z.string().min(1),
  organization: z.string().min(1),
  date: z.coerce.date(),
  descriptionEn: z.string().optional().nullable(),
  descriptionTh: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  credentialUrl: z.string().optional().nullable(),
  event: z.string().optional().nullable(),
  project: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const isAdmin = !!req.user;
    const items = await prisma.achievement.findMany({
      where: isAdmin ? {} : { visible: true },
      orderBy: [{ sortOrder: "asc" }, { date: "desc" }],
    });
    res.json(items);
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = achievementSchema.parse(req.body);
    const item = await prisma.achievement.create({ data });
    res.status(201).json(item);
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = achievementSchema.partial().parse(req.body);
    const item = await prisma.achievement.update({ where: { id: req.params.id }, data }).catch(() => null);
    if (!item) throw new ApiError(404, "Achievement not found");
    res.json(item);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.achievement.delete({ where: { id: req.params.id } }).catch(() => {
      throw new ApiError(404, "Achievement not found");
    });
    res.status(204).send();
  })
);

export default router;
