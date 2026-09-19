import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "jirat.sitthiwetkiat@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const adminName = process.env.SEED_ADMIN_NAME || "Jirat Sitthiwetkiat";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: adminName, role: "ADMIN" },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  const existingProfile = await prisma.profile.findFirst();
  const profileData = {
    name: "Jirat Sitthiwetkiat",
    headlineEn: "Junior Frontend Developer",
    headlineTh: "จูเนียร์ ฟรอนต์เอนด์ ดีเวลลอปเปอร์",
    bioEn:
      "Computer Science graduate (First-Class Honors, Bangkok University) with Software Tester internship experience and a passion for building modern, responsive, and reliable web applications. I bring a Software Testing mindset into everything I build on the frontend — thinking about edge cases, usability, and reliability from day one.",
    bioTh:
      "จบการศึกษาสาขาวิทยาการคอมพิวเตอร์ เกียรตินิยมอันดับหนึ่ง จากมหาวิทยาลัยกรุงเทพ มีประสบการณ์ฝึกงานด้าน Software Tester และมีความหลงใหลในการสร้างเว็บแอปพลิเคชันที่ทันสมัย responsive และเชื่อถือได้ โดยนำแนวคิดด้าน Software Testing มาใช้ในการพัฒนา Frontend ทุกขั้นตอน",
    email: adminEmail,
    phone: null,
    location: "Bangkok, Thailand",
    github: "https://github.com/jirat-sitthiwetkiat",
    linkedin: "https://linkedin.com/in/jirat-sitthiwetkiat",
    website: null,
    resumeUrl: null,
    avatarUrl: null,
    availableForWork: true,
  };
  if (existingProfile) {
    await prisma.profile.update({ where: { id: existingProfile.id }, data: profileData });
  } else {
    await prisma.profile.create({ data: profileData });
  }
  console.log("Profile seeded");

  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteTitle: "Jirat Sitthiwetkiat — Junior Frontend Developer",
      siteDescriptionEn:
        "Portfolio of Jirat Sitthiwetkiat, a Junior Frontend Developer with a Software Testing mindset. React, TypeScript, and quality-first engineering.",
      siteDescriptionTh:
        "พอร์ตโฟลิโอของจิรัฏฐ์ สิทธิเวชกิจ จูเนียร์ ฟรอนต์เอนด์ ดีเวลลอปเปอร์ที่มีแนวคิดด้าน Software Testing",
      seoKeywords: ["frontend developer", "react developer", "software tester", "bangkok", "thailand"],
      defaultLanguage: "en",
      defaultTheme: "dark",
      contactEmail: adminEmail,
      socialLinks: {
        github: "https://github.com/jirat-sitthiwetkiat",
        linkedin: "https://linkedin.com/in/jirat-sitthiwetkiat",
      },
    },
  });
  console.log("Site settings seeded");

  // ---- Skills ----
  await prisma.skill.deleteMany();
  const skills: Array<{ name: string; category: string; sortOrder: number }> = [
    { name: "React", category: "Frontend", sortOrder: 0 },
    { name: "JavaScript", category: "Frontend", sortOrder: 1 },
    { name: "TypeScript", category: "Frontend", sortOrder: 2 },
    { name: "HTML", category: "Frontend", sortOrder: 3 },
    { name: "CSS", category: "Frontend", sortOrder: 4 },
    { name: "Tailwind CSS", category: "Frontend", sortOrder: 5 },
    { name: "PostgreSQL", category: "Database", sortOrder: 0 },
    { name: "Firebase", category: "Database", sortOrder: 1 },
    { name: "Manual Testing", category: "Testing", sortOrder: 0 },
    { name: "Test Case Design", category: "Testing", sortOrder: 1 },
    { name: "Regression Testing", category: "Testing", sortOrder: 2 },
    { name: "UAT", category: "Testing", sortOrder: 3 },
    { name: "API Testing", category: "Testing", sortOrder: 4 },
    { name: "Playwright", category: "Testing", sortOrder: 5 },
    { name: "Git", category: "Tools", sortOrder: 0 },
    { name: "GitHub", category: "Tools", sortOrder: 1 },
    { name: "Docker", category: "Tools", sortOrder: 2 },
    { name: "VS Code", category: "Tools", sortOrder: 3 },
    { name: "DBeaver", category: "Tools", sortOrder: 4 },
    { name: "Communication", category: "Soft Skills", sortOrder: 0 },
    { name: "Teamwork", category: "Soft Skills", sortOrder: 1 },
    { name: "Problem Solving", category: "Soft Skills", sortOrder: 2 },
    { name: "Adaptability", category: "Soft Skills", sortOrder: 3 },
    { name: "Attention to Detail", category: "Soft Skills", sortOrder: 4 },
    { name: "Time Management", category: "Soft Skills", sortOrder: 5 },
  ];
  await prisma.skill.createMany({ data: skills.map((s) => ({ ...s, visible: true })) });
  console.log(`Seeded ${skills.length} skills`);

  // ---- Projects ----
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();

  await prisma.project.create({
    data: {
      title: "Anonymous Talk",
      slug: "anonymous-talk",
      shortDescEn:
        "An anonymous social communication platform designed to help users connect, chat, and participate in communities through a simple and friendly interface.",
      shortDescTh:
        "แพลตฟอร์มสื่อสารทางสังคมแบบไม่เปิดเผยตัวตน ช่วยให้ผู้ใช้เชื่อมต่อ พูดคุย และมีส่วนร่วมในชุมชนผ่านอินเทอร์เฟซที่เรียบง่ายและเป็นมิตร",
      fullDescEn:
        "Anonymous Talk is a social communication platform built to let people express themselves freely while staying anonymous. It combines private and group chat, community polls and surveys, a lightweight rewards system, and moderation tooling into one cohesive, responsive product.",
      fullDescTh:
        "Anonymous Talk เป็นแพลตฟอร์มสื่อสารทางสังคมที่ออกแบบมาให้ผู้ใช้สามารถแสดงออกได้อย่างอิสระโดยไม่เปิดเผยตัวตน รวมฟีเจอร์แชทส่วนตัว แชทกลุ่ม โพลและแบบสำรวจของชุมชน ระบบรางวัลแบบเบา และเครื่องมือดูแลระบบไว้ในผลิตภัณฑ์เดียวที่ responsive เต็มรูปแบบ",
      role: "Frontend Developer",
      year: 2025,
      category: "Web App",
      techStack: ["React", "Next.js", "JavaScript", "Firebase", "CSS"],
      features: [
        "Google Authentication",
        "Private Chat",
        "Group Chat",
        "Notifications",
        "Polls",
        "Surveys",
        "Custom Avatars",
        "Coins / Rewards",
        "Report System",
        "Responsive UI",
      ],
      problemEn:
        "People often hesitate to share honest opinions or ask sensitive questions under their real identity, which limits open community discussion.",
      problemTh: "ผู้คนมักลังเลที่จะแสดงความคิดเห็นอย่างตรงไปตรงมาภายใต้ตัวตนจริง ทำให้การพูดคุยในชุมชนไม่เปิดกว้างเท่าที่ควร",
      solutionEn:
        "Built an anonymous-first chat and community platform with Firebase Authentication, Firestore real-time data, and a custom avatar/reward system to keep engagement high while protecting user identity.",
      solutionTh:
        "สร้างแพลตฟอร์มแชทและชุมชนแบบไม่เปิดเผยตัวตนเป็นหลัก โดยใช้ Firebase Authentication, Firestore แบบเรียลไทม์ และระบบอวาตาร์/รางวัลที่ช่วยรักษาการมีส่วนร่วมของผู้ใช้พร้อมปกป้องตัวตน",
      challengesEn:
        "Designing real-time notifications and group chat state without over-fetching from Firestore, and building a report/moderation flow that stays lightweight on the client.",
      challengesTh: "การออกแบบระบบแจ้งเตือนแบบเรียลไทม์และสถานะแชทกลุ่มโดยไม่ดึงข้อมูลจาก Firestore มากเกินไป",
      resultsEn:
        "Delivered a fully responsive, feature-complete social platform demonstrating end-to-end React + Firebase integration, real-time UX, and moderation workflows.",
      resultsTh: "ส่งมอบแพลตฟอร์มโซเชียลที่ responsive และครบฟีเจอร์ แสดงให้เห็นการเชื่อมต่อ React + Firebase แบบ end-to-end",
      githubUrl: "https://github.com/jirat-sitthiwetkiat/anonymous-talk",
      liveDemoUrl: null,
      thumbnailUrl: null,
      featured: true,
      published: true,
      sortOrder: 0,
    },
  });

  await prisma.project.create({
    data: {
      title: "CID Hotel Wallet",
      slug: "cid-hotel-wallet",
      shortDescEn:
        "A digital identity and hotel wallet concept designed to simplify hotel check-in and hotel room access using digital identity technologies.",
      shortDescTh:
        "แนวคิดกระเป๋าเงินดิจิทัลสำหรับยืนยันตัวตนและใช้งานโรงแรม ออกแบบมาเพื่อลดความยุ่งยากในการเช็กอินและเข้าห้องพักด้วยเทคโนโลยีอัตลักษณ์ดิจิทัล",
      fullDescEn:
        "CID Hotel Wallet is a digital identity concept built during the ETDA Bootcamp 2026, exploring how Verifiable Credentials and Selective Disclosure can simplify hotel check-in and secure room access via NFC/Bluetooth, without exposing more personal data than necessary.",
      fullDescTh:
        "CID Hotel Wallet เป็นแนวคิดอัตลักษณ์ดิจิทัลที่พัฒนาขึ้นระหว่างโครงการ ETDA Bootcamp 2026 โดยสำรวจการใช้ Verifiable Credentials และ Selective Disclosure เพื่อลดความยุ่งยากในการเช็กอินโรงแรมและเข้าห้องพักอย่างปลอดภัยผ่าน NFC/Bluetooth",
      role: "Frontend Developer / Team Member",
      year: 2026,
      category: "Digital Identity",
      techStack: ["DID", "Verifiable Credentials", "Selective Disclosure", "NFC", "Bluetooth", "OIDC4VP"],
      features: [
        "Digital identity wallet UI",
        "Selective disclosure consent flow",
        "NFC / Bluetooth room access simulation",
        "OIDC4VP verification flow",
      ],
      problemEn:
        "Traditional hotel check-in requires physical ID documents and manual key issuance, which is slow and over-shares personal data.",
      problemTh: "การเช็กอินโรงแรมแบบดั้งเดิมต้องใช้เอกสารยืนยันตัวตนจริงและออกกุญแจด้วยมือ ซึ่งช้าและเปิดเผยข้อมูลส่วนบุคคลเกินความจำเป็น",
      solutionEn:
        "Designed a wallet interface where guests present only the minimum verifiable claims needed (selective disclosure) to check in and unlock their room via NFC/Bluetooth, backed by an OIDC4VP verification flow.",
      solutionTh: "ออกแบบอินเทอร์เฟซกระเป๋าเงินดิจิทัลให้แขกเปิดเผยเฉพาะข้อมูลที่จำเป็นในการเช็กอินและปลดล็อกห้องพักผ่าน NFC/Bluetooth",
      challengesEn:
        "Translating unfamiliar digital-identity standards (DID, VC, OIDC4VP) into an intuitive, trustworthy consumer-facing UI within a short bootcamp timeframe.",
      challengesTh: "การแปลงมาตรฐานอัตลักษณ์ดิจิทัลที่ไม่คุ้นเคยให้กลายเป็น UI ที่ใช้งานง่ายและน่าเชื่อถือภายในระยะเวลาอันสั้น",
      resultsEn: "Won 1st Prize at ETDA Bootcamp 2026 — \"Empowering Digital Citizens to Build Digital Trust.\"",
      resultsTh: "ได้รับรางวัลชนะเลิศอันดับ 1 จากโครงการ ETDA Bootcamp 2026",
      githubUrl: null,
      liveDemoUrl: null,
      thumbnailUrl: null,
      featured: true,
      published: true,
      sortOrder: 1,
    },
  });

  await prisma.project.create({
    data: {
      title: "Campus Event Finder",
      slug: "campus-event-finder",
      shortDescEn: "A university project for discovering and RSVP'ing to campus events with a clean, responsive UI.",
      shortDescTh: "โปรเจกต์มหาวิทยาลัยสำหรับค้นหาและลงทะเบียนร่วมกิจกรรมในมหาวิทยาลัยด้วย UI ที่เรียบง่ายและ responsive",
      fullDescEn:
        "A React-based university project built to practice component architecture, routing, and REST API integration by letting students browse and RSVP to campus events.",
      fullDescTh: "โปรเจกต์มหาวิทยาลัยที่พัฒนาด้วย React เพื่อฝึกฝนสถาปัตยกรรมคอมโพเนนต์ การทำ routing และการเชื่อมต่อ REST API",
      role: "Frontend Developer",
      year: 2024,
      category: "University Project",
      techStack: ["React", "JavaScript", "CSS", "REST API"],
      features: ["Event browsing", "RSVP flow", "Category filters", "Responsive UI"],
      problemEn: "Students had no single place to discover campus events across departments.",
      problemTh: "นักศึกษาไม่มีแหล่งรวมกิจกรรมของมหาวิทยาลัยจากทุกภาควิชาในที่เดียว",
      solutionEn: "Built a searchable, filterable event directory with a simple RSVP flow.",
      solutionTh: "สร้างไดเรกทอรีกิจกรรมที่ค้นหาและกรองได้ พร้อมระบบ RSVP ที่ใช้งานง่าย",
      challengesEn: "Keeping component state predictable across nested filters and pagination.",
      challengesTh: "การควบคุม state ของคอมโพเนนต์ให้คาดเดาได้เมื่อมีตัวกรองและการแบ่งหน้าซ้อนกัน",
      resultsEn: "Delivered as a university coursework project demonstrating core React fundamentals.",
      resultsTh: "ส่งมอบเป็นโปรเจกต์รายวิชาที่แสดงพื้นฐาน React อย่างครบถ้วน",
      githubUrl: "https://github.com/jirat-sitthiwetkiat/campus-event-finder",
      liveDemoUrl: null,
      thumbnailUrl: null,
      featured: false,
      published: true,
      sortOrder: 2,
    },
  });

  console.log("Seeded 3 projects");

  // ---- Experience ----
  await prisma.experience.deleteMany();
  await prisma.experience.create({
    data: {
      company: "Confidential Company",
      position: "Software Tester Intern",
      employmentType: "INTERNSHIP",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-09-30"),
      isPresent: false,
      descriptionEn:
        "Worked within the QA team to design and execute manual test cases, identify and report defects, and support UAT for web applications.",
      descriptionTh: "ทำงานร่วมกับทีม QA ในการออกแบบและดำเนินการทดสอบด้วยตนเอง ระบุและรายงานข้อบกพร่อง และสนับสนุนการทดสอบ UAT",
      responsibilities: [
        "Created test cases",
        "Executed manual testing",
        "Identified defects",
        "Reported bugs",
        "Collaborated with developers",
        "Supported UAT",
        "Maintained test documentation",
        "Applied STLC",
        "Regression testing",
      ],
      technologies: ["Manual Testing", "STLC", "Regression Testing", "UAT", "Bug Tracking"],
      location: "Bangkok, Thailand",
      sortOrder: 0,
      visible: true,
    },
  });
  await prisma.experience.create({
    data: {
      company: "Personal & University Projects",
      position: "Frontend Developer",
      employmentType: "FREELANCE",
      startDate: new Date("2024-01-01"),
      endDate: null,
      isPresent: true,
      descriptionEn:
        "Built multiple frontend projects using React and modern tooling, applying a QA mindset to component design, edge-case handling, and responsive UI.",
      descriptionTh: "พัฒนาโปรเจกต์ Frontend หลายชิ้นด้วย React และเครื่องมือที่ทันสมัย โดยนำแนวคิด QA มาใช้ในการออกแบบคอมโพเนนต์",
      responsibilities: [
        "Built reusable React components",
        "Implemented responsive UI",
        "Integrated REST APIs",
        "Wrote test cases for critical flows",
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "Firebase", "REST API"],
      location: "Bangkok, Thailand",
      sortOrder: 1,
      visible: true,
    },
  });
  console.log("Seeded experience");

  // ---- Achievements ----
  await prisma.achievement.deleteMany();
  await prisma.achievement.create({
    data: {
      titleEn: "1st Prize — ETDA Bootcamp 2026",
      titleTh: "รางวัลชนะเลิศอันดับ 1 — ETDA Bootcamp 2026",
      organization: "Electronic Transactions Development Agency (ETDA)",
      date: new Date("2026-02-15"),
      descriptionEn:
        "Won 1st Prize at ETDA Bootcamp 2026 — \"Empowering Digital Citizens to Build Digital Trust\" — with the CID Hotel Wallet project exploring digital identity for hospitality.",
      descriptionTh:
        "ได้รับรางวัลชนะเลิศอันดับ 1 จากโครงการ ETDA Bootcamp 2026 หัวข้อ “Empowering Digital Citizens to Build Digital Trust” กับผลงาน CID Hotel Wallet",
      imageUrl: null,
      credentialUrl: null,
      event: "ETDA Bootcamp 2026",
      project: "CID Hotel Wallet",
      role: "Frontend Developer / Team Member",
      featured: true,
      visible: true,
      sortOrder: 0,
    },
  });
  console.log("Seeded achievements");

  // ---- Certificates ----
  await prisma.certificate.deleteMany();
  await prisma.certificate.create({
    data: {
      name: "ETDA Bootcamp 2026 — 1st Prize Certificate",
      organization: "Electronic Transactions Development Agency (ETDA)",
      issueDate: new Date("2026-02-15"),
      credentialId: null,
      credentialUrl: null,
      imageUrl: null,
      descriptionEn: "Awarded for 1st Prize in the ETDA Bootcamp 2026 digital identity hackathon.",
      descriptionTh: "มอบให้สำหรับรางวัลชนะเลิศอันดับ 1 ในโครงการแฮกกาธอนด้านอัตลักษณ์ดิจิทัล ETDA Bootcamp 2026",
      visible: true,
      sortOrder: 0,
    },
  });
  await prisma.certificate.create({
    data: {
      name: "Bachelor of Science in Computer Science (First-Class Honors)",
      organization: "Bangkok University",
      issueDate: new Date("2025-05-30"),
      credentialId: null,
      credentialUrl: null,
      imageUrl: null,
      descriptionEn: "Graduated with First-Class Honors in Computer Science.",
      descriptionTh: "สำเร็จการศึกษาสาขาวิทยาการคอมพิวเตอร์ เกียรตินิยมอันดับหนึ่ง",
      visible: true,
      sortOrder: 1,
    },
  });
  console.log("Seeded certificates");

  // ---- Blog ----
  await prisma.blogPost.deleteMany();
  await prisma.blogTag.deleteMany();

  const posts = [
    {
      title: "STLC Explained",
      excerptEn: "A walkthrough of the Software Testing Life Cycle and how each phase fits into real project work.",
      excerptTh: "อธิบายวงจรชีวิตการทดสอบซอฟต์แวร์ (STLC) และแต่ละขั้นตอนที่นำไปใช้ในงานจริง",
      contentEn:
        "<p>The Software Testing Life Cycle (STLC) is a structured sequence of activities carried out during the testing process: requirement analysis, test planning, test case design, environment setup, test execution, and closure.</p><p>During my internship, applying STLC consistently helped catch regressions earlier and kept test documentation traceable back to requirements.</p>",
      contentTh: "<p>วงจรชีวิตการทดสอบซอฟต์แวร์ (STLC) เป็นลำดับกิจกรรมที่มีโครงสร้างชัดเจนในกระบวนการทดสอบ</p>",
      tags: ["QA", "Testing", "STLC"],
    },
    {
      title: "Regression Testing vs Retesting",
      excerptEn: "Clarifying a commonly confused pair of QA concepts with concrete examples.",
      excerptTh: "อธิบายความแตกต่างระหว่าง Regression Testing และ Retesting พร้อมตัวอย่างที่เข้าใจง่าย",
      contentEn:
        "<p>Retesting confirms that a specific reported bug has been fixed. Regression testing checks that the fix, or any new change, hasn't broken anything else in the surrounding functionality.</p>",
      contentTh: "<p>Retesting คือการยืนยันว่าบั๊กที่รายงานไปได้รับการแก้ไขแล้ว ส่วน Regression Testing คือการตรวจสอบว่าการแก้ไขไม่ได้ทำให้ส่วนอื่นพัง</p>",
      tags: ["QA", "Testing"],
    },
    {
      title: "Building Reusable React Components",
      excerptEn: "Lessons learned building a component library across several frontend projects.",
      excerptTh: "บทเรียนจากการสร้างไลบรารีคอมโพเนนต์ที่ใช้ซ้ำได้ในหลายโปรเจกต์ Frontend",
      contentEn:
        "<p>Composable, prop-driven components with clear boundaries make UI easier to test and reason about. Favor composition over configuration where possible.</p>",
      contentTh: "<p>คอมโพเนนต์ที่ประกอบกันได้และขับเคลื่อนด้วย props ที่มีขอบเขตชัดเจน ช่วยให้ UI ทดสอบและเข้าใจได้ง่ายขึ้น</p>",
      tags: ["React", "Frontend"],
    },
    {
      title: "What I Learned from My QA Internship",
      excerptEn: "Reflections on how a testing internship changed the way I write frontend code.",
      excerptTh: "ข้อคิดจากการฝึกงานด้าน QA ที่เปลี่ยนวิธีที่ผมเขียนโค้ด Frontend",
      contentEn:
        "<p>Thinking like a tester before writing a line of UI code — considering empty states, error states, and edge cases up front — has made my components noticeably more resilient.</p>",
      contentTh: "<p>การคิดแบบ Tester ก่อนเขียนโค้ด UI ทำให้คอมโพเนนต์ที่ผมสร้างมีความทนทานมากขึ้นอย่างเห็นได้ชัด</p>",
      tags: ["QA", "Career"],
    },
    {
      title: "Getting Started with Playwright",
      excerptEn: "First steps into QA Automation using Playwright for end-to-end testing.",
      excerptTh: "ก้าวแรกสู่ QA Automation ด้วย Playwright สำหรับการทดสอบแบบ end-to-end",
      contentEn:
        "<p>Playwright's auto-waiting and multi-browser support make it a strong starting point for automating the manual regression suites I ran during my internship.</p>",
      contentTh: "<p>ความสามารถ auto-waiting และรองรับหลายเบราว์เซอร์ของ Playwright ทำให้เป็นจุดเริ่มต้นที่ดีสำหรับการทำ Automation</p>",
      tags: ["Playwright", "Automation", "Testing"],
    },
  ];

  for (const [index, p] of posts.entries()) {
    const slug = p.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    await prisma.blogPost.create({
      data: {
        title: p.title,
        slug,
        excerptEn: p.excerptEn,
        excerptTh: p.excerptTh,
        contentEn: p.contentEn,
        contentTh: p.contentTh,
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - index * 1000 * 60 * 60 * 24 * 7),
        tags: { connectOrCreate: p.tags.map((name) => ({ where: { name }, create: { name } })) },
      },
    });
  }
  console.log(`Seeded ${posts.length} blog posts`);

  console.log("\nSeed complete.");
  console.log(`Admin login -> email: ${adminEmail} / password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
