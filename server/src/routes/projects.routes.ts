import { Router } from "express";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  shortDescEn: z.string().min(1),
  shortDescTh: z.string().min(1),
  fullDescEn: z.string().default(""),
  fullDescTh: z.string().default(""),
  role: z.string().optional().nullable(),
  year: z.number().int().optional().nullable(),
  category: z.string().optional().nullable(),
  techStack: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  problemEn: z.string().optional().nullable(),
  problemTh: z.string().optional().nullable(),
  solutionEn: z.string().optional().nullable(),
  solutionTh: z.string().optional().nullable(),
  challengesEn: z.string().optional().nullable(),
  challengesTh: z.string().optional().nullable(),
  resultsEn: z.string().optional().nullable(),
  resultsTh: z.string().optional().nullable(),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  liveDemoUrl: z.string().url().optional().nullable().or(z.literal("")),
  thumbnailUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  images: z
    .array(z.object({ url: z.string(), caption: z.string().optional().nullable(), sortOrder: z.number().int().default(0) }))
    .optional(),
});

// Public: list published projects
router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const isAdmin = !!req.user;
    const { category, tech, featured, search } = req.query as Record<string, string | undefined>;

    const where: any = isAdmin ? {} : { published: true };
    if (category) where.category = category;
    if (featured === "true") where.featured = true;
    if (tech) where.techStack = { has: tech };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescEn: { contains: search, mode: "insensitive" } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
    res.json(projects);
  })
);

router.get(
  "/:slug",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
    if (!project) throw new ApiError(404, "Project not found");
    if (!project.published && !req.user) throw new ApiError(404, "Project not found");
    res.json(project);
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = projectSchema.parse(req.body);
    const slug = data.slug ? slugify(data.slug, { lower: true, strict: true }) : slugify(data.title, { lower: true, strict: true });
    const { images, ...rest } = data;
    const project = await prisma.project.create({
      data: {
        ...rest,
        slug,
        githubUrl: rest.githubUrl || null,
        liveDemoUrl: rest.liveDemoUrl || null,
        images: images?.length ? { create: images } : undefined,
      },
      include: { images: true },
    });
    res.status(201).json(project);
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = projectSchema.partial().parse(req.body);
    const { images, ...rest } = data;
    const updateData: any = { ...rest };
    if (rest.slug) updateData.slug = slugify(rest.slug, { lower: true, strict: true });
    if (rest.githubUrl !== undefined) updateData.githubUrl = rest.githubUrl || null;
    if (rest.liveDemoUrl !== undefined) updateData.liveDemoUrl = rest.liveDemoUrl || null;

    if (images) {
      await prisma.projectImage.deleteMany({ where: { projectId: req.params.id } });
      updateData.images = { create: images };
    }

    const project = await prisma.project
      .update({ where: { id: req.params.id }, data: updateData, include: { images: true } })
      .catch(() => null);
    if (!project) throw new ApiError(404, "Project not found");
    res.json(project);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.project.delete({ where: { id: req.params.id } }).catch(() => {
      throw new ApiError(404, "Project not found");
    });
    res.status(204).send();
  })
);

router.post(
  "/:id/duplicate",
  requireAuth,
  asyncHandler(async (req, res) => {
    const original = await prisma.project.findUnique({ where: { id: req.params.id }, include: { images: true } });
    if (!original) throw new ApiError(404, "Project not found");
    const { id, createdAt, updatedAt, images, slug, ...rest } = original;
    const copy = await prisma.project.create({
      data: {
        ...rest,
        title: `${original.title} (Copy)`,
        slug: `${slug}-copy-${Date.now()}`,
        published: false,
        images: { create: images.map(({ url, caption, sortOrder }) => ({ url, caption, sortOrder })) },
      },
      include: { images: true },
    });
    res.status(201).json(copy);
  })
);

router.patch(
  "/:id/publish",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { published } = z.object({ published: z.boolean() }).parse(req.body);
    const project = await prisma.project.update({ where: { id: req.params.id }, data: { published } });
    res.json(project);
  })
);

router.post(
  "/reorder",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { order } = z.object({ order: z.array(z.string()) }).parse(req.body);
    await prisma.$transaction(order.map((id, index) => prisma.project.update({ where: { id }, data: { sortOrder: index } })));
    res.json({ ok: true });
  })
);

export default router;
