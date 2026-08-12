import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/sarvam";
import { resumeData } from "@/lib/resume-data";

export async function POST(request: Request) {
  try {
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

    const answer = await getAIResponse(resumeData, prompt, sessionId);
    return NextResponse.json({ answer, sessionId });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { answer: "Server error occurred." },
      { status: 500 }
    );
  }
}
