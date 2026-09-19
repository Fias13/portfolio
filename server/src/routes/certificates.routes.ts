import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

const certificateSchema = z.object({
  name: z.string().min(1),
  organization: z.string().min(1),
  issueDate: z.coerce.date(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionTh: z.string().optional().nullable(),
  visible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const isAdmin = !!req.user;
    const items = await prisma.certificate.findMany({
      where: isAdmin ? {} : { visible: true },
      orderBy: [{ sortOrder: "asc" }, { issueDate: "desc" }],
    });
    res.json(items);
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = certificateSchema.parse(req.body);
    const item = await prisma.certificate.create({ data });
    res.status(201).json(item);
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = certificateSchema.partial().parse(req.body);
    const item = await prisma.certificate.update({ where: { id: req.params.id }, data }).catch(() => null);
    if (!item) throw new ApiError(404, "Certificate not found");
    res.json(item);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.certificate.delete({ where: { id: req.params.id } }).catch(() => {
      throw new ApiError(404, "Certificate not found");
    });
    res.status(204).send();
  })
);

export default router;
