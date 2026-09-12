import express from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import { analyzeResumeAgainstJob } from "./modules/atsScorer.js";
import { parseResumeSections } from "./modules/ats/sectionParser.js";
import { generatePortfolioPage } from "./modules/portfolioGenerator.js";

const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});
const resumeStore = new Map();
const appliedJobsStore = new Set();
const jobsCatalog = [
  {
    id: "job-1",
    title: "Full Stack Engineer - SaaS",
    company: "LedgerLoop",
    location: "Chennai, India",
    type: "Full-time",
    remote: true,
    salary: "₹15-24 LPA",
    posted: "7 hours ago",
    description: "Build accounting SaaS modules across frontend and backend.",
    skills: ["React", "Node.js", "MySQL", "Redis"],
  },
  {
    id: "job-2",
    title: "AI Engineer - Multimodal",
    company: "MetaSense AI",
    location: "Bangalore, India",
    type: "Full-time",
    remote: true,
    salary: "₹27-45 LPA",
    posted: "3 hours ago",
    description:
      "Build multimodal intelligence systems for enterprise assistants.",
    skills: ["Python", "Vision-Language Models", "MLOps", "Kubernetes"],
  },
  {
    id: "job-3",
    title: "Backend Engineer - Platform",
    company: "CloudForge Tech",
    location: "Hyderabad, India",
    type: "Full-time",
    remote: false,
    salary: "₹18-30 LPA",
    posted: "1 day ago",
    description: "Design scalable APIs and improve backend reliability.",
    skills: ["Node.js", "Express", "PostgreSQL", "Redis"],
  },
  {
    id: "job-4",
    title: "Frontend React Engineer",
    company: "WebArcade",
    location: "Kolkata, India",
    type: "Full-time",
    remote: true,
    salary: "₹11-17 LPA",
    posted: "6 hours ago",
    description: "Ship performant UI for consumer-grade web applications.",
    skills: ["React", "Vite", "TypeScript", "Cypress"],
  },
  {
    id: "job-5",
    title: "Backend Python Developer",
    company: "ByteHelix",
    location: "Jaipur, India",
    type: "Full-time",
    remote: false,
    salary: "₹10-16 LPA",
    posted: "14 hours ago",
    description:
      "Create APIs and data services for workflow automation products.",
    skills: ["Python", "Django", "PostgreSQL", "Celery"],
  },
  {
    id: "job-6",
    title: "Backend Golang Engineer",
    company: "CoreMesh",
    location: "Pune, India",
    type: "Full-time",
    remote: true,
    salary: "₹17-29 LPA",
    posted: "2 days ago",
    description: "Develop high-throughput services for financial data systems.",
    skills: ["Go", "gRPC", "PostgreSQL", "Docker"],
  },
  {
    id: "job-7",
    title: "Full Stack Product Engineer",
    company: "FlowOrbit",
    location: "Mumbai, India",
    type: "Full-time",
    remote: true,
    salary: "₹14-23 LPA",
    posted: "6 hours ago",
    description:
      "Own end-to-end feature delivery for a fast-moving product team.",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
  },
  {
    id: "job-8",
    title: "DevOps Cloud Engineer",
    company: "OrbitDeploy",
    location: "Gurgaon, India",
    type: "Full-time",
    remote: false,
    salary: "₹16-26 LPA",
    posted: "12 hours ago",
    description:
      "Automate deployments, observability, and platform reliability.",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
  },
];
let currentSubscriptionRole = "FREE";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const roleFromPlan = (plan) => {
  if (plan === "starter") {
    return "STARTER";
  }

  if (plan === "pro") {
    return "PRO";
  }

  return "FREE";
};

const filterJobs = (query, location) => {
  const normalizedQuery = normalizeText(query);
  const normalizedLocation = normalizeText(location);

  return jobsCatalog.filter((job) => {
    const haystack = [
      job.title,
      job.company,
      job.location,
      job.description,
      ...(job.skills || []),
    ]
      .join(" ")
      .toLowerCase();

    const queryMatch = !normalizedQuery || haystack.includes(normalizedQuery);
    const locationMatch =
      !normalizedLocation ||
      normalizeText(job.location).includes(normalizedLocation);

    return queryMatch && locationMatch;
  });
};

