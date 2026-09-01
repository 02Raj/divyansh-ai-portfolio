"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getExperienceLabel, portfolioHighlights } from "@/lib/resume-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GitBranch,
  Mic,
  Send,
  Square,
  User,
  Volume2,
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  audioBase64?: string;
  isStreaming?: boolean;
}

const PROFILE_SRC = "/divyansh-profile.jpg";

/** Simulates word-by-word streaming like ChatGPT */
function useStreamText(fullText: string, active: boolean, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(fullText); setDone(true); return; }
    setDisplayed("");
    setDone(false);
    const words = fullText.split(/(?<=\s)/);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(words.slice(0, i).join(""));
      if (i >= words.length) { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [fullText, active, speed]);

  return { displayed, done };
}

/** Individual message component with streaming support */
function StreamingMessage({ message, onStreamDone, playAudio }: {
  message: ChatMessage;
  onStreamDone?: (id: string) => void;
  playAudio: (b64: string) => void;
}) {
  const { displayed, done } = useStreamText(
    message.content,
    message.isStreaming === true,
    25
  );

  useEffect(() => {
    if (done && message.isStreaming && onStreamDone) {
      onStreamDone(message.id);
    }
  }, [done, message.isStreaming, message.id, onStreamDone]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const text = message.type === "assistant" ? displayed : message.content;
  const htmlContent = message.type === "assistant" ? formatResponse(text) : text;

  return (
    <div className={`rounded-2xl px-4 py-3 ${message.type === "user" ? "msg-user" : "msg-assistant"}`}>
      <div
        className="whitespace-pre-wrap leading-relaxed text-sm sm:text-[0.95rem] formatted-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-[11px] opacity-50">
          {formatTime(message.timestamp)}
        </p>
        {message.type === "assistant" && message.audioBase64 && (
          <button
            type="button"
            onClick={() => playAudio(message.audioBase64!)}
            className="voice-replay-btn ml-2 p-1 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Replay voice"
            title="Replay voice"
          >
            <Volume2 className="w-3.5 h-3.5 text-primary/70" />
          </button>
        )}
      </div>
    </div>
  );
}

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
    /(\d[\d,]*(?:\.\d+)?(?:%|\+|ms|s|k|K|M)?(?:\/\w+)?|\b\d+\+\b)/g,
    (match) => {
      if (match.includes("span")) return match;
      return `<span class="metric-highlight">${match}</span>`;
    }
  );

  formattedContent = formattedContent.replace(
    /^•\s/gm,
    '<span class="bullet-point">•</span> '
  );
  formattedContent = formattedContent.replace(/^\d+\.\s/gm, (match) => {
    return `<span class="number-point">${match}</span>`;
  });

  return formattedContent;
};

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
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const waveformRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasChat = messages.length > 0 || isTyping;

  // Mark streaming messages as done
  const handleStreamDone = useCallback((id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isStreaming: false } : m));
  }, []);

  // Draw waveform visualizer
  const drawWaveform = useCallback(() => {
    const analyser = analyserRef.current;
    const canvas = waveformRef.current;
    if (!analyser || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bars style waveform
      const barCount = 32;
      const barWidth = canvas.width / barCount;
      const step = Math.floor(bufferLength / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] ?? 128;
        const normalized = Math.abs(value - 128) / 128;
        const barHeight = Math.max(2, normalized * canvas.height * 0.9);

        ctx.fillStyle = "hsla(210, 90%, 58%, 0.85)";

        const x = i * barWidth + 1;
        const y = (canvas.height - barHeight) / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - 2, barHeight, 2);
        ctx.fill();
      }
    };
    draw();
  }, []);

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
          isStreaming: true,
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

  const playAudio = useCallback((base64: string) => {
    try {
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
        setIsSpeaking(false);
      }
      const audio = new Audio(`data:audio/wav;base64,${base64}`);
      currentAudioRef.current = audio;
      setIsSpeaking(true);
      audio.play().catch(console.error);
      audio.onended = () => { currentAudioRef.current = null; setIsSpeaking(false); };
      audio.onerror = () => { setIsSpeaking(false); };
    } catch (e) {
      console.error("Audio playback error:", e);
      setIsSpeaking(false);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio analyser for waveform visualizer
      const audioCtxLive = new AudioContext();
      const source = audioCtxLive.createMediaStreamSource(stream);
      const analyser = audioCtxLive.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      // Start waveform drawing
      drawWaveform();

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop waveform + tracks
        cancelAnimationFrame(animFrameRef.current);
        analyserRef.current = null;
        audioCtxLive.close().catch(() => {});
        stream.getTracks().forEach((t) => t.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size === 0) return;

        setIsProcessingVoice(true);
        setIsTyping(true);

        try {
          // Convert WebM/MP4 to WAV (16kHz, mono, 16-bit PCM)
          // Sarvam STT doesn't accept WebM — only WAV, MP3, AAC, etc.
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioCtx = new AudioContext({ sampleRate: 16000 });
          const decoded = await audioCtx.decodeAudioData(arrayBuffer);
          const channelData = decoded.getChannelData(0); // mono
          const sampleRate = 16000;

          // Resample if AudioContext didn't honour our sampleRate hint
          let samples = channelData;
          if (decoded.sampleRate !== sampleRate) {
            const ratio = decoded.sampleRate / sampleRate;
            const newLen = Math.floor(channelData.length / ratio);
            const resampled = new Float32Array(newLen);
            for (let i = 0; i < newLen; i++) {
              resampled[i] = channelData[Math.floor(i * ratio)];
            }
            samples = resampled;
          }

          // Encode WAV
          const wavBuffer = new ArrayBuffer(44 + samples.length * 2);
          const view = new DataView(wavBuffer);
          const writeStr = (off: number, s: string) => {
            for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
          };
          writeStr(0, "RIFF");
          view.setUint32(4, 36 + samples.length * 2, true);
          writeStr(8, "WAVE");
          writeStr(12, "fmt ");
          view.setUint32(16, 16, true);
          view.setUint16(20, 1, true); // PCM
          view.setUint16(22, 1, true); // mono
          view.setUint32(24, sampleRate, true);
          view.setUint32(28, sampleRate * 2, true);
          view.setUint16(32, 2, true);
          view.setUint16(34, 16, true);
          writeStr(36, "data");
          view.setUint32(40, samples.length * 2, true);
          for (let i = 0; i < samples.length; i++) {
            const s = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
          }
          await audioCtx.close();

          const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

          const formData = new FormData();
          formData.append("audio", wavBlob, "recording.wav");

          const res = await fetch("/api/voice", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Voice API failed");
          }

          const data = await res.json() as {
            transcript: string;
            answer: string;
            audioBase64: string | null;
          };

          // Add user message (transcript)
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: "user",
              content: `🎤 ${data.transcript}`,
              timestamp: new Date(),
            },
          ]);

          // Add assistant message with audio + streaming
          const assistantId = (Date.now() + 1).toString();
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              type: "assistant",
              content: data.answer,
              timestamp: new Date(),
              audioBase64: data.audioBase64 || undefined,
              isStreaming: true,
            },
          ]);

          // Auto-play the audio response
          if (data.audioBase64) {
            playAudio(data.audioBase64);
          }
        } catch (error) {
          console.error("Voice API Error:", error);
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: "Sorry, I couldn't process your voice message. Please try typing instead.",
              timestamp: new Date(),
            },
          ]);
        } finally {
          setIsTyping(false);
          setIsProcessingVoice(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied:", err);
      alert("Microphone access is required for voice input. Please allow microphone access and try again.");
    }
  }, [playAudio, drawWaveform]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current = null;
    }
  }, []);

  const handleMicClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

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
    <div className="relative min-h-screen flex flex-col">
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
            {/* Talking avatar pulse ring */}
            {isSpeaking && (
              <div className="absolute inset-0 rounded-full avatar-speaking-ring" />
            )}
            <Avatar
              className={`mx-auto border border-white/10 transition-all duration-300 ${
                isSpeaking ? "ring-2 ring-primary/40" : ""
              } ${
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
            className={`font-[family-name:var(--font-syne)] font-bold text-foreground tracking-tight ${
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
            <div className="flex flex-col items-center gap-5">
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-base sm:text-[1.05rem]">
                Welcome to my interactive AI portfolio! I&apos;m a Java Full-Stack
                Developer with {getExperienceLabel()} years of experience (Spring Boot + Angular). Ask
                me about SlantPOS, TechPlusNexus, skills, or my background.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
                {portfolioHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="stat-card rounded-lg px-3 py-3 text-center"
                  >
                    <p className="text-lg sm:text-xl font-semibold text-foreground tabular-nums">
                      {item.value}
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-snug">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <a 
                href="https://portfolio.divyanshraj.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-foreground text-sm font-medium hover:bg-white/10 transition-colors border border-white/5 shadow-sm"
              >
                <span>View Standard Portfolio</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </div>
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
                  <StreamingMessage
                    message={message}
                    onStreamDone={handleStreamDone}
                    playAudio={playAudio}
                  />
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
          {/* Live waveform during recording */}
          {isRecording && (
            <div className="waveform-container mb-3 flex items-center justify-center">
              <canvas
                ref={waveformRef}
                width={300}
                height={40}
                className="waveform-canvas rounded-xl"
              />
            </div>
          )}
          <div className="composer-shell flex items-center gap-2 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isRecording ? "🎤 Listening..." : isProcessingVoice ? "Processing voice..." : "Ask me about my experience, projects, or skills..."}
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/70 h-11"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isTyping || isRecording}
            />
            <Button
              onClick={handleMicClick}
              disabled={isTyping && !isRecording}
              size="icon"
              className={`h-11 w-11 rounded-xl transition-all duration-200 ${
                isRecording
                  ? "voice-btn-recording bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : isProcessingVoice
                  ? "text-muted-foreground opacity-50"
                  : "voice-btn text-primary hover:text-primary hover:bg-white/5"
              }`}
              variant="ghost"
              aria-label={isRecording ? "Stop recording" : "Start voice input"}
            >
              {isRecording ? (
                <Square className="w-4 h-4 fill-current" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="send-chip h-11 w-11 rounded-xl disabled:opacity-40"
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

      <footer className="relative z-10 mt-auto border-t border-white/5 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-xs sm:text-sm text-muted-foreground/70">
        <p>
          © 2025 Divyansh Raj. All rights reserved.
        </p>
        <a
          href="https://github.com/02Raj"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          <GitBranch className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </footer>
    </div>
  );
};

export default PortfolioChat;
