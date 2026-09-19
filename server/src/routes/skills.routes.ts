import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  icon: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionTh: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const isAdmin = !!req.user;
    const skills = await prisma.skill.findMany({
      where: isAdmin ? {} : { visible: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    res.json(skills);
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = skillSchema.parse(req.body);
    const skill = await prisma.skill.create({ data });
    res.status(201).json(skill);
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = skillSchema.partial().parse(req.body);
    const skill = await prisma.skill.update({ where: { id: req.params.id }, data }).catch(() => null);
    if (!skill) throw new ApiError(404, "Skill not found");
    res.json(skill);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.skill.delete({ where: { id: req.params.id } }).catch(() => {
      throw new ApiError(404, "Skill not found");
    });
    res.status(204).send();
  })
);

router.post(
  "/reorder",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { order } = z.object({ order: z.array(z.string()) }).parse(req.body);
    await prisma.$transaction(order.map((id, index) => prisma.skill.update({ where: { id }, data: { sortOrder: index } })));
    res.json({ ok: true });
  })
);

export default router;
