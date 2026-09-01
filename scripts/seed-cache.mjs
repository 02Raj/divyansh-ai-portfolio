import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import mongoose from "mongoose";

const STATIC = {
  about:
    "Hey there! I'm Divyansh Raj, a Java Full-Stack Developer based in Noida. With 3+ years at SlantCo, I build scalable apps with Spring Boot, Java, REST APIs, and Angular.\n\nI've shipped end-to-end features on SlantPOS (restaurant POS with realtime kitchen workflows) and built TechPlusNexus (AI blogging platform on React + Spring Boot, live at techplusnexus.fun) with AWS deploy.\n\nI hold a B.Tech in ECE from Bundelkhand Institute of Engineering and Technology (2017–2021). When I'm not coding, I enjoy cricket and a good plate of biryani.",
  skills:
    "Here are my core skills:\n\n• Languages: Java (Core & Advanced), JavaScript, TypeScript, SQL\n• Frontend: Angular 19, Angular Material, PrimeNG, RxJS, NgRx, HTML5, CSS3, responsive UI\n• Backend: Spring Boot, Spring MVC, Spring Data JPA, Hibernate, JDBC, REST APIs, Microservices, JWT\n• Databases: MySQL, PostgreSQL, MongoDB\n• Cloud & DevOps: AWS (EC2, S3, CloudWatch, IAM, Route 53), Docker, GitLab CI/CD\n• Tools: IntelliJ IDEA, VS Code, Postman, Git, GitHub, JIRA",
  projects:
    "Absolutely! A few projects I'm proud of:\n\n1. SlantPOS — Point of Sale (Nov 2022 – Present)\n   • Tech Stack: Angular, Spring Boot, PostgreSQL, MongoDB, WebSocket\n   • Overview: Full restaurant POS — orders, billing, kitchen display, inventory, feedback\n   • Metrics: 15+ integrated modules · WebSocket realtime KDS sync · 2+ years in production\n\n2. TechPlusNexus — AI Blog Platform (Apr 2025 – May 2025)\n   • Tech Stack: React, Spring Boot, MongoDB, Gemini API, AWS\n   • Overview: Read/generate tech blogs with JWT auth and content management\n   • Metrics: Full AWS deploy (EC2/S3/Route53) · JWT-secured API · live at techplusnexus.fun\n\n3. TutorPe — Ed-tech SaaS (Apr 2025 – Present)\n   • Tech Stack: Next.js, TypeScript, Firebase, Firestore, Vercel\n   • Metrics: Live at tutorpe.in · attendance + fee tracking · WhatsApp batch alerts\n\n4. CloudSaathi — AWS Agentic Assistant (Jul 2025 – Present)\n   • Tech Stack: Python, FastAPI, Amazon Bedrock, Boto3, Whisper, Docker\n   • Metrics: 10+ AWS services monitored · voice + text agent · human-in-the-loop safety",
  experience:
    "I'm a Full Stack Developer (Java + Angular) at SlantCo, Noida (Nov 2022 – Present).\n\n• Built 10+ Spring Boot REST APIs (Java 8) to improve scalability and response time\n• Implemented JPA/Hibernate for ORM, transactions, and efficient DB access\n• Developed Angular UI modules integrated with Spring Boot APIs\n• Optimized queries and backend logic for high-traffic modules\n• Worked Agile/Scrum — sprint planning, code reviews, production deploys",
  goals:
    "My long-term goal is to build scalable, production-grade Java and Angular systems. In the short term, I'm focused on deepening cloud (AWS), microservices, and AI-assisted product features — like the work I did on TechPlusNexus.",
  hire: "That's fantastic to hear! I'm excited about the opportunity. Could you share more about the role and the team? Happy to discuss how my Java + Angular experience at SlantCo (SlantPOS, TechPlusNexus) can help. Reach me at divyanshraj02@gmail.com or 7236998742 — we can also set up a quick call.",
};

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

const schema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    answer: { type: String, required: true },
    source: {
      type: String,
      enum: ["sarvam", "static", "manual"],
      default: "static",
    },
  },
  { timestamps: true }
);

const CachedResponse =
  mongoose.models.CachedResponse ||
  mongoose.model("CachedResponse", schema);

await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 20000,
  dbName: "ai_portfolio",
});

for (const [key, answer] of Object.entries(STATIC)) {
  await CachedResponse.findOneAndUpdate(
    { key },
    { key, answer, source: "static" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("SEEDED", key);
}

console.log("TOTAL_DOCS", await CachedResponse.countDocuments());
await mongoose.disconnect();
