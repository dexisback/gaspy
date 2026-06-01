import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEmbedding } from "@/lib/embeddings";
import { createId } from "@paralleldrive/cuid2";
export async function GET() {
  try {
    const qaPairs = await prisma.qAPair.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
    const { question, answer } =
      await request.json();

    if (
      !question?.trim() ||
      !answer?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Question and answer are required",
        },
        { status: 400 }
      );
    }

    const embedding =
      await createEmbedding(question);

    const id = createId();

    await prisma.$executeRaw`
      INSERT INTO "QAPair"
      (
        id,
        question,
        answer,
        "questionEmbedding",
        "createdAt",
        "updatedAt"
      )
      VALUES
      (
        ${id},
        ${question},
        ${answer},
        ${`[${embedding.join(",")}]`}::vector,
        NOW(),
        NOW()
      )
    `;

    const qaPair =
      await prisma.qAPair.findUnique({
        where: { id },
      });

    return NextResponse.json(qaPair);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create Q&A pair" },
      { status: 500 }
    );
  }
}