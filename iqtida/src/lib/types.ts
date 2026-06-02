export interface AnswerResult {
  answerType: string;
  shortAnswer: string;
  detailedAnswer: string | null;
  evidence: string | null;
  source: string | null;
  explanation: string | null;
  practicalApplication: string | null;
  warning: string | null;
  hadithId: string | null;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string | null;
  category: string;
  evidenceStatus: string;
  dayMoment: string | null;
  sourceBook: string | null;
  grade: string | null;
}

export interface DashboardData {
  greeting: string;
  hijriDate: string;
  gregorianDate: string;
  completionPercentage: number;
  todaySunnahs: number;
  completedToday: number;
  streak: number;
  savedCount: number;
  totalApplied: number;
}

export interface TimelineItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  evidenceStatus: string;
  dayMoment: string;
  applied: boolean;
  saved: boolean;
}
