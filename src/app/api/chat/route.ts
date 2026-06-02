import { NextResponse } from "next/server";
import { z } from "zod";
import { gemini } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import {
  createEmbedding,
  findSimilarChunks,
  findSimilarQAPairs,
} from "@/lib/embeddings";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

const GREETING_PATTERNS = [
  /^\s*hi\b/i,
  /^\s*hello\b/i,
  /^\s*hey\b/i,
  /^\s*good morning\b/i,
  /^\s*good afternoon\b/i,
  /^\s*good evening\b/i,
  /^\s*how are you\b/i,
  /^\s*how's it going\b/i,
  /^\s*what's up\b/i,
  /^\s*sup\b/i,
  /^\s*yo\b/i,
  /^\s*greetings\b/i,
];

const GREETING_RESPONSES = [
  "Hey there! I'm Gaspy, your support assistant. I can help with questions about our products, troubleshooting, or general info. What would you like to know?",
  "Hello! Great to have you here. I'm Gaspy — ready to help with product questions, support issues, or anything else you need. What's on your mind?",
  "Hi! I'm Gaspy, and I'm here to make things easier. Whether it's product info, troubleshooting, or general questions, I've got you. What can I help with?",
  "Hey! Welcome. I'm Gaspy, your friendly support assistant. Ask me anything about our products or services — I'm here to help!",
];

function isGreeting(message: string): boolean {
  return GREETING_PATTERNS.some((pattern) => pattern.test(message));
}

function getGreetingResponse(): string {
  const index = Math.floor(Math.random() * GREETING_RESPONSES.length);
  return GREETING_RESPONSES[index];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid message", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { message } = parsed.data;

    await prisma.message.create({
      data: { role: "user", content: message },
    });

    // Fast path: greetings — no embedding, no LLM call
    if (isGreeting(message)) {
      const response = getGreetingResponse();
      await prisma.message.create({
        data: { role: "assistant", content: response },
      });
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(response));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const SIMILARITY_THRESHOLD = parseFloat(
      process.env.SIMILARITY_THRESHOLD || "0.5"
    );

    const embedding = await createEmbedding(message);

    const chunks = await findSimilarChunks(embedding);
    const relevantChunks = chunks.filter(
      (chunk) => chunk.distance < SIMILARITY_THRESHOLD
    );

    const qaPairs = await findSimilarQAPairs(embedding);
    const relevantQAPairs = qaPairs.filter(
      (qa) => qa.distance < SIMILARITY_THRESHOLD
    );

    if (relevantChunks.length === 0) {
      prisma.questionLog
        .create({
          data: { question: message, hasContext: false },
        })
        .catch(() => {});

      const fallback =
        "I'm not sure about that one — I don't have anything in my knowledge base that covers it yet.\n\n" +
        "Here are a few things I can help with:\n" +
        "• Questions about uploaded documents\n" +
        "• How something works based on your docs\n" +
        "• General product or support questions\n\n" +
        "If you need more help, our support team is available at +1-555-0199.";

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(fallback));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const context = relevantChunks.map((chunk) => chunk.content).join("\n\n");
    const qaContext = relevantQAPairs
      .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
      .join("\n\n");

    const prompt = `
You are Gaspy, a friendly and conversational customer support assistant.

Guidelines:
- For greetings, small talk, or casual messages: respond warmly and naturally like a human assistant would. Keep it brief. End with a subtle nudge toward what you can help with.
- For questions covered by the context: answer accurately and conversationally, not like you're reading from a document.
- For questions NOT in the context: don't just say "I don't know." Acknowledge the question, say you don't have specific information on that, and suggest they reach out to the team or check back later.
- Never sound robotic. Never say "Based on the provided context..."
- Keep responses concise. Don't over-explain.
- If someone seems frustrated, be empathetic first before answering.

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
        let fullAnswer = "";
        try {
          for await (const chunk of result) {
            const text = chunk.text ?? "";
            fullAnswer += text;
            controller.enqueue(encoder.encode(text));
          }
          await prisma.message.create({
            data: { role: "assistant", content: fullAnswer },
          });
          controller.close();
        } catch (error) {
          console.error(error);
          controller.error(error);
        }
      },
    });

    prisma.questionLog
      .create({
        data: { question: message, hasContext: chunks.length > 0 },
      })
      .catch(() => {});

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error(error);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("Something went wrong. Please try again."));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      status: 200,
    });
  }
}
