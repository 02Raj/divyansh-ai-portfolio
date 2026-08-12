import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/sarvam";
import { resumeData } from "@/lib/resume-data";
import { ensureQuickRepliesSeeded } from "@/lib/seed-cache";

export async function POST(request: Request) {
  try {
    // Fire-and-forget friendly: wait so first quick-topic hits are instant
    await ensureQuickRepliesSeeded();

    const body = await request.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    const sessionId =
      typeof body?.sessionId === "string" ? body.sessionId : undefined;

    if (!prompt) {
      return NextResponse.json(
        { answer: "Please provide a prompt." },
        { status: 400 }
      );
    }

    const result = await getAIResponse(resumeData, prompt, sessionId);
    return NextResponse.json({
      answer: result.answer,
      sessionId,
      source: result.meta?.source,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { answer: "Server error occurred." },
      { status: 500 }
    );
  }
}
