import { openai } from "@/lib/openai";

export async function createEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

    return response.data[0].embedding;

    

}
