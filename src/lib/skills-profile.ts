import { leetcodeProfile } from "@/lib/leetcode-profile";

/** Canonical skills blurb for Quick Topics. Keep `scripts/seed-cache.mjs` skills in sync. */
export function getSkillsQuickReply(): string {
  const lc = leetcodeProfile;
  return `Here are my core skills:

• DSA / LeetCode: ${lc.totalSolved}+ problems solved (Easy ${lc.easy}, Medium ${lc.medium}, Hard ${lc.hard}) — ${lc.profileUrl}
• Languages: Java (Core & Advanced), JavaScript, TypeScript, Python, SQL
• Frontend: Angular 19–20 (standalone components, signals, lazy routes), Angular Material, PrimeNG, RxJS, NgRx, React, Next.js, HTML5, CSS3, responsive UI
• Backend: Spring Boot 3.x, Spring Cloud Gateway, OpenFeign, Resilience4j, JPA, Hibernate, REST, Microservices, JWT, Kafka/Redpanda, transactional outbox, SSE & WebSocket
• Databases: PostgreSQL (pgvector / vector search), MySQL, MongoDB, Firebase/Firestore
• AI & RAG: RAG pipelines (chunking, embeddings, grounded citations), Spring AI, Gemini, Sarvam (STT, chat, Bulbul TTS), AWS Bedrock (Claude), Whisper, Amazon Polly
• Cloud & DevOps: AWS (EC2, S3, CloudWatch, IAM, Route 53, Bedrock), Docker, Vercel, GitLab CI/CD
• Tools: IntelliJ IDEA, VS Code, Postman, Git, GitHub, JIRA`;
}
