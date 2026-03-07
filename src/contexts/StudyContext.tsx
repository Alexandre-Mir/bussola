"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CycleSubject, QuestionResult, StudySession } from "@/types";

export interface StudyStats {
  totalQuestions: number;
  netScore: number;
  accuracyRate: number;
  calibrationIndex: number;
  falseConvictions: number;
  p1Projection: number;
  p2Projection: number;
  p1LiteralProjection: number; // Projeção baseada apenas em itens de literalidade (ISQ baixo)
  p2LiteralProjection: number; // Projeção baseada apenas em itens de literalidade
  targetScore: number;
  normalizedNetScore: number; // Score ajustado pela severidade (ISQ)
  avgISQ: number; // Média de severidade das questões resolvidas
}

interface StudyContextType {
  subjects: CycleSubject[];
  results: QuestionResult[];
  sessions: StudySession[];
  setSubjects: React.Dispatch<React.SetStateAction<CycleSubject[]>>;
  addResult: (result: QuestionResult) => void;
  updateSubjectTime: (id: string, seconds: number) => void;
  rebalanceCycle: (totalHours: number) => void;
  scheduleReview: (id: string, level: 1 | 2 | 3 | 4) => void;
  getStats: () => StudyStats;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const INITIAL_SUBJECTS: CycleSubject[] = [
  {
    id: "sub-1",
    name: "Português (Gramática)",
    durationMinutes: 90,
    color: "#3b82f6",
    elapsedSeconds: 0,
    isRunning: false,
    weight: 20,
    examPart: "P1",
    baseIsq: 0.35,
    performance: {
      correct: 0,
      wrong: 0,
      omitted: 0,
      totalTimeSeconds: 0,
      averageConfidence: 0,
    },
  },
  {
    id: "sub-2",
    name: "Atos Administrativos",
    durationMinutes: 120,
    color: "#8b5cf6",
    elapsedSeconds: 0,
    isRunning: false,
    weight: 15,
    examPart: "P2",
    baseIsq: 0.75,
    performance: {
      correct: 0,
      wrong: 0,
      omitted: 0,
      totalTimeSeconds: 0,
      averageConfidence: 0,
    },
  },
  {
    id: "sub-3",
    name: "Legislação UnB",
    durationMinutes: 60,
    color: "#10b981",
    elapsedSeconds: 0,
    isRunning: false,
    weight: 10,
    examPart: "P1",
    baseIsq: 0.2,
    performance: {
      correct: 0,
      wrong: 0,
      omitted: 0,
      totalTimeSeconds: 0,
      averageConfidence: 0,
    },
  },
];

export function StudyProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<CycleSubject[]>([]);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    const savedSubjects = localStorage.getItem("bussola_subjects");
    const savedResults = localStorage.getItem("bussola_results");

    if (savedSubjects && JSON.parse(savedSubjects).length > 0) {
      setSubjects(JSON.parse(savedSubjects));
    } else {
      setSubjects(INITIAL_SUBJECTS);
    }

