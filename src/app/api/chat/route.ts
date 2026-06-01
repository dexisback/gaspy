import { NextResponse } from "next/server";

import { gemini } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

import {
  createEmbedding,
  findSimilarChunks,
  findRelevantQAPairs,
} from "@/lib/embeddings";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const embedding = await createEmbedding(message);

    const chunks = await findSimilarChunks(
      embedding
    );
    const relevantChunks = chunks.filter(
  (chunk) => chunk.distance < 0.5
);

//debug for noting down the vector differences, tune threshold later⚠️⚠️⚠️
// console.log(
//   relevantChunks.map((c) => ({
//     distance: c.distance,
//     content: c.content.slice(0, 100),
//   }))
// );
console.log(chunks)

    const qaPairs =
      await findRelevantQAPairs();
if (
  relevantChunks.length === 0 
) {
  return NextResponse.json({
    answer:
      "I don't have enough information to answer that.",
  });
}
    const context = relevantChunks
      .map((chunk) => chunk.content)
      .join("\n\n");

    const qaContext = qaPairs
      .map(
        (qa) =>
          `Q: ${qa.question}\nA: ${qa.answer}`
      )
      .join("\n\n");

    const prompt = `
You are a helpful assistant.

Answer ONLY using the provided context.

If the answer cannot be found in the context, say:
"I don't have enough information to answer that."

DOCUMENT CONTEXT:
${context}

Q&A CONTEXT:
${qaContext}

USER QUESTION:
${message}
`;
console.log("Chunks:", chunks.length);
console.log("QA Pairs:", qaPairs.length);
console.log("Prompt Length:", prompt.length);
        const response =
      await gemini.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
      });    
 

    await prisma.questionLog.create({
      data: {
        question: message,
        hasContext: chunks.length > 0,
      },
    });

    return NextResponse.json({
      answer: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}


