import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contactRateLimit } from "../middleware/rateLimit.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(3000),
});

router.post(
  "/",
  contactRateLimit,
  asyncHandler(async (req, res) => {
    const data = contactSchema.parse(req.body);
    const created = await prisma.contactMessage.create({ data });
    res.status(201).json({ ok: true, id: created.id });
  })
);

export default router;
