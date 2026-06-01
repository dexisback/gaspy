export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface QAPair {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsItem {
  question: string;
  count: number;
}
