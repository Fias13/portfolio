import { Router } from "express";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerptEn: z.string().min(1),
  excerptTh: z.string().min(1),
  contentEn: z.string().default(""),
  contentTh: z.string().default(""),
  coverImageUrl: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  tags: z.array(z.string()).default([]),
});

router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const isAdmin = !!req.user;
    const { tag, search, status } = req.query as Record<string, string | undefined>;
    const where: any = isAdmin ? {} : { status: "PUBLISHED" };
    if (isAdmin && status) where.status = status;
    if (tag) where.tags = { some: { name: tag } };
    if (search) where.title = { contains: search, mode: "insensitive" };

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { tags: true },
    });
    res.json(posts);
  })
);

router.get(
  "/:slug",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug }, include: { tags: true } });
    if (!post) throw new ApiError(404, "Post not found");
    if (post.status !== "PUBLISHED" && !req.user) throw new ApiError(404, "Post not found");
    res.json(post);
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = blogSchema.parse(req.body);
    const slug = slugify(data.slug || data.title, { lower: true, strict: true });
    const { tags, ...rest } = data;
    const post = await prisma.blogPost.create({
      data: {
        ...rest,
        slug,
        publishedAt: rest.status === "PUBLISHED" ? new Date() : null,
        tags: { connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })) },
      },
      include: { tags: true },
    });
    res.status(201).json(post);
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = blogSchema.partial().parse(req.body);
    const { tags, ...rest } = data;
    const updateData: any = { ...rest };
    if (rest.slug) updateData.slug = slugify(rest.slug, { lower: true, strict: true });
    if (rest.status === "PUBLISHED") updateData.publishedAt = new Date();
    if (tags) updateData.tags = { set: [], connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })) };

    const post = await prisma.blogPost
      .update({ where: { id: req.params.id }, data: updateData, include: { tags: true } })
      .catch(() => null);
    if (!post) throw new ApiError(404, "Post not found");
    res.json(post);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.blogPost.delete({ where: { id: req.params.id } }).catch(() => {
      throw new ApiError(404, "Post not found");
    });
    res.status(204).send();
  })
);

export default router;
