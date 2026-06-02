import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEmbedding } from "@/lib/embeddings";
import { createId } from "@paralleldrive/cuid2";

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
    const { question, answer } = await request.json();

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

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
