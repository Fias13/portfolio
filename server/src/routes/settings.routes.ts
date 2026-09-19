import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const settingsSchema = z.object({
  siteTitle: z.string().min(1),
  siteDescriptionEn: z.string().default(""),
  siteDescriptionTh: z.string().default(""),
  seoKeywords: z.array(z.string()).default([]),
  favicon: z.string().optional().nullable(),
  defaultLanguage: z.enum(["en", "th"]).default("en"),
  defaultTheme: z.enum(["light", "dark"]).default("dark"),
  contactEmail: z.string().email().optional().nullable(),
  socialLinks: z.record(z.string()).optional().nullable(),
});

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const settings = await prisma.siteSetting.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton", siteDescriptionEn: "", siteDescriptionTh: "" },
    });
    res.json(settings);
  })
);

router.put(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = settingsSchema.partial().parse(req.body);
    const settings = await prisma.siteSetting.upsert({
      where: { id: "singleton" },
      update: data as any,
      create: { id: "singleton", siteDescriptionEn: "", siteDescriptionTh: "", ...data } as any,
    });
    res.json(settings);
  })
);

export default router;
