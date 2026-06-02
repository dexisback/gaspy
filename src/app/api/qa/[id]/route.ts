import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEmbedding } from "@/lib/embeddings";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { question, answer } = await request.json();

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.qAPair.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Q&A pair not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.qAPair.update({
      where: { id },
      data: { question, answer },
    });

    // Fire-and-forget: regenerate embedding if question changed
    if (existing.question !== question) {
      (async () => {
        try {
          const embedding = await createEmbedding(question);
          await prisma.$executeRaw`
            UPDATE "QAPair"
            SET "questionEmbedding" = ${`[${embedding.join(",")}]`}::vector
            WHERE id = ${id}
          `;
        } catch (err) {
          console.error("Background embedding update failed:", err);
        }
      })();
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update Q&A pair" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.qAPair.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete Q&A pair" },
      { status: 500 }
    );
  }
}
