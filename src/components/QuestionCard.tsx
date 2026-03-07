"use client";

import { useState } from "react";
import { ConfidenceLevel, Question, QuestionResult } from "@/types";

interface QuestionCardProps {
  question: Question;
  onAnswer: (result: QuestionResult) => void;
}

export default function QuestionCard({
  question,
  onAnswer,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<"C" | "E" | "B" | null>(
    null,
  );
  const [confidence, setConfidence] = useState<ConfidenceLevel>("high");
  const [showResult, setShowResult] = useState(false);
  const [showSupportText, setShowSupportText] = useState(
    !!question.supportText,
  );

  const handleConfirm = () => {
    if (!selectedAnswer) return;

    const result: QuestionResult = {
      questionId: question.id,
      subjectId: question.subjectId,
      userAnswer: selectedAnswer,
      confidence,
      timestamp: Date.now(),
      isq: question.isq,
    };

    onAnswer(result);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  const paragraphs = question.supportText
    ? question.supportText.split("\n\n")
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Texto de Apoio */}
      {question.supportText && showSupportText && (
        <div className="lg:w-1/2 w-full bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden flex flex-col max-h-[70vh] lg:max-h-[85vh] animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="bg-base-200 p-3 border-b border-base-300 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
              <span className="text-primary text-lg">📄</span> Texto de
              Referência
            </h3>
            <button
              onClick={() => setShowSupportText(false)}
              className="btn btn-ghost btn-xs"
            >
              Recolher
            </button>
          </div>
          <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`p-3 rounded-lg transition-all duration-500 ${question.targetParagraph === i + 1 ? "bg-primary/10 border-l-4 border-primary font-medium text-base-content translate-x-1 shadow-sm" : "opacity-80"}`}
              >
                <span className="text-[10px] font-mono mr-2 opacity-30">
                  [{i + 1}]
                </span>
                {p}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Questão */}
      <div
        className={`flex-1 w-full space-y-4 ${!showSupportText && question.supportText ? "animate-in fade-in duration-300" : ""}`}
      >
        {!showSupportText && question.supportText && (
          <button
            onClick={() => setShowSupportText(true)}
            className="btn btn-outline btn-sm gap-2 mb-2"
          >
            <span>📖</span> Ver Texto de Apoio
          </button>
        )}

        <div className="card bg-base-200 shadow-xl border border-base-300 overflow-hidden transition-all duration-300 w-full">
          <div className="bg-primary text-primary-content p-3 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider">
              {question.source}
            </span>
            <div className="flex gap-2">
              <span className="badge badge-secondary badge-outline text-xs">
                Questão C/E
              </span>
              {question.targetParagraph && (
                <span className="badge badge-accent text-[10px] font-bold uppercase">
                  Foco: §{question.targetParagraph}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-lg leading-relaxed font-medium">
              {question.text}
            </p>

            {!showResult ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                {/* Opções de Resposta */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedAnswer("C")}
                    className={`btn flex-1 h-16 text-xl transition-all ${selectedAnswer === "C" ? "btn-success scale-105 shadow-lg" : "btn-outline"}`}
                  >
                    Certo
                  </button>
                  <button
                    onClick={() => setSelectedAnswer("E")}
                    className={`btn flex-1 h-16 text-xl transition-all ${selectedAnswer === "E" ? "btn-error scale-105 shadow-lg" : "btn-outline"}`}
                  >
                    Errado
                  </button>
                </div>

                {/* Metacognição - Botão da Certeza */}
                <div className="bg-base-300 p-4 rounded-xl space-y-3">
                  <label className="text-xs font-bold uppercase text-base-content/60 px-1">
                    Grau de Convicção (Estratégia Cebraspe)
                  </label>
                  <div className="flex bg-base-100 p-1 rounded-lg gap-1">
                    {(["low", "medium", "high"] as ConfidenceLevel[]).map(
                      (level) => (
                        <button
                          key={level}
                          onClick={() => setConfidence(level)}
                          className={`flex-1 py-2 text-xs font-bold rounded-md transition-all uppercase
                          ${
                            confidence === level
                              ? level === "high"
                                ? "bg-primary text-primary-content shadow"
                                : level === "medium"
                                  ? "bg-accent text-accent-content"
                                  : "bg-secondary text-secondary-content"
                              : "hover:bg-base-200 opacity-50"
                          }`}
                        >
                          {level === "low"
                            ? "Chute"
                            : level === "medium"
                              ? "Dúvida"
                              : "Total"}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedAnswer}
                  className="btn btn-primary btn-block h-12 text-lg font-bold"
                >
                  Confirmar Resposta
                </button>

                <button
                  onClick={() => {
                    setSelectedAnswer("B");
                    handleConfirm();
                  }}
                  className="btn btn-ghost btn-block btn-sm opacity-50 hover:opacity-100"
                >
                  Deixar em Branco (Estratégia de Omissão)
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in zoom-in-95 duration-300">
                <div
                  className={`alert ${selectedAnswer === "B" ? "alert-info" : isCorrect ? "alert-success" : "alert-error"} shadow-lg`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xl font-black uppercase">
                      {selectedAnswer === "B"
                        ? "Omitida"
                        : isCorrect
                          ? "Correta!"
                          : "Incorreta!"}
                    </span>
                    <span className="text-sm opacity-80">
                      {selectedAnswer === "B"
                        ? "Opção estratégica aplicada."
                        : isCorrect
                          ? "Ótimo trabalho."
                          : "Analise o ponto cego."}
                    </span>
                  </div>
                </div>

                {/* Diagnóstico Meta-Estatístico */}
                {!isCorrect &&
                  confidence === "high" &&
                  selectedAnswer !== "B" && (
                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                      <div className="bg-error text-error-content p-4 rounded-xl border-l-8 border-white flex items-center gap-4 shadow-lg">
                        <div className="text-3xl animate-bounce">⚠️</div>
                        <div>
                          <h4 className="font-bold uppercase tracking-tighter">
                            Bloqueio: Falsa Convicção
                          </h4>
                          <p className="text-xs opacity-90">
                            Este erro anula seus pontos. Você precisa justificar
                            a lógica para avançar.
                          </p>
                        </div>
                      </div>

                      <div className="form-control bg-base-300 p-4 rounded-2xl border border-base-100">
                        <label className="label py-0 mb-2">
                          <span className="label-text-alt font-black uppercase tracking-widest opacity-40">
                            Justificativa da Banca (Sua Versão)
                          </span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered h-24 bg-base-100 font-medium text-sm focus:border-primary transition-all"
                          placeholder="Por que você errou? Qual a pegadinha? (Ex: #Literalidade #Art37)"
                        ></textarea>
                        <div className="flex justify-between mt-2">
                          <span className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">
                            Bootstrapping de DNA do Banco
                          </span>
                          <span className="badge badge-error badge-xs font-black uppercase">
                            Mandatório
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                <button
                  onClick={() => {
                    setShowResult(false);
                    setSelectedAnswer(null);
                  }}
                  className="btn btn-outline btn-block"
                >
                  Próxima Questão
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
