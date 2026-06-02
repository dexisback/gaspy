import { prisma } from "@/lib/prisma";
import { formatHourLabel } from "@/lib/utils";
import { Document, QAPair, AnalyticsResponse } from "@/types";

export async function getAnalytics(): Promise<AnalyticsResponse> {
  const logs = await prisma.questionLog.groupBy({
    by: ["question"],
    _count: { question: true },
    orderBy: { _count: { question: "desc" } },
    take: 10,
  });

  const topQuestions = logs.map((log) => ({
    question: log.question,
    count: log._count.question,
  }));

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

  const countMap = new Map<string, number>();
  for (const row of rawTimeline) {
    const key = row.hour.toISOString();
    countMap.set(key, Number(row.count));
  }

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
    timeline.push({
      hour: formatHourLabel(d),
      count: countMap.get(key) || 0,
    });
  }

  return { topQuestions, timeline };
}

export async function getQAPairs(): Promise<QAPair[]> {
  const pairs = await prisma.qAPair.findMany({
    orderBy: { createdAt: "desc" },
  });
  return pairs.map((p) => ({
    id: p.id,
    question: p.question,
    answer: p.answer,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getDocuments(): Promise<Document[]> {
  const docs = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
  });
  return docs.map((d) => ({
    id: d.id,
    name: d.name,
    type: d.type,
    size: d.size,
    createdAt: d.createdAt.toISOString(),
  }));
}
