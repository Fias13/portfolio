import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const profileSchema = z.object({
  name: z.string().min(1),
  headlineEn: z.string().min(1),
  headlineTh: z.string().min(1),
  bioEn: z.string().min(1),
  bioTh: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  availableForWork: z.boolean().default(true),
});

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const profile = await prisma.profile.findFirst();
    res.json(profile);
  })
);

router.put(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = profileSchema.partial().parse(req.body);
    const existing = await prisma.profile.findFirst();
    const profile = existing
      ? await prisma.profile.update({ where: { id: existing.id }, data })
      : await prisma.profile.create({ data: data as z.infer<typeof profileSchema> });
    res.json(profile);
  })
);

export default router;
