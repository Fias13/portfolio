import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Seo from "@/components/common/Seo";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import TechStack from "@/components/skills/TechStack";
import SoftSkillsSection from "@/components/skills/SoftSkillsSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import ExperienceSection from "@/components/experience/ExperienceSection";
import QualityMindset from "@/components/quality/QualityMindset";
import AchievementsSection from "@/components/achievements/AchievementsSection";
import CertificatesSection from "@/components/certificates/CertificatesSection";
import BlogSection from "@/components/blog/BlogSection";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [location.hash]);

  return (
    <>
      <Seo
        title="Jirat Sitthiwetkiat — Junior Frontend Developer"
        description="Frontend Developer with a strong Software Testing mindset. React, TypeScript, and quality-first engineering, based in Bangkok."
      />
      <Hero />
      <About />
      <TechStack />
      <SoftSkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <QualityMindset />
      <AchievementsSection />
      <CertificatesSection />
      <BlogSection />
    </>
  );
}
