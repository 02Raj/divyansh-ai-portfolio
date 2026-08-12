"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Braces,
  Code2,
  Database,
  Send,
  Server,
  Terminal,
  User,
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const PROFILE_SRC = "/divyansh-profile.jpg";

const formatResponse = (content: string) => {
  const escapeRegex = (string: string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  let formattedContent = content.replace(/\*\*/g, "");

  const projectHighlights = [
    "TechPlusNexus",
    "SlantPOS",
    "techplusnexus.fun",
  ];

  const techHighlights = [
    "Angular",
    "Angular 19",
    "React",
    "JavaScript",
    "TypeScript",
    "Spring Boot",
    "Spring MVC",
    "Java",
    "JPA",
    "Hibernate",
    "JWT",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Angular Material",
    "PrimeNG",
    "RxJS",
    "NgRx",
    "REST APIs",
    "Microservices",
    "WebSocket",
    "Docker",
    "AWS",
    "EC2",
    "S3",
    "CloudWatch",
    "Route 53",
    "Gemini",
    "GitLab CI/CD",
  ];

  const companyHighlights = [
    "SlantCo",
    "Noida",
    "Bundelkhand Institute of Engineering and Technology",
    "Jhansi",
  ];

  projectHighlights.forEach((project) => {
    const regex = new RegExp(`\\b${escapeRegex(project)}\\b`, "gi");
    formattedContent = formattedContent.replace(regex, (match) => {
      if (!match.includes("span")) {
        return `<span class="tech-highlight">${match}</span>`;
      }
      return match;
    });
  });

  techHighlights.forEach((tech) => {
    const simpleRegex = new RegExp(`\\b${escapeRegex(tech)}\\b`, "gi");
    formattedContent = formattedContent.replace(simpleRegex, (match) => {
      if (!match.includes("span")) {
        return `<span class="tech-highlight">${match}</span>`;
      }
      return match;
    });
  });

  companyHighlights.forEach((company) => {
    const regex = new RegExp(`\\b${escapeRegex(company)}\\b`, "gi");
    formattedContent = formattedContent.replace(regex, (match) => {
      if (!match.includes("span")) {
        return `<span class="company-highlight">${match}</span>`;
      }
      return match;
    });
  });

  formattedContent = formattedContent.replace(
    /^•\s/gm,
    '<span class="bullet-point">•</span> '
  );
  formattedContent = formattedContent.replace(/^\d+\.\s/gm, (match) => {
    return `<span class="number-point">${match}</span>`;
  });

  return formattedContent;
};

function TechBackdrop() {
  const icons = [
    { Icon: Database, className: "left-[8%] top-[18%] size-10", delay: "0s" },
    { Icon: Braces, className: "right-[10%] top-[22%] size-12", delay: "1.2s" },
    { Icon: Code2, className: "left-[14%] bottom-[28%] size-9", delay: "2s" },
    { Icon: Terminal, className: "right-[16%] bottom-[24%] size-10", delay: "0.6s" },
    { Icon: Server, className: "left-[42%] top-[12%] size-8", delay: "1.8s" },
    { Icon: Database, className: "right-[38%] bottom-[14%] size-8", delay: "2.4s" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {icons.map(({ Icon, className, delay }, i) => (
        <Icon
          key={i}
          className={`tech-glyph absolute ${className}`}
          style={{ animationDelay: delay }}
          strokeWidth={1.25}
        />
      ))}
    </div>
  );
}

const TypingIndicator = () => (
  <div className="flex items-start gap-3 max-w-[85%] animate-fade-in">
    <Avatar className="w-9 h-9 border border-white/10">
      <AvatarImage src={PROFILE_SRC} alt="Divyansh Raj" />
      <AvatarFallback className="bg-secondary text-sm font-semibold">DR</AvatarFallback>
    </Avatar>
    <div className="msg-assistant rounded-2xl px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Divyansh is typing</span>
        <div className="flex gap-1">
          {[0, 150, 300].map((d) => (
            <div
              key={d}
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

async function askPortfolio(prompt: string, sessionId: string) {
  const response = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, sessionId }),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json() as Promise<{ answer: string; sessionId?: string }>;
}

const PortfolioChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => Date.now().toString());
  const [clickedTopics, setClickedTopics] = useState<Set<string>>(new Set());
  const [hasClickedAny, setHasClickedAny] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasChat = messages.length > 0 || isTyping;

  const quickActions = [
    { id: "about", label: "👋 Tell me about yourself", emoji: "👋" },
    { id: "skills", label: "🔧 Technical skills", emoji: "🔧" },
    { id: "projects", label: "🚀 Recent projects", emoji: "🚀" },
    { id: "experience", label: "💼 Work experience", emoji: "💼" },
    { id: "goals", label: "🎯 Career goals", emoji: "🎯" },
    { id: "hire", label: "✨ I want to hire you", emoji: "✨" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content: trimmed,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(true);

    try {
      const data = await askPortfolio(trimmed, sessionId);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.answer,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "Sorry, I couldn't get a response. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (actionId: string) => {
    const action = quickActions.find((a) => a.id === actionId);
    if (!action) return;

    if (!hasClickedAny) {
      setClickedTopics(new Set([actionId]));
      setHasClickedAny(true);
    } else {
      setClickedTopics(new Set(quickActions.map((a) => a.id)));
    }

    await sendPrompt(action.label);
  };

  const handleSendMessage = async () => {
    const value = inputValue;
    setInputValue("");
    await sendPrompt(value);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <TechBackdrop />

      <main
        className={`relative z-10 flex-1 flex flex-col w-full max-w-3xl mx-auto px-4 sm:px-6 ${
          hasChat ? "pt-8 pb-4 justify-start" : "justify-center py-10"
        }`}
      >
        <section
          className={`text-center animate-fade-in-up ${
            hasChat ? "mb-6 shrink-0" : "mb-10"
          }`}
        >
          <div className={`relative mx-auto mb-5 ${hasChat ? "w-16 h-16" : "w-24 h-24 sm:w-28 sm:h-28"}`}>
            <Avatar
              className={`mx-auto border border-white/15 shadow-[0_0_40px_hsl(217_92%_62%/0.18)] transition-all duration-500 ${
                hasChat ? "w-16 h-16" : "w-24 h-24 sm:w-28 sm:h-28"
              }`}
            >
              <AvatarImage
                src={PROFILE_SRC}
                alt="Divyansh Raj"
                className="object-cover"
              />
              <AvatarFallback className="bg-secondary text-2xl font-bold">
                DR
              </AvatarFallback>
            </Avatar>
          </div>

          <h1
            className={`font-[family-name:var(--font-syne)] font-extrabold gradient-text tracking-tight ${
              hasChat
                ? "text-3xl sm:text-4xl mb-1"
                : "text-4xl sm:text-5xl lg:text-6xl mb-3"
            }`}
          >
            Divyansh Raj
          </h1>
          <p
            className={`text-foreground/90 font-medium ${
              hasChat ? "text-sm mb-0" : "text-lg sm:text-xl mb-5"
            }`}
          >
            AI Portfolio Assistant
          </p>
          {!hasChat && (
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-base sm:text-[1.05rem]">
              Welcome to my interactive AI portfolio! I&apos;m a Java Full-Stack
              Developer with 3+ years of experience (Spring Boot + Angular). Ask
              me about SlantPOS, TechPlusNexus, skills, or my background.
            </p>
          )}
        </section>

        {hasChat && (
          <section className="flex-1 min-h-0 overflow-y-auto space-y-5 mb-6 pr-1 animate-fade-in">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start gap-3 max-w-[92%] sm:max-w-[85%]">
                  {message.type === "assistant" && (
                    <Avatar className="w-8 h-8 border border-white/10 shrink-0 mt-1">
                      <AvatarImage src={PROFILE_SRC} alt="Divyansh Raj" />
                      <AvatarFallback className="bg-secondary text-xs font-semibold">
                        DR
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === "user" ? "msg-user" : "msg-assistant"
                    }`}
                  >
                    <div
                      className="whitespace-pre-wrap leading-relaxed text-sm sm:text-[0.95rem] formatted-content"
                      dangerouslySetInnerHTML={{
                        __html:
                          message.type === "assistant"
                            ? formatResponse(message.content)
                            : message.content,
                      }}
                    />
                    <p className="text-[11px] mt-2 opacity-50">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.type === "user" && (
                    <Avatar className="w-8 h-8 border border-white/10 shrink-0 mt-1">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </section>
        )}

        <section className="shrink-0 w-full animate-fade-in-up" style={{ animationDelay: "120ms" }}>
          <div className="composer-shell flex items-center gap-2 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about my experience, projects, or skills..."
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/70 h-11"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="send-chip h-11 w-11 rounded-xl text-primary hover:text-primary disabled:opacity-40"
              variant="ghost"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            {quickActions
              .filter((action) => !clickedTopics.has(action.id))
              .map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleQuickAction(action.id)}
                  disabled={isTyping}
                  className="topic-pill rounded-full px-3.5 py-2 text-sm text-foreground/90 disabled:opacity-50"
                >
                  <span className="mr-1.5">{action.emoji}</span>
                  {action.label.replace(action.emoji, "").trim()}
                </button>
              ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 mt-auto border-t border-white/5 py-5 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground/70">
          © 2025 Divyansh Raj. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PortfolioChat;
