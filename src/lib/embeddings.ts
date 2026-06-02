import { gemini } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

type SimilarChunk = {
  id: string;
  content: string;
  documentId: string;
  distance: number
};

type SimilarQAPair = {
  id: string;
  question: string;
  answer: string;
  distance: number;
};

export async function createEmbedding(text: string) {
  const response = await gemini.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  const embedding = response.embeddings?.[0]?.values ?? [];
  return embedding;
}



export async function findSimilarChunks(
  embedding: number[],
  limit = 5
): Promise<SimilarChunk[]> {
  const vector = `[${embedding.join(",")}]`;

  const chunks = await prisma.$queryRaw<SimilarChunk[]>`
    SELECT
      id,
      content,
      "documentId",
      embedding <=> ${vector}::vector as distance
    FROM "Chunk"
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${limit}
  `;

  return chunks;
}

export async function findSimilarQAPairs(
  embedding: number[],
  limit = 3
): Promise<SimilarQAPair[]> {
  const vector =
    `[${embedding.join(",")}]`;

  const qaPairs =
    await prisma.$queryRaw<
      SimilarQAPair[]
    >`
      SELECT
        id,
        question,
        answer,
        "questionEmbedding" <=> ${vector}::vector
        AS distance
      FROM "QAPair"
      ORDER BY
        "questionEmbedding" <=> ${vector}::vector
      LIMIT ${limit}
    `;

  return qaPairs;
}
