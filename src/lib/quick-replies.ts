import { leetcodeProfile } from "@/lib/leetcode-profile";
import { getExperienceYears } from "@/lib/resume-data";

/** Static fallbacks — used when Sarvam is down; also seeded into Mongo. */
export const STATIC_QUICK_REPLIES = {
  get about() {
    return `Hey there! I'm Divyansh Raj, a Java Full-Stack Developer based in Noida. With ${getExperienceYears()} years at SlantCo, I build scalable apps with Spring Boot, Java, REST APIs, and Angular.

I've shipped end-to-end features on SlantPOS (restaurant POS with realtime kitchen workflows) and built TechPlusNexus (AI blogging platform on React + Spring Boot, live at techplusnexus.fun) with AWS deploy.

I'm actively practicing DSA on LeetCode — ${leetcodeProfile.totalSolved}+ problems solved (Easy ${leetcodeProfile.easy}, Medium ${leetcodeProfile.medium}, Hard ${leetcodeProfile.hard}): ${leetcodeProfile.profileUrl}

I hold a B.Tech in ECE from Bundelkhand Institute of Engineering and Technology (2017–2021). When I'm not coding, I enjoy cricket and a good plate of biryani. You can check out my code at https://github.com/02Raj.`;
  },

  skills: `Here are my core skills:

• DSA / LeetCode: ${leetcodeProfile.totalSolved}+ problems solved (Easy ${leetcodeProfile.easy}, Medium ${leetcodeProfile.medium}, Hard ${leetcodeProfile.hard}) — ${leetcodeProfile.profileUrl}
• Languages: Java (Core & Advanced), JavaScript, TypeScript, SQL
• Frontend: Angular 19, Angular Material, PrimeNG, RxJS, NgRx, HTML5, CSS3, responsive UI
• Backend: Spring Boot, Spring MVC, Spring Data JPA, Hibernate, JDBC, REST APIs, Microservices, JWT
• Databases: MySQL, PostgreSQL, MongoDB
• Cloud & DevOps: AWS (EC2, S3, CloudWatch, IAM, Route 53), Docker, GitLab CI/CD
• Tools: IntelliJ IDEA, VS Code, Postman, Git, GitHub, JIRA`,

  projects: `Absolutely! A few projects I'm proud of:

1. SlantPOS — Point of Sale (Nov 2022 – Present)
   • Tech Stack: Angular, Spring Boot, PostgreSQL, MongoDB, WebSocket
   • Overview: Full restaurant POS — orders, billing, kitchen display, inventory, feedback
   • Metrics: 15+ integrated modules · WebSocket realtime KDS sync · 2+ years in production

2. CiteMind — Grounded document Q&A (Sep 2026)
   • Tech Stack: Java, Spring Boot, Angular, PostgreSQL, pgvector, JWT, Spring AI, Gemini, SSE
   • Overview: Upload PDF/Markdown, retrieve cited chunks, then LLM; insufficient_context if no match
   • Metrics: RAG + citations · SSE streaming · github.com/02Raj/citemind-

3. Kirana Voice Assistant — Voice-first kirana demo (Sep 2026)
   • Tech Stack: Java 17, Spring Boot 3.5, Angular 20, Sarvam STT, Sarvam chat, Bulbul TTS
   • Overview: Hindi/Hinglish/English — rates, stock, orders via push-to-talk; Gupta Kirana / Ramesh bhai persona
   • Metrics: Mic → STT → chat → TTS pipeline · github.com/02Raj/kirana-voice-assistant

4. TechPlusNexus — AI Blog Platform (Apr 2025 – May 2025)
   • Tech Stack: React, Spring Boot, MongoDB, Gemini API, AWS
   • Metrics: Full AWS deploy · JWT API · live at techplusnexus.fun

5. Razorpay Clone Backend (2025)
   • Tech Stack: Spring Boot, PostgreSQL, Spring Data JPA
   • Metrics: JPA + PostgreSQL · github.com/02Raj/razorpay-clone-backend

6. TutorPe — Ed-tech SaaS (Apr 2025 – Present)
   • Metrics: Live at tutorpe.in · fee tracking · WhatsApp alerts`,

  experience: `I'm a Full Stack Developer (Java + Angular) at SlantCo, Noida (Nov 2022 – Present).

• Built 10+ Spring Boot REST APIs (Java 8) to improve scalability and response time
• Implemented JPA/Hibernate for ORM, transactions, and efficient DB access across high-traffic modules
• Developed Angular UI modules integrated with Spring Boot APIs
• Optimized queries and backend logic — measurable gains on peak-hour order flows
• Worked Agile/Scrum — sprint planning, code reviews, production deploys`,

  goals: `My long-term goal is to build scalable, production-grade Java and Angular systems. In the short term, I'm focused on deepening cloud (AWS), microservices, and AI-assisted product features — like the work I did on TechPlusNexus.`,

  hire: `That's fantastic to hear! I'm excited about the opportunity. Could you share more about the role and the team? Happy to discuss how my Java + Angular experience at SlantCo (SlantPOS, TechPlusNexus) can help. Reach me at divyanshraj02@gmail.com or 7236998742 — we can also set up a quick call.`,
};
