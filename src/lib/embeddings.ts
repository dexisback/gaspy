import { gemini } from "@/lib/gemini";



import { prisma } from "@/lib/prisma";

type SimilarChunk = {
  id: string;
  content: string;
  documentId: string;
  distance: number
};

type RelevantQAPair = {
  id: string;
  question: string;
  answer: string;
};



export async function createEmbedding(text: string) {
  const response = await gemini.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });


//   return response.embeddings?.[0]?.values ?? [], 
const embedding = response.embeddings?.[0]?.values ?? [];
console.log("Embedding length:", embedding.length);
return embedding 
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


export async function findRelevantQAPairs(
//   question: string // for future semantic search
  limit = 5
): Promise<RelevantQAPair[]> {
  const qaPairs = await prisma.qAPair.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return qaPairs;
}

