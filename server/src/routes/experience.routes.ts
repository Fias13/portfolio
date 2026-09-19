import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

const experienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "FREELANCE"]).default("INTERNSHIP"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  isPresent: z.boolean().default(false),
  descriptionEn: z.string().min(1),
  descriptionTh: z.string().min(1),
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  location: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const isAdmin = !!req.user;
    const items = await prisma.experience.findMany({
      where: isAdmin ? {} : { visible: true },
      orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    });
    res.json(items);
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = experienceSchema.parse(req.body);
    const item = await prisma.experience.create({ data });
    res.status(201).json(item);
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = experienceSchema.partial().parse(req.body);
    const item = await prisma.experience.update({ where: { id: req.params.id }, data }).catch(() => null);
    if (!item) throw new ApiError(404, "Experience not found");
    res.json(item);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.experience.delete({ where: { id: req.params.id } }).catch(() => {
      throw new ApiError(404, "Experience not found");
    });
    res.status(204).send();
  })
);

export default router;
