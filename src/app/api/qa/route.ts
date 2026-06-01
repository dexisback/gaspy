import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const qaPair =
      await prisma.qAPair.create({
        data: {
          question,
          answer,
        },
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