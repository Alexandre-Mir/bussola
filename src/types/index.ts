export type ConfidenceLevel = "low" | "medium" | "high";

export interface Question {
  id: string;
  text: string;
  source: string;
  correctAnswer: "C" | "E";
  explanation?: string;
  supportText?: string;
  targetParagraph?: number;
  subjectId: string;
  isq: number; // ISQ: 0.1 (Literal/Fácil) a 1.0 (Complexa/Difícil)
}

export interface QuestionResult {
  questionId: string;
  subjectId: string;
  userAnswer: "C" | "E" | "B";
  confidence: ConfidenceLevel;
  timestamp: number;
  isq: number; // ISQ da questão no momento da resolução
}

export interface SubjectPerformance {
  correct: number;
  wrong: number;
  omitted: number;
  totalTimeSeconds: number;
  averageConfidence: number; // 0 to 1
}

export interface CycleSubject {
  id: string;
  name: string;
  durationMinutes: number;
  color: string;
  elapsedSeconds: number;
  isRunning: boolean;
  weight: number; // PE (Peso do Edital - número de itens)
  examPart: "P1" | "P2";
  performance: SubjectPerformance;
  baseIsq: number; // ISQ médio do tema (0.1 a 1.0)
  lastReview?: number; // Timestamp da última revisão
  nextReview?: number; // Timestamp da próxima revisão agendada
}

export interface StudySession {
  id: string;
  subjectId: string;
  startTime: number;
  endTime: number;
  type: "teoria" | "questoes" | "revisao";
}
