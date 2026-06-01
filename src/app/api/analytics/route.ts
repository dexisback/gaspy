//shows most frequently asked questions
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.questionLog.groupBy({
      by: ["question"],
      _count: {
        question: true,
      },
      orderBy: {
        _count: {
          question: "desc",
        },
      },
      take: 10,
    });

    return NextResponse.json(
      logs.map((log) => ({
        question: log.question,
        count: log._count.question,
      }))
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}