import { AssemblyAI } from "assemblyai"
import { NextResponse } from "next/server"

export async function GET(req) {
  if (!process.env.ASSEMBLY_API_KEY) {
    return NextResponse.json({ error: "Missing AssemblyAI API key" }, { status: 500 });
  }

  const assemblyAi = new AssemblyAI({ apiKey: process.env.ASSEMBLY_API_KEY });

  try {
    const token = await assemblyAi.realtime.createTemporaryToken({ expires_in: 3600 });
    return NextResponse.json(token);
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
  }
}
