"use client";

import { useStudy } from "@/contexts/StudyContext";
import Link from "next/link";

export default function Home() {
  const { subjects, results, getStats } = useStudy();
  const stats = getStats();

  const activeSubjects = subjects.filter((s) => s.durationMinutes > 0);
  const currentSubject = subjects.find((s) => s.isRunning) || subjects[0];

  const p1Min = 10;
  const p2Min = 21;
  const p1Danger = stats.p1Projection < 12;
  const p2Danger = stats.p2Projection < 25;

  const dueSubjects = subjects.filter(
    (s) => s.nextReview && s.nextReview <= Date.now(),
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-base-300 pb-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            BÚSSOLA
          </h1>
          <p className="text-base-content/60 font-medium text-lg italic tracking-wide">
            "A direção é mais importante que a velocidade."
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/ciclo" className="btn btn-outline btn-md gap-2 border-2">
            <span>⚙️</span> Ajustar Ciclo
          </Link>
          <Link
            href="/exercicios"
            className="btn btn-primary btn-md gap-2 shadow-lg shadow-primary/20"
          >
            <span>🚀</span> Iniciar Sessão
          </Link>
        </div>
      </header>

      {/* Grid Principal de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Nota Líquida
              </span>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-5xl font-black ${stats.netScore >= 0 ? "text-success" : "text-error"}`}
              >
                {stats.netScore}
              </span>
              <span className="text-xs font-bold opacity-30">PURA</span>
            </div>

            <div className="mt-4 flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="opacity-50">Normalizada (ISQ)</span>
                <span
                  className={
                    stats.normalizedNetScore < stats.netScore
                      ? "text-warning"
                      : "text-success"
                  }
                >
                  {stats.normalizedNetScore.toFixed(1)}
                </span>
              </div>
              <div className="h-1 w-full bg-base-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${stats.normalizedNetScore >= stats.netScore ? "bg-success" : "bg-warning"}`}
                  style={{
                    width: `${Math.min(100, (stats.normalizedNetScore / stats.targetScore) * 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-[9px] mt-1 opacity-40 leading-tight">
                Benchmark ISQ: 0.65 (Cargo 15) <br />
                Seu ISQ: {stats.avgISQ.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                Índice de Calibração
              </span>
              <span className="text-2xl">⚖️</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-accent">
                {(stats.calibrationIndex * 100).toFixed(0)}%
              </span>
              <span className="text-xs font-bold opacity-30">IC</span>
            </div>
            <p className="text-[10px] mt-4 font-bold opacity-40 uppercase">
              {stats.calibrationIndex > 0.8
                ? "Sincronia Total"
                : "Risco de Ponto Cego"}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
                Questões Totais
              </span>
              <span className="text-2xl">📚</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-secondary">
                {stats.totalQuestions}
              </span>
              <span className="text-xs font-bold opacity-30">ITENS</span>
            </div>
            <p className="text-[10px] mt-4 font-bold opacity-40 uppercase">
              {stats.falseConvictions} Falsas Convicções
            </p>
          </div>
        </div>

        <div
          className={`card ${dueSubjects.length > 0 ? "bg-error text-error-content shadow-error/20 animate-pulse" : "bg-primary text-primary-content shadow-primary/30"} shadow-2xl border-none overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
        >
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                {dueSubjects.length > 0
                  ? "Atenção: Base Exposta"
                  : "Próxima Parada"}
              </span>
              <h3 className="text-2xl font-black mt-2 leading-tight">
                {dueSubjects.length > 0
                  ? `${dueSubjects.length} Revisões Pendentes`
                  : currentSubject?.name || "Ciclo Vazio"}
              </h3>
            </div>
            <div className="mt-4">
              {dueSubjects.length > 0 ? (
                <Link
                  href="/revisoes"
                  className="btn btn-sm btn-ghost bg-white/20 hover:bg-white/40 border-none font-black uppercase text-[10px] w-full"
                >
                  Blindar Base Agora
                </Link>
              ) : (
                <>
                  <div className="flex justify-between text-[10px] font-black mb-1 opacity-70">
                    <span>PROGRESSO MATÉRIA</span>
                    <span>
                      {currentSubject
                        ? Math.round(
                            (currentSubject.elapsedSeconds /
                              (currentSubject.durationMinutes * 60)) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full"
                      style={{
                        width: `${currentSubject ? (currentSubject.elapsedSeconds / (currentSubject.durationMinutes * 60)) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simulador de Ponto de Equilíbrio (Módulo 3.1.3) */}
        <div className="lg:col-span-2 card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
          <div className="bg-base-200 px-6 py-4 border-b border-base-300 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-60">
              Simulador de Ponto de Equilíbrio (Survival vs Ranking)
            </h3>
            <span
              className={`badge font-black uppercase text-[10px] ${p1Danger || p2Danger ? "badge-error animate-pulse" : "badge-success"}`}
            >
              {p1Danger || p2Danger ? "Modo Sobrevivência" : "Modo Ranking"}
            </span>
          </div>
          <div className="p-8 space-y-10">
            {/* Bloco P1 */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-black text-sm uppercase">
                    P1 - Conhecimentos Básicos
                  </h4>
                  <p className="text-[10px] opacity-40 font-bold">
                    MÍNIMO: {p1Min} PONTOS LÍQUIDOS
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-3xl font-black ${p1Danger ? "text-error" : "text-success"}`}
                  >
                    {stats.p1Projection.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-bold opacity-30 ml-2">
                    PROJEÇÃO
                  </span>
                </div>
              </div>
              <div className="relative h-4 bg-base-200 rounded-full overflow-hidden shadow-inner font-mono text-[10px]">
                {/* Projeção Total */}
                <div
                  className={`h-full absolute top-0 left-0 transition-all duration-1000 ${p1Danger ? "bg-error shadow-[0_0_15px_rgba(255,0,0,0.3)]" : "bg-success"}`}
                  style={{
                    width: `${Math.min((stats.p1Projection / 50) * 100, 100)}%`,
                  }}
                ></div>
                {/* Projeção Literalidade (Potencial de Base) */}
                <div
                  className="h-full absolute top-0 left-0 bg-white/30 transition-all duration-1000"
                  style={{
                    width: `${Math.min((stats.p1LiteralProjection / 50) * 100, 100)}%`,
                  }}
                ></div>
                <div className="absolute top-0 left-[20%] h-full w-0.5 bg-base-content/20 z-10"></div>
                <span className="absolute top-0 left-[21%] opacity-30 pointer-events-none font-black">
                  MÍN (10)
                </span>
              </div>
            </div>

            {/* Bloco P2 */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-black text-sm uppercase">
                    P2 - Conhecimentos Específicos
                  </h4>
                  <p className="text-[10px] opacity-40 font-bold">
                    MÍNIMO: {p2Min} PONTOS LÍQUIDOS
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-3xl font-black ${p2Danger ? "text-error" : "text-success"}`}
                  >
                    {stats.p2Projection.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-bold opacity-30 ml-2">
                    PROJEÇÃO
                  </span>
                </div>
              </div>
              <div className="relative h-4 bg-base-200 rounded-full overflow-hidden shadow-inner font-mono text-[10px]">
                {/* Projeção Total */}
                <div
                  className={`h-full absolute top-0 left-0 transition-all duration-1000 ${p2Danger ? "bg-error shadow-[0_0_15px_rgba(255,0,0,0.3)]" : "bg-success"}`}
                  style={{
                    width: `${Math.min((stats.p2Projection / 70) * 100, 100)}%`,
                  }}
                ></div>
                {/* Projeção Literalidade */}
                <div
                  className="h-full absolute top-0 left-0 bg-white/30 transition-all duration-1000"
                  style={{
                    width: `${Math.min((stats.p2LiteralProjection / 70) * 100, 100)}%`,
                  }}
                ></div>
                <div className="absolute top-0 left-[30%] h-full w-0.5 bg-base-content/20 z-10"></div>
                <span className="absolute top-0 left-[31%] opacity-30 pointer-events-none font-black">
                  MÍN (21)
                </span>
              </div>
            </div>

            <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-base-100 flex items-center justify-center text-2xl shadow-sm">
                {p1Danger || p2Danger ? "⚠️" : "🏁"}
              </div>
              <div className="flex-1">
                <h5 className="text-[10px] font-black uppercase opacity-60">
                  Diagnóstico Tático
                </h5>
                <p className="text-xs font-bold mt-1">
                  {p1Danger || p2Danger
                    ? "Eliminação Técnica Iminente. O algoritmo travou o ciclo em 'Modo Resgate' para garantir os mínimos."
                    : `Base sólida detectada. Você está a ${(stats.targetScore - (stats.p1Projection + stats.p2Projection)).toFixed(0)} pontos da Nota de Corte Estimada.`}
                </p>
              </div>
              {!p1Danger && !p2Danger && (
                <div
                  className="radial-progress text-primary text-[10px] font-black"
                  style={
                    {
                      "--value": Math.round(
                        ((stats.p1Projection + stats.p2Projection) /
                          stats.targetScore) *
                          100,
                      ),
                      "--size": "3rem",
                      "--thickness": "4px",
                    } as any
                  }
                >
                  {Math.round(
                    ((stats.p1Projection + stats.p2Projection) /
                      stats.targetScore) *
                      100,
                  )}
                  %
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alertas Críticos e Alpha Items */}
        <div className="space-y-6">
          <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
            <div className="bg-base-200 px-6 py-4 border-b border-base-300">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-60">
                Itens Alpha (Classificação)
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {!p1Danger && !p2Danger ? (
                <>
                  <p className="text-[10px] font-bold opacity-40 uppercase leading-relaxed">
                    Você está seguro. O sistema autorizou a marcação de itens de
                    risco médio em:
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-xl border border-primary/20">
                      <span className="text-xs font-bold">
                        Atos Administrativos
                      </span>
                      <span className="badge badge-primary badge-xs font-bold">
                        RISCO ALPHA
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/5 rounded-xl border border-secondary/20">
                      <span className="text-xs font-bold">Redação Oficial</span>
                      <span className="badge badge-secondary badge-xs font-bold">
                        GANHO ROI
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="alert bg-error/10 text-error-content border-error/20 p-4">
                  <p className="text-xs font-bold italic opacity-60">
                    Modo Ranking bloqueado. Atinja os mínimos de P1 e P2 para
                    liberar a estratégia agressiva.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
            <div className="bg-base-200 px-6 py-4 border-b border-base-300">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-60">
                Evolução do IC
              </h3>
            </div>
            <div className="p-8 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-8 border-base-200"></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-accent border-t-transparent transition-all duration-1000 rotate-45"
                  style={{
                    clipPath: `polygon(50% 50%, -50% -50%, 150% -50%, 150% 150%, -50% 150%, -50% -50%)`,
                  }}
                ></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl rotate-45">🧭</span>
                  <span className="text-3xl font-black">
                    {(stats.calibrationIndex * 100).toFixed(0)}
                  </span>
                  <span className="text-[8px] font-black uppercase opacity-40">
                    Benchmark
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
