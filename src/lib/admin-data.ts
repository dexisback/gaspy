import { prisma } from "@/lib/prisma";
import { formatHourLabel } from "@/lib/utils";
import {
  ActivityItem,
  AdminKpis,
  AnalyticsRange,
  Document,
  QAPair,
  AnalyticsResponse,
} from "@/types";
import { withDbRetry } from "@/lib/db-retry";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * All KPI values are derived from real database records — nothing hardcoded.
 */
export async function getKpis(): Promise<AdminKpis> {
  return withDbRetry(async () => {
    const now = new Date();
    const last7 = new Date(now.getTime() - 7 * 86400000);
    const prev7 = new Date(now.getTime() - 14 * 86400000);

    const [questionsTotal, questionsToday, questionsLast7d, questionsPrev7d, qaPairs, documents, chunks, docsPending, top] =
      await Promise.all([
        prisma.questionLog.count(),
        prisma.questionLog.count({ where: { createdAt: { gte: startOfToday() } } }),
        prisma.questionLog.count({ where: { createdAt: { gte: last7 } } }),
        prisma.questionLog.count({
          where: { createdAt: { gte: prev7, lt: last7 } },
        }),
        prisma.qAPair.count(),
        prisma.document.count(),
        prisma.chunk.count(),
        prisma.document.count({ where: { chunks: { none: {} } } }),
        prisma.questionLog.groupBy({
          by: ["question"],
          _count: { question: true },
          orderBy: { _count: { question: "desc" } },
          take: 1,
        }),
      ]);

    return {
      questionsTotal,
      questionsToday,
      questionsLast7d,
      questionsPrev7d,
      qaPairs,
      documents,
      chunks,
      docsPending,
      topQuestion: top[0]
        ? { question: top[0].question, count: top[0]._count.question }
        : null,
    };
  });
}

export async function getAnalytics(
  range: AnalyticsRange = "12h"
): Promise<AnalyticsResponse> {
  return withDbRetry(async () => {
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
    const hourly = range === "12h";
    const spanHours = hourly ? 12 : range === "7d" ? 24 * 7 : 24 * 30;
    const bucketMs = hourly ? 3600000 : 86400000;
    const buckets = hourly ? 12 : range === "7d" ? 7 : 30;
    const start = new Date(
      Math.floor((now.getTime() - spanHours * 3600000) / bucketMs) * bucketMs
    );

    const rawTimeline = hourly
      ? await prisma.$queryRaw<{ hour: Date; count: bigint }[]>`
          SELECT DATE_TRUNC('hour', "createdAt") as hour, COUNT(*) as count
          FROM "QuestionLog"
          WHERE "createdAt" >= ${start}
          GROUP BY hour
          ORDER BY hour ASC
        `
      : await prisma.$queryRaw<{ hour: Date; count: bigint }[]>`
          SELECT DATE_TRUNC('day', "createdAt" AT TIME ZONE 'UTC') as hour, COUNT(*) as count
          FROM "QuestionLog"
          WHERE "createdAt" >= ${start}
          GROUP BY hour
          ORDER BY hour ASC
        `;

    const countMap = new Map<string, number>();
    for (const row of rawTimeline) {
      countMap.set(new Date(row.hour).toISOString(), Number(row.count));
    }

    const timeline = [];
    for (let i = 0; i < buckets; i++) {
      const d = new Date(start.getTime() + i * bucketMs);
      const key = new Date(
        Date.UTC(
          d.getUTCFullYear(),
          d.getUTCMonth(),
          d.getUTCDate(),
          hourly ? d.getUTCHours() : 0
        )
      ).toISOString();
      timeline.push({
        hour: hourly ? formatHourLabel(d) : dayLabel(d),
        count: countMap.get(key) || 0,
      });
    }

    return { topQuestions, timeline };
  });
}

/**
 * Recent operational activity, derived strictly from real records:
 * latest questions, indexed documents, and Q&A changes.
 */
export async function getRecentActivity(): Promise<ActivityItem[]> {
  return withDbRetry(async () => {
    const [questions, docs, pairs] = await Promise.all([
      prisma.questionLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: { question: true, createdAt: true },
      }),
      prisma.document.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { name: true, createdAt: true, _count: { select: { chunks: true } } },
      }),
      prisma.qAPair.findMany({
        orderBy: { updatedAt: "desc" },
        take: 3,
        select: { question: true, updatedAt: true },
      }),
    ]);

    const items: Array<Omit<ActivityItem, "at"> & { at: Date }> = [
      ...questions.map((q) => ({
        kind: "question" as const,
        title: "New question received",
        detail: `“${q.question}”`,
        at: q.createdAt,
      })),
      ...docs.map((d) => ({
        kind: "document" as const,
        title: d._count.chunks > 0 ? "Document indexed" : "Document uploaded",
        detail: d.name,
        at: d.createdAt,
      })),
      ...pairs.map((p) => ({
        kind: "qa" as const,
        title: "Q&A pair updated",
        detail: `“${p.question}”`,
        at: p.updatedAt,
      })),
    ];

    items.sort((a, b) => b.at.getTime() - a.at.getTime());

    return items.slice(0, 6).map((item) => ({
      kind: item.kind,
      title: item.title,
      detail: item.detail,
      at: item.at.toISOString(),
    }));
  });
}

export async function getQAPairs(): Promise<QAPair[]> {
  return withDbRetry(async () => {
    const [pairs, logs] = await Promise.all([
      prisma.qAPair.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.questionLog.groupBy({
        by: ["question"],
        _count: { question: true },
      }),
    ]);

    // Real usage: how many times each configured question was actually asked.
    const usageMap = new Map(
      logs.map((l) => [l.question.toLowerCase(), Number(l._count.question)])
    );

    return pairs.map((p) => ({
      id: p.id,
      question: p.question,
      answer: p.answer,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      usage: usageMap.get(p.question.toLowerCase()) ?? 0,
    }));
  });
}

export async function getDocuments(): Promise<Document[]> {
  return withDbRetry(async () => {
    const docs = await prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { chunks: true } } },
    });
    return docs.map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      size: d.size,
      createdAt: d.createdAt.toISOString(),
      chunks: d._count.chunks,
    }));
  });
}
