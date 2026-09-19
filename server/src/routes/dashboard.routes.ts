import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    const [
      totalProjects,
      totalSkills,
      totalExperience,
      totalAchievements,
      totalCertificates,
      totalBlogPosts,
      unreadMessages,
      recentProjects,
      recentMessages,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.achievement.count(),
      prisma.certificate.count(),
      prisma.blogPost.count(),
      prisma.contactMessage.count({ where: { status: "UNREAD" } }),
      prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    res.json({
      counts: {
        totalProjects,
        totalSkills,
        totalExperience,
        totalAchievements,
        totalCertificates,
        totalBlogPosts,
        unreadMessages,
      },
      recentProjects,
      recentMessages,
    });
  })
);

export default router;
