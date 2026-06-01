import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
      await prisma.qAPair.update({
        where: {
          id,
        },
        data: {
          question,
          answer,
        },
      });

    return NextResponse.json(qaPair);
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

    await prisma.qAPair.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete Q&A pair" },
      { status: 500 }
    );
  }
}