import { gemini } from "@/lib/gemini";

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