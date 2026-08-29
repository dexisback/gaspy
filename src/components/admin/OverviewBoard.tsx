"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  MessageSquare,
  MoreVertical,
  Sparkles,
  Trash2,
  TrendingUp,
} from "lucide-react";
import {
  ActivityItem,
  AdminKpis,
  AnalyticsItem,
  AnalyticsRange,
  Document,
  TimelinePoint,
} from "@/types";
import { PageHeader } from "./PageHeader";
import { PanelSurface as Panel } from "./PanelSurface";
import { AnalyticsChart } from "./AnalyticsChart";
import { timeAgo } from "@/lib/utils";

const RANGES: Array<{ value: AnalyticsRange; label: string }> = [
  { value: "12h", label: "Last 12 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

function RangeSelector({
  range,
  onChange,
}: {
  range: AnalyticsRange;
  onChange: (r: AnalyticsRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-card px-3 text-[12.5px] font-medium text-foreground transition-colors hover:bg-muted/40 cursor-pointer"
        aria-expanded={open}
      >
        {RANGES.find((r) => r.value === range)?.label}
        <ChevronDown
          size={13}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-[calc(100%+4px)] z-50 w-44 overflow-hidden rounded-lg border border-border/60 bg-card shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => {
                onChange(r.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-[12.5px] transition-colors hover:bg-muted/50 cursor-pointer ${
                r.value === range ? "font-semibold text-foreground" : "text-muted-foreground"
              }`}
            >
              {r.label}
              {r.value === range && (
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function KpiCard({
  label,
  icon: Icon,
  value,
  meta,
  status,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: React.ReactNode;
  meta: React.ReactNode;
  status: React.ReactNode;
}) {
  return (
    <div className="group rounded-xl border border-border/60 bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-px hover:border-border hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-[#5d7a02] dark:text-[#C5F80A]">
          <Icon size={14} />
        </span>
      </div>
      <div className="mt-3">{value}</div>
      <p className="mt-1 text-[12px] text-muted-foreground">{meta}</p>
      <div className="mt-2.5 border-t border-border/40 pt-2 text-[11.5px] font-medium">
        {status}
      </div>
    </div>
  );
}

function Kpis({ kpis }: { kpis: AdminKpis }) {
  const { questionsLast7d, questionsPrev7d, documents, chunks, docsPending, qaPairs, topQuestion } =
    kpis;

  const delta =
    questionsPrev7d > 0
      ? Math.round(((questionsLast7d - questionsPrev7d) / questionsPrev7d) * 100)
      : null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Questions"
        icon={MessageSquare}
        value={
          <span className="text-[30px] font-bold leading-none tracking-tight text-foreground font-tabular">
            {questionsLast7d.toLocaleString()}
          </span>
        }
        meta="questions in last 7 days"
        status={
          delta === null ? (
            <span className="text-muted-foreground">No prior 7-day data</span>
          ) : delta > 0 ? (
            <span className="inline-flex items-center gap-1 text-[#7da504] dark:text-[#C5F80A]">
              <TrendingUp size={12} />↑ {delta}% vs previous 7 days
            </span>
          ) : delta < 0 ? (
            <span className="text-muted-foreground">
              ↓ {Math.abs(delta)}% vs previous 7 days
            </span>
          ) : (
            <span className="text-muted-foreground">— flat vs previous 7 days</span>
          )
        }
      />
      <KpiCard
        label="Knowledge Sources"
        icon={FileText}
        value={
          <span className="text-[30px] font-bold leading-none tracking-tight text-foreground font-tabular">
            {documents.toLocaleString()}
          </span>
        }
        meta={
          <>
            <span className="font-tabular font-semibold text-foreground">
              {chunks.toLocaleString()}
            </span>{" "}
            chunks indexed
          </>
        }
        status={
          docsPending === 0 ? (
            <span className="inline-flex items-center gap-1 text-[#7da504] dark:text-[#C5F80A]">
              <CheckCircle2 size={12} />All sources are up to date
            </span>
          ) : (
            <span className="text-muted-foreground">
              {docsPending} {docsPending === 1 ? "source" : "sources"} awaiting
              indexing
            </span>
          )
        }
      />
      <KpiCard
        label="Q&A Pairs"
        icon={Sparkles}
        value={
          <span className="text-[30px] font-bold leading-none tracking-tight text-foreground font-tabular">
            {qaPairs.toLocaleString()}
          </span>
        }
        meta="custom pairs configured"
        status={
          <Link
            href="/admin/qa"
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            Manage answers for bot
            <ArrowRight size={11} />
          </Link>
        }
      />
      <KpiCard
        label="Top Question"
        icon={TrendingUp}
        value={
          topQuestion ? (
            <span
              className="block truncate pt-1 text-[15px] font-semibold leading-snug text-foreground"
              title={topQuestion.question}
            >
              {topQuestion.question}
            </span>
          ) : (
            <span className="text-[15px] font-semibold text-muted-foreground">—</span>
          )
        }
        meta={topQuestion ? `asked ${topQuestion.count} times` : "no questions yet"}
        status={
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <TrendingUp size={12} />
            Most frequent question
          </span>
        }
      />
    </div>
  );
}

function TopQuestions({ items }: { items: AnalyticsItem[] }) {
  return (
    <ol className="divide-y divide-border/40">
      {items.map((item, i) => (
        <li
          key={`${item.question}-${i}`}
          className="group flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-muted/30"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent/15 font-mono text-[10px] font-bold text-[#5d7a02] dark:text-[#C5F80A]">
            {i + 1}
          </span>
          <span
            className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground"
            title={item.question}
          >
            {item.question}
          </span>
          <span className="shrink-0 font-mono text-[11.5px] font-semibold text-muted-foreground font-tabular group-hover:text-foreground">
            {item.count}
          </span>
        </li>
      ))}
    </ol>
  );
}

const ACTIVITY_ICONS = {
  question: MessageSquare,
  document: FileText,
  qa: CheckCircle2,
} as const;

function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="divide-y divide-border/40">
      {items.map((item, i) => {
        const Icon = ACTIVITY_ICONS[item.kind];
        return (
          <li key={i} className="flex items-start gap-3 px-1 py-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/60 text-muted-foreground">
              <Icon size={13} className="opacity-70" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[12.5px] font-semibold text-foreground">
                {item.title}
              </p>
              <p className="truncate text-[12px] text-muted-foreground" title={item.detail}>
                {item.detail}
              </p>
            </div>
            <span className="shrink-0 pt-0.5 font-mono text-[10.5px] text-muted-foreground/80 font-tabular">
              {timeAgo(item.at)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function KnowledgeRow({ doc }: { doc: Document }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const indexed = (doc.chunks ?? 0) > 0;

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/documents/${doc.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-muted/30">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/60 text-muted-foreground">
        <FileText size={14} className="opacity-60" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[12.5px] font-medium text-foreground" title={doc.name}>
          {doc.name}
        </span>
        <span className="font-mono text-[10.5px] text-muted-foreground/80 font-tabular">
          {doc.type === "application/pdf" ? "PDF" : doc.type.toUpperCase()} ·{" "}
          {(doc.size / 1024).toFixed(1)} KB · Uploaded {timeAgo(doc.createdAt)}
        </span>
      </div>
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider ${
          indexed
            ? "border-accent/30 bg-accent/10 text-[#5d7a02] dark:text-[#C5F80A]"
            : "border-border/50 bg-muted/40 text-muted-foreground"
        }`}
      >
        {indexed ? "Indexed ✓" : "Empty"}
      </span>
      <div ref={ref} className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground cursor-pointer"
          aria-label={`Actions for ${doc.name}`}
        >
          <MoreVertical size={14} />
        </button>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+2px)] z-50 w-40 overflow-hidden rounded-lg border border-border/60 bg-card shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex w-full items-center gap-2 px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:bg-muted/50 hover:text-red-500 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={13} />
              {deleting ? "Deleting..." : "Delete document"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function OverviewBoard({
  kpis,
  topQuestions,
  activity,
  documents,
  initialTimeline,
}: {
  kpis: AdminKpis;
  topQuestions: AnalyticsItem[];
  activity: ActivityItem[];
  documents: Document[];
  initialTimeline: TimelinePoint[];
}) {
  const [range, setRange] = useState<AnalyticsRange>("7d");
  const [timeline, setTimeline] = useState<TimelinePoint[]>(initialTimeline);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?range=${range}`);
        const data: { timeline?: TimelinePoint[] } = await res.json();
        if (!cancelled && Array.isArray(data.timeline)) setTimeline(data.timeline);
      } catch {
        // keep previous timeline on failure
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <div className="mx-auto w-full max-w-[1360px] px-4 pb-24 pt-4 md:px-8">
      <PageHeader
        title="Overview"
        description="Your chatbot knowledge base and activity at a glance."
        action={<RangeSelector range={range} onChange={setRange} />}
      />

      <Kpis kpis={kpis} />

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel className="flex flex-col p-5 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[13.5px] font-semibold text-foreground">
              Questions Over Time
            </h3>
            <span className="rounded-md border border-border/50 bg-card px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
              {RANGES.find((r) => r.value === range)?.label}
            </span>
          </div>
          <div
            className={`relative h-[240px] w-full transition-opacity duration-200 ${
              loading ? "opacity-40" : "opacity-100"
            }`}
          >
            <AnalyticsChart initialData={timeline} />
          </div>
        </Panel>

        <Panel className="flex flex-col p-5 lg:col-span-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[13.5px] font-semibold text-foreground">
              Top Questions
            </h3>
            <Link
              href="/admin/analytics"
              className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
            </Link>
          </div>
          {topQuestions.length === 0 ? (
            <p className="py-6 text-center text-[12.5px] text-muted-foreground">
              No questions yet — they will appear as the chatbot is used.
            </p>
          ) : (
            <TopQuestions items={topQuestions.slice(0, 5)} />
          )}
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel className="flex flex-col p-5 lg:col-span-7">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[13.5px] font-semibold text-foreground">
              Recent Activity
            </h3>
            <Link
              href="/admin/analytics"
              className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
            </Link>
          </div>
          {activity.length === 0 ? (
            <p className="py-6 text-center text-[12.5px] text-muted-foreground">
              No activity yet — it will appear as the chatbot is used.
            </p>
          ) : (
            <RecentActivity items={activity} />
          )}
        </Panel>

        <Panel className="flex flex-col p-5 lg:col-span-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[13.5px] font-semibold text-foreground">
              Knowledge Sources
            </h3>
            <Link
              href="/admin/knowledge"
              className="flex h-8 items-center gap-1.5 rounded-lg bg-[#1F2937] px-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#2a3547] cursor-pointer dark:bg-[#C5F80A] dark:text-gray-900 dark:hover:bg-[#d4ff2e]"
            >
              Upload document
            </Link>
          </div>
          {documents.length === 0 ? (
            <p className="py-6 text-center text-[12.5px] text-muted-foreground">
              No knowledge sources yet — upload a document to power the chatbot.
            </p>
          ) : (
            <div className="divide-y divide-border/40">
              {documents.slice(0, 5).map((doc) => (
                <KnowledgeRow key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
