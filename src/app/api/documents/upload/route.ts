import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { prisma } from "@/lib/prisma";
import { extractText } from "@/lib/parsers";
import { chunkText } from "@/lib/chunker";
import { createEmbedding } from "@/lib/embeddings";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 10MB" },
        { status: 400 }
      );
    }

    const text = await extractText(file);

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Document contains no text" },
        { status: 400 }
      );
    }

    const chunks = chunkText(text);

    const document = await prisma.document.create({
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
      },
    });

    await Promise.all(
      chunks.map(async (chunk) => {
        const embedding = await createEmbedding(chunk);
        await prisma.$executeRaw`
          INSERT INTO "Chunk"
          (id, content, embedding, "documentId", "createdAt")
          VALUES
          (${createId()}, ${chunk}, ${`[${embedding.join(",")}]`}::vector, ${document.id}, NOW())
        `;
      })
    );

    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      documentId: document.id,
      chunks: chunks.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}