const paginateJobs = (items, page) => {
  const pageSize = 6;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
};

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  try {
    const parsedOrigin = new URL(origin);
    return (
      parsedOrigin.protocol === "http:" &&
      (parsedOrigin.hostname === "localhost" ||
        parsedOrigin.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/resume/pdf", (req, res) => {
  const data = req.body || {};
  const safeName = String(data.fullName || "resume")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "resume";
  const document = new PDFDocument({ size: "A4", margin: 42 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${safeName}-resume.pdf"`);
  document.pipe(res);
  document.fontSize(20).font("Helvetica-Bold").text(data.fullName || "Resume", { align: "center" });
  document.moveDown(0.25).fontSize(10).font("Helvetica").text(
    [data.phone, data.email, data.linkedin, data.github, data.location].filter(Boolean).join(" | "),
    { align: "center" },
  );

  const section = (title, value) => {
    if (!value) return;
    document.moveDown(0.8).fontSize(12).font("Helvetica-Bold").text(title);
    document.moveDown(0.2).fontSize(10).font("Helvetica").text(value);
  };

  section("Summary", data.summary);
  section("Technical Skills", [data.skillsLanguages, data.skillsBackend, data.skillsDatabases, data.skillsTools].filter(Boolean).join(" | "));
  section("Professional Experience", (Array.isArray(data.experience) ? data.experience : []).map((item) => `${item.title || ""} - ${item.company || ""} (${item.startDate || ""} - ${item.endDate || ""})\n${item.bullets || ""}`).join("\n\n"));
  section("Projects", (Array.isArray(data.projects) ? data.projects : []).map((item) => `${item.title || ""} - ${item.techStack || ""}\n${item.bullets || ""}`).join("\n\n"));
  section("Education", `${data.degree || ""}\n${data.college || ""} | ${data.eduLocation || ""} | ${data.eduStart || ""}-${data.eduEnd || ""} | CGPA: ${data.cgpa || ""}`);
  document.end();
});

app.get("/subscription/status", (_req, res) => {
  res.json({ role: currentSubscriptionRole, message: "Subscription loaded." });
});

app.post("/subscription/upgrade/starter", (_req, res) => {
  currentSubscriptionRole = roleFromPlan("starter");
  res.json({ role: currentSubscriptionRole, message: "Upgraded to Starter." });
});

app.post("/subscription/upgrade/pro", (_req, res) => {
  currentSubscriptionRole = roleFromPlan("pro");
  res.json({ role: currentSubscriptionRole, message: "Upgraded to Pro." });
});

app.get("/jobs/search", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  const location =
    typeof req.query.location === "string" ? req.query.location : "";
  const page = Number.parseInt(
    typeof req.query.page === "string" ? req.query.page : "1",
    10,
  );

  const matched = filterJobs(q, location);
  const results = paginateJobs(matched, page);

  return res.json({
    jobs: results,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    hasMore: matched.length > results.length,
    total: matched.length,
  });
});

app.get("/jobs/applied", (_req, res) => {
  return res.json(Array.from(appliedJobsStore));
});

app.post("/jobs/apply", (req, res) => {
  const jobId = typeof req.body.jobId === "string" ? req.body.jobId : "";
  if (!jobId) {
    return res.status(400).json({ error: "jobId is required." });
  }

  appliedJobsStore.add(jobId);
  return res.json({ message: "Application saved.", jobId });
});

app.post("/api/ats/parse", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Resume PDF is required." });
    }

    if (!file.mimetype.includes("pdf")) {
      return res.status(400).json({ error: "Only PDF resumes are supported." });
    }

    const parsed = await pdfParse(file.buffer);
    const resumeText = parsed.text || "";
    const sections = parseResumeSections(resumeText);

    return res.json({
      resumeText,
      sections: Object.fromEntries(
        Object.entries(sections).map(([key, value]) => [
          key,
          {
            preview: value.lines.slice(0, 4),
            wordCount: value.wordCount,
          },
        ]),
      ),
      totals: {
        resumeWordCount: resumeText.trim()
          ? resumeText.trim().split(/\s+/).length
          : 0,
      },
    });
  } catch (error) {
    console.error("ATS resume parse failed:", error);
    return res.status(500).json({ error: "Failed to parse resume." });
  }
});

