import { NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";
import { prisma } from "@/lib/prisma";
import { extractText } from "@/lib/parsers";
import { chunkText } from "@/lib/chunker";
import { createEmbedding } from "@/lib/embeddings";

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

    for (const chunk of chunks) {
const embedding = await createEmbedding(chunk);
await prisma.$executeRaw`
        INSERT INTO "Chunk"
        (
          id,
          content,
          embedding,
          "documentId",
          "createdAt"
        )
        VALUES
        (
          ${createId()},
          ${chunk},
          ${`[${embedding.join(",")}]`}::vector,
          ${document.id},
          NOW()
        )
      `;
    }

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