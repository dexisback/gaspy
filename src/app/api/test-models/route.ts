import { NextResponse } from "next/server";
import { gemini } from "@/lib/gemini";

export async function GET() {
  const response = await gemini.models.generateContent({
    model: "gemini-flash-latest",
    contents: "Say hello",
  });

  return NextResponse.json({
    text: response.text,
  });
}