    if (savedResults) setResults(JSON.parse(savedResults));
  }, []);

  // Persistência
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem("bussola_subjects", JSON.stringify(subjects));
    }
    localStorage.setItem("bussola_results", JSON.stringify(results));
  }, [subjects, results]);

  const addResult = (result: QuestionResult) => {
    setResults((prev) => [...prev, result]);

    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === result.subjectId) {
          const isCorrect = result.userAnswer === "C";
          const isWrong = result.userAnswer === "E";
          const isOmitted = result.userAnswer === "B";

          return {
            ...s,
            performance: {
              ...s.performance,
              correct: s.performance.correct + (isCorrect ? 1 : 0),
              wrong: s.performance.wrong + (isWrong ? 1 : 0),
              omitted: s.performance.omitted + (isOmitted ? 1 : 0),
            },
          };
        }
        return s;
      }),
    );
  };

  const updateSubjectTime = (id: string, seconds: number) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, elapsedSeconds: s.elapsedSeconds + seconds } : s,
      ),
    );
  };

  /**
   * REBALANCEAMENTO ESTRATÉGICO (Solução do Paradoxo da Sobrevivência)
   * Implementa o Lock de Manutenção e a Alocação Transbordante (Alpha)
   */
  const rebalanceCycle = (totalHours: number) => {
    setSubjects((prev) => {
      // 1. Métricas de Base (Literalidade vs Total)
      const subjectsWithMetrics = prev.map((s) => {
        const total = s.performance.correct + s.performance.wrong;
        const dl =
          total > 0
            ? (s.performance.correct - s.performance.wrong) / total
            : 0.5;
        // Projeção teórica do que esse sujeito contribui para o score literal
        const literalWeight = s.baseIsq < 0.4 ? 1.0 : 0.3;
        const literalContribution = s.weight * dl * literalWeight;

        return { ...s, dl, literalContribution };
      });

      const p1LiteralScore = subjectsWithMetrics
        .filter((s) => s.examPart === "P1")
        .reduce((acc, s) => acc + s.literalContribution, 0);

      const p2LiteralScore = subjectsWithMetrics
        .filter((s) => s.examPart === "P2")
        .reduce((acc, s) => acc + s.literalContribution, 0);

      const p1InSurvival = p1LiteralScore < 12;
      const p2InSurvival = p2LiteralScore < 25;

      const p1InLock = p1LiteralScore > 15;
      const p2InLock = p2LiteralScore > 32;

      // 2. Cálculo dos Novos Pesos Estratégicos
      const totalStrategicWeight = subjectsWithMetrics.reduce((acc, s) => {
        let baseWeight = s.weight * (1.1 - s.dl); // ROI invertido (quanto pior, mais precisa de tempo)

        // Lógica de Sobrevivência (Boost em temas fáceis se os mínimos estão em risco)
        if (s.examPart === "P1" && p1InSurvival && s.baseIsq < 0.4)
          baseWeight *= 3;
        if (s.examPart === "P2" && p2InSurvival && s.baseIsq < 0.4)
          baseWeight *= 3;

        // Lógica de Lock de Manutenção (Achatamento de temas fáceis se a base está segura)
        if (s.examPart === "P1" && p1InLock && s.baseIsq < 0.4)
          baseWeight *= 0.4;
        if (s.examPart === "P2" && p2InLock && s.baseIsq < 0.4)
          baseWeight *= 0.4;

        // Alocação Alpha (Aumento de ROI para temas complexos se a base está segura)
        const isAlphaTopic = s.baseIsq > 0.6;
        if (isAlphaTopic && !p1InSurvival && !p2InSurvival) {
          baseWeight *= 1 + s.baseIsq; // Prioriza temas difíceis para subir a Nota Normalizada
        }

        return acc + baseWeight;
      }, 0);

      // 3. Distribuição dos Minutos
      return subjectsWithMetrics.map((s) => {
        let baseWeight = s.weight * (1.1 - s.dl);
        if (s.examPart === "P1" && p1InSurvival && s.baseIsq < 0.4)
          baseWeight *= 3;
        if (s.examPart === "P2" && p2InSurvival && s.baseIsq < 0.4)
          baseWeight *= 3;
        if (s.examPart === "P1" && p1InLock && s.baseIsq < 0.4)
          baseWeight *= 0.4;
        if (s.examPart === "P2" && p2InLock && s.baseIsq < 0.4)
          baseWeight *= 0.4;

        if (s.baseIsq > 0.6 && !p1InSurvival && !p2InSurvival) {
          baseWeight *= 1 + s.baseIsq;
        }

        const share = baseWeight / totalStrategicWeight;
        const newMinutes = Math.round(share * totalHours * 60);

        return {
          ...s,
          durationMinutes: newMinutes,
          elapsedSeconds: 0,
        };
      });
    });
  };

  const scheduleReview = (id: string, level: 1 | 2 | 3 | 4) => {
    const intervals = {
      1: 1 * 24 * 60 * 60 * 1000,
      2: 7 * 24 * 60 * 60 * 1000,
      3: 15 * 24 * 60 * 60 * 1000,
      4: 30 * 24 * 60 * 60 * 1000,
    };

    setSubjects((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              lastReview: Date.now(),
              nextReview: Date.now() + intervals[level],
            }
          : s,
      ),
    );
  };

  const ISQ_BENCHMARK = 0.65;

  const getStats = (): StudyStats => {
    let correct = 0;
    let wrong = 0;
    let totalConfidence = 0;
    let falseConvictions = 0;
    let totalISQ = 0;

    results.forEach((res) => {
      const isCorrect = res.userAnswer === "C";
      if (isCorrect) correct++;
      else if (res.userAnswer === "E") wrong++;

      const confValue =
        res.confidence === "high" ? 1 : res.confidence === "medium" ? 0.5 : 0.2;
      totalConfidence += confValue;

      if (res.confidence === "high" && !isCorrect) falseConvictions++;
      totalISQ += res.isq || 0.5;
    });

    const netScore = correct - wrong;
    const total = results.length;
    const accuracyRate = total > 0 ? correct / total : 0;
    const avgConfidence = total > 0 ? totalConfidence / total : 0;
    const calibrationIndex = 1 - Math.abs(avgConfidence - accuracyRate);
    const avgISQ = total > 0 ? totalISQ / total : 0;
    const normalizedNetScore =
      total > 0 ? netScore * (avgISQ / ISQ_BENCHMARK) : 0;

    const p1Projection = subjects
      .filter((s) => s.examPart === "P1")
      .reduce((acc, s) => {
        const t = s.performance.correct + s.performance.wrong;
        const dl =
          t > 0 ? (s.performance.correct - s.performance.wrong) / t : 0;
        return acc + s.weight * dl;
      }, 0);

    const p2Projection = subjects
      .filter((s) => s.examPart === "P2")
      .reduce((acc, s) => {
        const t = s.performance.correct + s.performance.wrong;
        const dl =
          t > 0 ? (s.performance.correct - s.performance.wrong) / t : 0;
        return acc + s.weight * dl;
      }, 0);

    const p1LiteralProjection = subjects
      .filter((s) => s.examPart === "P1")
      .reduce((acc, s) => {
        const t = s.performance.correct + s.performance.wrong;
        const dl =
          t > 0 ? (s.performance.correct - s.performance.wrong) / t : 0;
        return acc + s.weight * 0.6 * dl;
      }, 0);

    const p2LiteralProjection = subjects
      .filter((s) => s.examPart === "P2")
      .reduce((acc, s) => {
        const t = s.performance.correct + s.performance.wrong;
        const dl =
          t > 0 ? (s.performance.correct - s.performance.wrong) / t : 0;
        return acc + s.weight * 0.6 * dl;
      }, 0);

    return {
      totalQuestions: total,
      netScore,
      accuracyRate,
      calibrationIndex,
      falseConvictions,
      p1Projection,
      p2Projection,
      p1LiteralProjection,
      p2LiteralProjection,
      targetScore: 85,
      normalizedNetScore,
      avgISQ,
    };
  };

  return (
    <StudyContext.Provider
      value={{
        subjects,
        results,
        sessions,
        setSubjects,
        addResult,
        updateSubjectTime,
        rebalanceCycle,
        scheduleReview,
        getStats,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error("useStudy must be used within StudyProvider");
  return context;
};
