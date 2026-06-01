import { NextResponse } from "next/server";

import { gemini } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

import {
  createEmbedding,
  findSimilarChunks,
  findRelevantQAPairs,
} from "@/lib/embeddings";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const embedding = await createEmbedding(message);

    const chunks = await findSimilarChunks(embedding);
    const relevantChunks = chunks.filter(
      (chunk) => chunk.distance < 0.5
    );

    const qaPairs = await findRelevantQAPairs();

    if (relevantChunks.length === 0) {
      // Log the question even when no context is found
      prisma.questionLog
        .create({
          data: { question: message, hasContext: false },
        })
        .catch(() => {});

      return NextResponse.json({
        answer: "I don't have enough information to answer that.",
      });
    }

    const context = relevantChunks
      .map((chunk) => chunk.content)
      .join("\n\n");

    const qaContext = qaPairs
      .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
      .join("\n\n");

    const prompt = `
You are a helpful assistant.

Answer ONLY using the provided context.

If the answer cannot be found in the context, say:
"I don't have enough information to answer that."

DOCUMENT CONTEXT:
${context}

Q&A CONTEXT:
${qaContext}

USER QUESTION:
${message}
`;

    const result = await gemini.models.generateContentStream({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result) {
          const text = chunk.text ?? "";
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    // Fire-and-forget: log the question after starting the stream
    prisma.questionLog
      .create({
        data: { question: message, hasContext: chunks.length > 0 },
      })
      .catch(() => {});

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
