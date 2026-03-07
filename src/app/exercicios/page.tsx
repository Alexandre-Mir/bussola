"use client";

import QuestionCard from "@/components/QuestionCard";
import StudyTimer from "@/components/StudyTimer";
import { FUB_QUESTIONS } from "@/data/questions";
import { QuestionResult } from "@/types";
import { useState, useEffect } from "react";
import { useStudy } from "@/contexts/StudyContext";

export default function Exercicios() {
  const { results, addResult, updateSubjectTime } = useStudy();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [lastAnswerTime, setLastAnswerTime] = useState(0);
  const [showDSTWarning, setShowDSTWarning] = useState(false);

  const currentQuestion = FUB_QUESTIONS[currentIdx];

  const handleAnswer = (result: QuestionResult) => {
    const timeTaken = sessionTime - lastAnswerTime;

    // DST (Decision Speed Threshold): Se responder em < 3s, alerta de vício
    if (timeTaken < 3 && result.userAnswer !== "B") {
      setShowDSTWarning(true);
      setTimeout(() => setShowDSTWarning(false), 3000);
    }

    addResult({
      ...result,
      // No mundo real, aqui salvaríamos o tempo específico da questão
    });

    setLastAnswerTime(sessionTime);
  };

  const handleTick = (s: number) => {
    setSessionTime((prev) => prev + s);
    // Se houver uma matéria ativa, poderíamos atualizar o tempo dela aqui
    // updateSubjectTime(currentQuestion.subjectId, s);
  };

  const totalLiquido = results.reduce((acc, res) => {
    const q = FUB_QUESTIONS.find((fq) => fq.id === res.questionId);
    if (!q) return acc;
    if (res.userAnswer === "B") return acc;
    if (res.userAnswer === q.correctAnswer) return acc + 1;
    return acc - 1;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-base-300 pb-6 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              Laboratório de Itens
            </h1>
            {isSessionActive && (
              <span className="badge badge-success badge-sm animate-pulse font-black uppercase text-[10px]">
                Live
              </span>
            )}
          </div>
          <p className="text-base-content/60 font-medium">
            Motor de Calibração Cebraspe • Cargo 15
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <StudyTimer isRunning={isSessionActive} onTick={handleTick} />
          <button
            onClick={() => setIsSessionActive(!isSessionActive)}
            className={`btn ${isSessionActive ? "btn-error" : "btn-success"} btn-md gap-2 font-black uppercase text-xs tracking-widest`}
          >
            {isSessionActive ? (
              <>
                <span className="text-lg">⏹</span> Pausar Sessão
              </>
            ) : (
              <>
                <span className="text-lg">▶</span> Iniciar Sessão
              </>
            )}
          </button>
        </div>
      </header>

      {showDSTWarning && (
        <div className="alert alert-warning shadow-lg animate-in slide-in-from-top-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-tight">
            ALERTA DST: Resposta excessivamente rápida. Risco de memorização
            (vício de item) detectado.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Lado Esquerdo: Questão */}
        <div className="xl:col-span-3 space-y-6">
          {!isSessionActive && results.length === 0 ? (
            <div className="card bg-base-100 border-2 border-dashed border-base-300 p-20 text-center space-y-6">
              <div className="text-6xl">🔭</div>
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-black tracking-tight">
                  Prepare-se para calibrar
                </h3>
                <p className="text-base-content/60 mt-2">
                  Inicie a sessão para carregar o banco de dados e começar o
                  monitoramento de performance em tempo real.
                </p>
              </div>
              <button
                onClick={() => setIsSessionActive(true)}
                className="btn btn-primary btn-wide font-black uppercase tracking-widest"
              >
                Ativar Motor de Busca
              </button>
            </div>
          ) : (
            <>
              {currentQuestion ? (
                <div className="relative group">
                  <div className="absolute -top-3 left-6 z-10">
                    <span className="badge badge-primary font-black uppercase text-[9px] tracking-widest py-3 px-4 shadow-lg border-2 border-white">
                      ISQ: {currentQuestion.isq.toFixed(2)} —{" "}
                      {currentQuestion.isq > 0.6
                        ? "Alta Complexidade"
                        : "Literalidade"}
                    </span>
                  </div>
                  <QuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                  />
                </div>
              ) : (
                <div className="card bg-info text-info-content p-8 text-center shadow-xl">
                  <h3 className="text-2xl font-bold mb-2">
                    Fim do Banco de Dados!
                  </h3>
                  <p>
                    Você concluiu todas as questões disponíveis para este
                    módulo.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
                <button
                  className="btn btn-outline btn-sm gap-2"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                >
                  <span>←</span> Anterior
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase font-bold opacity-40 mb-1">
                    Progresso no Banco
                  </span>
                  <span className="text-lg font-mono font-black tracking-widest">
                    {currentIdx + 1}{" "}
                    <span className="opacity-20 text-sm">/</span>{" "}
                    {FUB_QUESTIONS.length}
                  </span>
                </div>
                <button
                  className="btn btn-outline btn-sm gap-2"
                  disabled={currentIdx === FUB_QUESTIONS.length - 1}
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                >
                  Próxima <span>→</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Lado Direito: Histórico e Insights */}
        <div className="space-y-6">
          <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
            <div className="bg-base-200 px-5 py-3 border-b border-base-300 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-60">
                Live Feed
              </h3>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-success opacity-40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-success opacity-10"></div>
              </div>
            </div>
            <div className="card-body p-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {[...results]
                  .reverse()
                  .slice(0, 10)
                  .map((res, i) => {
                    const q = FUB_QUESTIONS.find(
                      (fq) => fq.id === res.questionId,
                    );
                    const isCorrect = res.userAnswer === q?.correctAnswer;
                    const isOmitted = res.userAnswer === "B";

                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-base-200 rounded-xl border border-base-300/50 hover:border-primary/30 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isOmitted ? "bg-info/20 text-info" : isCorrect ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}
                        >
                          {isOmitted ? "?" : res.userAnswer}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase opacity-40 truncate">
                              {q?.id}
                            </span>
                            <span
                              className={`text-[8px] font-black uppercase p-1 rounded ${res.confidence === "high" ? "bg-primary/20 text-primary" : "bg-base-300 text-base-content/40"}`}
                            >
                              {res.confidence}
                            </span>
                          </div>
                          <p className="text-[10px] font-medium truncate opacity-80 mt-1">
                            {q?.subjectId} • ISQ {res.isq?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {results.length === 0 && (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-2 opacity-20">📊</div>
                    <p className="text-xs opacity-40 italic">
                      Inicie a resolução para ver o histórico aqui.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {results.length > 0 && (
              <div className="p-3 bg-base-200 text-center border-t border-base-300">
                <button className="text-[10px] font-black uppercase link link-hover opacity-50">
                  Ver Auditoria Completa
                </button>
              </div>
            )}
          </div>

          <div className="alert bg-warning/10 text-warning-content border-warning/20 flex flex-col items-start gap-1 p-4 rounded-2xl">
            <div className="flex items-center gap-2 font-bold text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              Calibrador Híbrido
            </div>
            <span className="text-[10px] opacity-80 leading-relaxed font-medium">
              O sistema detectou que você está resolvendo itens abaixo do
              benchmark (0.65).
              <br />
              <br />
              <span className="text-primary font-black uppercase">
                Ordem:
              </span>{" "}
              Resolva 5 itens de **Alta Complexidade** para validar sua nota
              líquida.
            </span>
          </div>

          <div className="card bg-primary text-primary-content shadow-lg shadow-primary/20 rounded-2xl overflow-hidden">
            <div className="card-body p-5">
              <div className="flex justify-between items-start">
                <h3 className="font-black text-xs uppercase tracking-widest opacity-70">
                  Sessão de Picos
                </h3>
                <span className="badge badge-white badge-xs font-black">
                  ROI+
                </span>
              </div>
              <p className="text-[11px] font-medium mt-2 leading-snug">
                Você está a **2.3 pontos** da Barbara Rotta (Benchmark). Acerte
                os próximos 5 itens para subir no ranking.
              </p>
              <div className="mt-4 bg-primary-focus/50 h-2 w-full rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{ width: "88%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
