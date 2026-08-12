/** Compact resume — keep fields short to cut Sarvam prompt tokens. */
export const resumeData = {
  name: "Divyansh Raj",
  phone: "7236998742",
  email: "divyanshraj02@gmail.com",
  location: "Noida, Uttar Pradesh",
  summary:
    "Java Full-Stack Developer, 3+ yrs. Spring Boot, Java, REST APIs, Angular. Backend + JPA/Hibernate, responsive Angular UI, performance-minded, Agile delivery.",
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
      name: "SlantPOS",
      period: "Nov 2022 – Present",
      blurb:
        "Restaurant POS: orders, billing, KDS, inventory, feedback; realtime front-desk↔kitchen workflows",
      stack: "Angular, Spring Boot, PostgreSQL, MongoDB, WebSocket",
      live: "",
    },
    {
      name: "TechPlusNexus",
      period: "Apr 2025 – May 2025",
      blurb:
        "AI blog platform (Gemini): auth, categories, AI posts; Spring Boot+JWT+MongoDB; AWS EC2/NGINX/SSL, S3 frontend, CloudWatch, Route53",
      stack: "React, Spring Boot, MongoDB, Gemini, AWS",
      live: "techplusnexus.fun",
    },
  ],
  education:
    "B.Tech ECE, Bundelkhand Institute of Engineering and Technology, Jhansi (2017–2021)",
  skills: {
    languages: "Java, JavaScript, TypeScript, SQL",
    frontend: "Angular 19, Material, PrimeNG, RxJS, NgRx, HTML5, CSS3",
    backend: "Spring Boot/MVC, JPA, Hibernate, JDBC, REST, Microservices, JWT",
    databases: "MySQL, PostgreSQL, MongoDB",
    cloud: "AWS EC2/S3/CloudWatch/IAM/Route53, Docker, GitLab CI/CD",
    tools: "IntelliJ, VS Code, Postman, Git, GitHub, JIRA",
  },
  goals:
    "Build scalable Java/Angular systems; deepen cloud, microservices, and AI-assisted product features.",
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
        `${data.name} | ${data.location} | ${data.email}`,
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
        `Tools: ${data.skills.tools}`,
      ].join("\n");
    case "projects":
      return data.projects
        .map(
          (p) =>
            `${p.name} (${p.period}): ${p.blurb}. Stack: ${p.stack}.${
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
