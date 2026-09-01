/**
 * Joining date — single source of truth for experience calculation.
 * Divyansh joined SlantCo as a fresher on 8 Nov 2022.
 */
export const JOINING_DATE = new Date(2022, 10, 8); // 8 Nov 2022 (month is 0-indexed)

/**
 * Returns experience in years (e.g. "3.7", "4.2").
 * Auto-updates — no more manual edits!
 */
export function getExperienceYears(): string {
  const now = new Date();
  const diffMs = now.getTime() - JOINING_DATE.getTime();
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return diffYears.toFixed(1);
}

/** Friendly label like "3+ yrs" or "4+ yrs" */
export function getExperienceLabel(): string {
  return `${Math.floor(parseFloat(getExperienceYears()))}+`;
}

/** Landing-page stats — quantifiable, auto-updating where possible */
export const portfolioHighlights = [
  { value: `${getExperienceLabel()} yrs`, label: "Production experience" },
  { value: "5", label: "Shipped products" },
  { value: "15+", label: "SlantPOS modules" },
  { value: "3", label: "Live deployments" },
] as const;

/** Compact resume — keep fields short to cut Sarvam prompt tokens. */
export const resumeData = {
  name: "Divyansh Raj",
  phone: "7236998742",
  email: "divyanshraj02@gmail.com",
  github: "https://github.com/02Raj",
  location: "Noida, Uttar Pradesh",
  get summary() {
    return `Java Full-Stack Developer, ${getExperienceYears()} yrs. Spring Boot, Java, REST APIs, Angular, React/Next.js. Backend + JPA/Hibernate, responsive UI, cloud-native SaaS products, AI-assisted features, performance-minded, Agile delivery.`;
  },
  role: "Full Stack Developer (Java + Angular)",
  company: "SlantCo, Noida",
  duration: "Nov 2022 – Present",
  experience: [
    "Built Spring Boot REST APIs (Java 8); better scalability & response time",
    "JPA/Hibernate ORM: mapping, transactions, DB access",
    "Angular UI modules integrated with Spring Boot APIs",
    "Query/backend optimization for high-traffic modules",
    "Agile/Scrum: sprints, reviews, production deploys",
  ],
  projects: [
    {
      name: "CloudSaathi",
      period: "Jul 2025 – Present",
      blurb:
        "Voice/text agentic AI assistant for AWS cloud ops; human-in-the-loop safety for write ops, security audits, cost monitoring, phone alerts via Bolna AI",
      stack: "Python, FastAPI, Amazon Bedrock (Claude), Boto3, Whisper, Amazon Polly, Docker",
      live: "",
      metrics: ["10+ AWS services monitored", "Voice + text agent", "Human-in-the-loop for write ops"],
    },
    {
      name: "DoctorFlow (ClinicDesk)",
      period: "May 2025 – Present",
      blurb:
        "Clinic management SaaS: appointments, patient records, WhatsApp automation, AI document analysis, billing; multi-clinic support",
      stack: "React, TypeScript, Firebase, Firestore, Sarvam AI, Twilio, Vercel",
      live: "clinic-desk-app.vercel.app",
      metrics: ["Multi-clinic support", "WhatsApp appointment automation", "AI document analysis"],
    },
    {
      name: "TutorPe",
      period: "Apr 2025 – Present",
      blurb:
        "Ed-tech SaaS platform for tutors: student management, attendance, fee tracking, batch scheduling, WhatsApp notifications",
      stack: "Next.js, TypeScript, Firebase, Firestore, Vercel",
      live: "tutorpe.in",
      metrics: ["Live at tutorpe.in", "Attendance + fee tracking", "Batch scheduling + WhatsApp alerts"],
    },
    {
      name: "SlantPOS",
      period: "Nov 2022 – Present",
      blurb:
        "Restaurant POS: orders, billing, KDS, inventory, feedback; realtime front-desk↔kitchen workflows",
      stack: "Angular, Spring Boot, PostgreSQL, MongoDB, WebSocket",
      live: "",
      metrics: ["15+ integrated modules", "WebSocket realtime KDS sync", "2+ years in production"],
    },
    {
      name: "TechPlusNexus",
      period: "Apr 2025 – May 2025",
      blurb:
        "AI blog platform (Gemini): auth, categories, AI posts; Spring Boot+JWT+MongoDB; AWS EC2/NGINX/SSL, S3 frontend, CloudWatch, Route53",
      stack: "React, Spring Boot, MongoDB, Gemini, AWS",
      live: "techplusnexus.fun",
      metrics: ["Full AWS deploy (EC2/S3/Route53)", "JWT-secured API", "Gemini-powered content generation"],
    },
  ],
  education:
    "B.Tech ECE, Bundelkhand Institute of Engineering and Technology, Jhansi (2017–2021)",
  skills: {
    languages: "Java, JavaScript, TypeScript, Python, SQL",
    frontend: "Angular 19, React, Next.js, Material, PrimeNG, RxJS, NgRx, HTML5, CSS3",
    backend: "Spring Boot/MVC, JPA, Hibernate, FastAPI, REST, Microservices, JWT",
    databases: "MySQL, PostgreSQL, MongoDB, Firebase/Firestore",
    cloud: "AWS (EC2/S3/CloudWatch/IAM/Route53/Bedrock), Docker, Vercel, GitLab CI/CD",
    ai: "Amazon Bedrock (Claude), Gemini, Sarvam AI, Whisper, Amazon Polly, Bolna AI",
    tools: "IntelliJ, VS Code, Postman, Git, GitHub, JIRA",
  },
  goals:
    "Build scalable Java/Angular systems; deepen cloud, microservices, and AI-assisted product features. Currently building CloudSaathi — an agentic AI assistant for AWS cloud ops with voice, security audits, and cost monitoring.",
};

export type ResumeData = typeof resumeData;

/** Tiny context slices — never dump full resume unless needed. */
export function contextForIntent(
  data: ResumeData,
  intent:
    | "about"
    | "skills"
    | "projects"
    | "experience"
    | "goals"
    | "general"
): string {
  switch (intent) {
    case "about":
      return [
        `${data.name} | ${data.location} | ${data.email} | GitHub: ${data.github}`,
        data.summary,
        `${data.role} @ ${data.company} (${data.duration})`,
        `Projects: ${data.projects.map((p) => p.name).join(", ")}`,
        data.education,
      ].join("\n");
    case "skills":
      return [
        `Languages: ${data.skills.languages}`,
        `Frontend: ${data.skills.frontend}`,
        `Backend: ${data.skills.backend}`,
        `DB: ${data.skills.databases}`,
        `Cloud: ${data.skills.cloud}`,
        `AI/ML: ${data.skills.ai}`,
        `Tools: ${data.skills.tools}`,
      ].join("\n");
    case "projects":
      return data.projects
        .map(
          (p) =>
            `${p.name} (${p.period}): ${p.blurb}. Stack: ${p.stack}. Metrics: ${p.metrics.join("; ")}.${
              p.live ? ` Live: ${p.live}` : ""
            }`
        )
        .join("\n");
    case "experience":
      return [
        `${data.role} @ ${data.company} (${data.duration})`,
        ...data.experience.map((e) => `• ${e}`),
      ].join("\n");
    case "goals":
      return `${data.summary}\nGoals: ${data.goals}`;
    case "general":
    default:
      return [
        `${data.name} | ${data.role} @ ${data.company}`,
        data.summary,
        `Skills: ${data.skills.languages}; ${data.skills.backend}; ${data.skills.frontend}`,
        `Projects: ${data.projects.map((p) => `${p.name} (${p.stack})`).join("; ")}`,
      ].join("\n");
  }
}
