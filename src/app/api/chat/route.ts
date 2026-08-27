import { NextResponse } from "next/server";
import { z } from "zod";
import { gemini } from "@/lib/gemini";
import { groqGenerateContentStream, GROQ_MODEL } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limiter";
import {
  createEmbedding,
  findSimilarChunks,
  findSimilarQAPairs,
} from "@/lib/embeddings";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

const GEMINI_MODEL = "gemini-flash-latest";
const GROQ_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 500;
const RELEVANCE_THRESHOLD = 0.6;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function* createAnswerStream(
  prompt: string
): AsyncGenerator<string> {
  try {
    const stream = await gemini.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    for await (const chunk of stream) {
      const text = chunk.text ?? "";
      if (text) yield text;
    }
    return;
  } catch (err) {
    console.log(`Gemini (${GEMINI_MODEL}) failed, falling back to Groq:`, err);
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= GROQ_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
    try {
      for await (const text of groqGenerateContentStream(prompt)) {
        yield text;
      }
      return;
    } catch (err) {
      lastError = err;
      console.log(
        `Groq (${GROQ_MODEL}) attempt ${attempt + 1}/${GROQ_RETRIES + 1} failed:`,
        err
      );
    }
  }

  throw lastError;
}

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
    const limit = checkRateLimit("api-chat");
    if (!limit.allowed) {
      return NextResponse.json(
        { error: limit.reason },
        { status: 429 }
      );
    }

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

    const embedding = await createEmbedding(message);

    const chunks = await findSimilarChunks(embedding);
    const qaPairs = await findSimilarQAPairs(embedding);

    const relevantChunks = chunks.filter(
      (chunk) => chunk.distance < RELEVANCE_THRESHOLD
    );
    const relevantQaPairs = qaPairs.filter(
      (qa) => qa.distance < RELEVANCE_THRESHOLD
    );

    if (relevantChunks.length === 0 && relevantQaPairs.length === 0) {
      prisma.questionLog
        .create({
          data: { question: message, hasContext: false },
        })
        .catch(() => {});

      const fallback =
        "I don't have anything in my knowledge base that covers that one yet.\n\n" +
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
    const qaContext = relevantQaPairs
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

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let fullAnswer = "";
        try {
          for await (const text of createAnswerStream(prompt)) {
            fullAnswer += text;
            controller.enqueue(encoder.encode(text));
          }
          await prisma.message.create({
            data: { role: "assistant", content: fullAnswer },
          });
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          const recovery =
            "I hit a snag while answering that. Please try again in a moment.";
          controller.enqueue(encoder.encode(recovery));
          controller.close();
        }
      },
    });

    prisma.questionLog
      .create({
        data: { question: message, hasContext: relevantChunks.length > 0 },
      })
      .catch(() => {});

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Chat error:", errorMsg);
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
