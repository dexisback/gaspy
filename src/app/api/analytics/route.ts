import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatHourLabel } from "@/lib/utils";

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

    const topQuestions = logs.map((log) => ({
      question: log.question,
      count: log._count.question,
    }));

    // Hourly counts for last 12 hours
    const now = new Date();
    const start = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    const rawTimeline = await prisma.$queryRaw<
      { hour: Date; count: bigint }[]
    >`
      SELECT DATE_TRUNC('hour', "createdAt") as hour, COUNT(*) as count
      FROM "QuestionLog"
      WHERE "createdAt" >= ${start}
      GROUP BY hour
      ORDER BY hour ASC
    `;

    // Build a map of hour -> count
    const countMap = new Map<string, number>();
    for (const row of rawTimeline) {
      const key = row.hour.toISOString();
      countMap.set(key, Number(row.count));
    }

    // Fill all 12 hours (including zeros)
    const timeline = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(start.getTime() + i * 60 * 60 * 1000);
      const key = new Date(
        Date.UTC(
          d.getUTCFullYear(),
          d.getUTCMonth(),
          d.getUTCDate(),
          d.getUTCHours()
        )
      ).toISOString();
      const hourLabel = formatHourLabel(d);
      timeline.push({
        hour: hourLabel,
        count: countMap.get(key) || 0,
      });
    }

    return NextResponse.json({ topQuestions, timeline });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
