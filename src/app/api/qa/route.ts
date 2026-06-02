import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createEmbedding } from "@/lib/embeddings";
import { createId } from "@paralleldrive/cuid2";

const qaSchema = z.object({
  question: z.string().min(1).max(1000),
  answer: z.string().min(1).max(5000),
});

export async function GET() {
  try {
    const qaPairs = await prisma.qAPair.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(qaPairs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch Q&A pairs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = qaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { question, answer } = parsed.data;

    const id = createId();

    // Insert immediately without embedding — return fast
    await prisma.$executeRaw`
      INSERT INTO "QAPair" (id, question, answer, "questionEmbedding", "createdAt", "updatedAt")
      VALUES (${id}, ${question}, ${answer}, NULL, NOW(), NOW())
    `;

    const qaPair = await prisma.qAPair.findUnique({ where: { id } });

    // Fire-and-forget: generate embedding in background
    (async () => {
      try {
        const embedding = await createEmbedding(question);
        await prisma.$executeRaw`
          UPDATE "QAPair"
          SET "questionEmbedding" = ${`[${embedding.join(",")}]`}::vector
          WHERE id = ${id}
        `;
      } catch (err) {
        console.error("Background embedding failed:", err);
      }
    })();

    return NextResponse.json(qaPair);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create Q&A pair" },
      { status: 500 }
    );
  }
}
