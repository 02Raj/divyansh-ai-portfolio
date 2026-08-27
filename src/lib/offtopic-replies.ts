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
        `Ek joke suno: Java developers chashma kyun pehnte hain? Kyunki wo C# (see sharp) nahi kar paate! 😂 Jokes se hatkar — meri asli punchlines production mein hain: SlantPOS, TechPlusNexus. Detail chahiye?`,
        `Main kisi insaan ko roast karne se behtar ek kharab API design ko roast karna pasand karunga. 🔥 Baaki mere skills aur projects ke baare mein pucho — wahan asli masala hai!`,
      ],
      p
    );
  }

  // AI / meta questions about the bot
  if (/\b(who made you|are you real|chatgpt|gemini|sarvam|ai model)\b/.test(p)) {
    return pick(
      [
        `Main Divyansh ka AI avatar hoon — ChatGPT ya Gemini ka door ka ristedar! 😎 Mera kaam uske resume aur career ke baare mein baat karna hai. Aaiye "Recent projects" par charcha karein!`,
        `Socho main Divyansh ka ek smart interactive resume hoon jisme thodi personality hai. Main skills, experience aur projects mein ekdum champion hoon — koi ek try karke dekho!`,
      ],
      p
    );
  }

  // Default — playful deflect, mention their question
  return pick(
    [
      `Arey bhai, "${q}" ke baare me toh mujhe bhi Google karna padega! 😂 Main Divyansh ka AI assistant hoon, aur meri training sirf uske professional experience (Java, Angular) par hui hai. Kuch tech related pucho ya meri skills dekho!`,
      `Haha, "${q}"? Yeh out of syllabus question tha! 😅 Meri expertise SlantPOS aur Spring Boot mein hai. Agar aapko Divyansh ko hire karna hai ya uske projects dekhne hain, toh zaroor batao!`,
      `Bhai "${q}" ka answer dunga toh hallucinate kar jaunga. 🤖 Main yahan Divyansh ki portfolio represent karne aaya hoon. Projects, experience, ya skills ke baare mein kuch bhi puch lo — I am fully loaded for that! 🚀`,
      `Interesting! "${q}" mere resume playbook me nahi hai. Par agar aapko backend architecture ya Angular frontend ke baare mein kuch puchna hai, toh main ready hoon! Kya bolte ho, skills ya experience par baat karein?`,
      `"${q}" — lagta hai aap mera test le rahe ho! 🕵️‍♂️ Main sirf Divyansh ke career aur tech stack ke baare me jaanta hoon. Aaiye, kaam ki baat karte hain — uske projects aur experience check karein?`
    ],
    p
  );
}
