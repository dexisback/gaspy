import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createEmbedding } from "@/lib/embeddings";

const qaUpdateSchema = z.object({
  question: z.string().min(1).max(1000),
  answer: z.string().min(1).max(5000),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = qaUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { question, answer } = parsed.data;

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

    revalidatePath("/admin");

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
    revalidatePath("/admin");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete Q&A pair" },
      { status: 500 }
    );
  }
}
