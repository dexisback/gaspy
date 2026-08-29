export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  chunks?: number;
}

export interface QAPair {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  usage?: number;
}

export interface AnalyticsItem {
  question: string;
  count: number;
}

export interface TimelinePoint {
  hour: string;
  count: number;
}

export type AnalyticsRange = "12h" | "7d" | "30d";

export interface AnalyticsResponse {
  topQuestions: AnalyticsItem[];
  timeline: TimelinePoint[];
}

export interface ActivityItem {
  kind: "question" | "document" | "qa";
  title: string;
  detail: string;
  at: string;
}

export interface AdminKpis {
  questionsTotal: number;
  questionsToday: number;
  questionsLast7d: number;
  questionsPrev7d: number;
  qaPairs: number;
  documents: number;
  chunks: number;
  docsPending: number;
  topQuestion: AnalyticsItem | null;
}
