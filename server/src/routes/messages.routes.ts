import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { status, search } = req.query as Record<string, string | undefined>;
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }
    const messages = await prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(messages);
  })
);

router.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: z.enum(["UNREAD", "READ", "ARCHIVED"]) }).parse(req.body);
    const message = await prisma.contactMessage.update({ where: { id: req.params.id }, data: { status } }).catch(() => null);
    if (!message) throw new ApiError(404, "Message not found");
    res.json(message);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.contactMessage.delete({ where: { id: req.params.id } }).catch(() => {
      throw new ApiError(404, "Message not found");
    });
    res.status(204).send();
  })
);

export default router;