app.post("/api/ats/score", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;
    const jobDescription = req.body.jobDescription;

    if (!file) {
      return res.status(400).json({ error: "Resume PDF is required." });
    }

    if (!file.mimetype.includes("pdf")) {
      return res.status(400).json({ error: "Only PDF resumes are supported." });
    }

    if (typeof jobDescription !== "string" || !jobDescription.trim()) {
      return res.status(400).json({ error: "Job description is required." });
    }

    const parsed = await pdfParse(file.buffer);
    const resumeText = parsed.text || "";

    if (!resumeText.trim()) {
      return res
        .status(400)
        .json({ error: "Could not read text from the PDF resume." });
    }

    const analysis = await analyzeResumeAgainstJob(resumeText, jobDescription);
    return res.json(analysis);
  } catch (error) {
    console.error("ATS scoring failed:", error);
    return res.status(500).json({ error: "Failed to analyze resume." });
  }
});

app.post("/api/portfolio/resume", resumeUpload.single("resume"), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Resume PDF is required." });
    }

    if (!file.mimetype.includes("pdf")) {
      return res.status(400).json({ error: "Only PDF resumes are supported." });
    }

    const id = crypto.randomUUID();
    const fileName = file.originalname || "resume.pdf";
    resumeStore.set(id, {
      fileName,
      mimeType: file.mimetype || "application/pdf",
      buffer: file.buffer,
      createdAt: Date.now(),
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return res.json({
      resumeUrl: `${baseUrl}/api/portfolio/resume/${id}`,
      resumeFileName: fileName,
    });
  } catch (error) {
    console.error("Resume upload failed:", error);
    return res.status(500).json({ error: "Failed to upload resume." });
  }
});

app.get("/api/portfolio/resume/:id", (req, res) => {
  const record = resumeStore.get(req.params.id);
  if (!record) {
    return res.status(404).send("Resume not found.");
  }

  res.setHeader("Content-Type", record.mimeType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${record.fileName}"`,
  );
  return res.send(record.buffer);
});

app.post("/api/portfolio/generate", (req, res) => {
  try {
    const {
      fullName,
      title,
      tagline,
      bio,
      email,
      location,
      github,
      linkedin,
      resumeUrl,
      hireLink,
      profileImageUrl,
      resumeFileName,
      ctaPrimaryText,
      ctaSecondaryText,
      template,
      skills,
      projects,
      education,
      experience,
      theme,
    } = req.body;

    if (typeof fullName !== "string" || !fullName.trim()) {
      return res.status(400).json({ error: "Full name is required." });
    }

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Professional title is required." });
    }

    const html = generatePortfolioPage({
      fullName,
      title,
      tagline: typeof tagline === "string" ? tagline : "",
      bio: typeof bio === "string" ? bio : "",
      email: typeof email === "string" ? email : "",
      location: typeof location === "string" ? location : "",
      github: typeof github === "string" ? github : "",
      linkedin: typeof linkedin === "string" ? linkedin : "",
      resumeUrl: typeof resumeUrl === "string" ? resumeUrl : "",
      hireLink: typeof hireLink === "string" ? hireLink : "",
      profileImageUrl:
        typeof profileImageUrl === "string" ? profileImageUrl : "",
      resumeFileName:
        typeof resumeFileName === "string" ? resumeFileName : "resume.pdf",
      ctaPrimaryText: typeof ctaPrimaryText === "string" ? ctaPrimaryText : "",
      ctaSecondaryText:
        typeof ctaSecondaryText === "string" ? ctaSecondaryText : "",
      template: typeof template === "string" ? template : "modern",
      skills: Array.isArray(skills) ? skills : [],
      projects: Array.isArray(projects) ? projects : [],
      education: Array.isArray(education) ? education : [],
      experience: Array.isArray(experience) ? experience : [],
      theme: typeof theme === "string" ? theme : "midnight",
    });

    const slug =
      fullName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "portfolio";

    return res.json({
      html,
      theme: typeof theme === "string" ? theme : "midnight",
      fileName: `${slug}-portfolio.html`,
    });
  } catch (error) {
    console.error("Portfolio generation failed:", error);
    return res.status(500).json({ error: "Failed to generate portfolio." });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
