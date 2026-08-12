/** Witty off-topic replies — 0 Sarvam tokens, still engaging. */

function pick<T>(arr: T[], seed: string): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % arr.length;
  return arr[h]!;
}

function snippet(question: string, max = 48): string {
  const q = question.trim();
  if (q.length <= max) return q;
  return q.slice(0, max).trim() + "…";
}

export function getOffTopicReply(question: string): string {
  const p = question.toLowerCase().trim();
  const q = snippet(question);

  // Geography / GK trivia
  if (
    /\b(capital|population|president|prime minister|currency|continent)\b/.test(p) ||
    /\bwhat is the\b/.test(p) && /\b(of|in)\s+\w+/.test(p)
  ) {
    return pick(
      [
        `Good question! "${q}" — I'm more of a full-stack guy than a GK champ. 😄 New Delhi is India's capital, but the stack I'm most fluent in is Java + Angular. Want my current project story instead?`,
        `Ha! "${q}" took me back to school textbooks. 📚 I'm sharper on Spring Boot APIs than capitals — but yeah, India's capital is New Delhi. Curious about my work at SlantCo or TechPlusNexus?`,
        `"${q}" — fun trivia! I'm Divyansh's portfolio assistant, so I geek out on microservices more than geography. Ask me about SlantPOS or my skills — I'll nail those!`,
      ],
      p
    );
  }

  // Sports (personal interest — playful redirect)
  if (/\b(cricket|ipl|football|soccer|messi|ronaldo|kohli|dhoni|biryani)\b/.test(p)) {
    return pick(
      [
        `Cricket and biryani are definitely my vibe off the keyboard! 🏏🍲 On the code side, I live in Java, Angular, and cloud deployments — want the SlantPOS or TechPlusNexus breakdown?`,
        `Love the sports talk! Divyansh enjoys cricket when he's not shipping features. For the professional scorecard, check skills, projects, or work experience — those are home turf.`,
      ],
      p
    );
  }

  // Greetings / small talk
  if (/^(hi|hello|hey|hola|sup|yo|good\s+(morning|afternoon|evening)|namaste)\b/.test(p)) {
    return pick(
      [
        `Hey! 👋 Great to meet you. I'm Divyansh's AI portfolio — ask about my projects, Java/Angular stack, or experience at SlantCo. What would you like to explore?`,
        `Hello there! Welcome to my interactive portfolio. Pick a Quick Topic below or ask anything about my work — I'm all ears.`,
      ],
      p
    );
  }

  // Jokes / random fun
  if (/\b(joke|funny|laugh|bored|tell me something)\b/.test(p)) {
    return pick(
      [
        `Why do Java developers wear glasses? Because they don't C#! 😄 Jokes aside — my real punchlines are in production: SlantPOS, TechPlusNexus, and 3+ years of full-stack work. Want details?`,
        `I'd roast a bad API design before I'd roast a stranger. 🔥 Ask about my projects or skills — that's where the good stories live.`,
      ],
      p
    );
  }

  // AI / meta questions about the bot
  if (/\b(who made you|are you real|chatgpt|gemini|sarvam|ai model)\b/.test(p)) {
    return pick(
      [
        `I'm Divyansh's portfolio assistant — powered to answer questions about his career, not the universe. 😊 Try "Tell me about yourself" or "Recent projects" for the good stuff.`,
        `Think of me as Divyansh's interactive resume with personality. I shine on skills, experience, and projects — give me one of those!`,
      ],
      p
    );
  }

  // Default — playful deflect, mention their question
  return pick(
    [
      `😅 "${q}" is a fun detour — I'm tuned for Divyansh's professional story (Java, Angular, SlantPOS, TechPlusNexus). Throw me a career question and I'll give you a proper answer!`,
      `Interesting! "${q}" isn't in my resume playbook, but I can go deep on skills, current projects, or work experience. Which one sounds good?`,
      `Ha — "${q}" is outside my lane. I'm here for portfolio chat: projects, tech stack, SlantCo experience, or even "I want to hire you". Pick your adventure! 🚀`,
      `"${q}" — I'd need Wikipedia for that one! For Divyansh Raj stuff (full-stack, Spring Boot, Angular), I'm your guy. What should we dive into?`,
    ],
    p
  );
}
