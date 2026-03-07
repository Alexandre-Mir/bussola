"use client";

import { useStudy } from "@/contexts/StudyContext";
import { CycleSubject } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export default function Revisoes() {
  const { subjects, scheduleReview } = useStudy();
  const [selectedSubject, setSelectedSubject] = useState<CycleSubject | null>(
    null,
  );

  const dueSubjects = subjects.filter((s) => {
    if (!s.nextReview) return false;
    return s.nextReview <= Date.now();
  });

  const upcomingSubjects = subjects
    .filter((s) => {
      if (!s.nextReview) return false;
      return s.nextReview > Date.now();
    })
    .sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0));

  const subjectsWithoutReview = subjects.filter((s) => !s.nextReview);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="border-b border-base-300 pb-8">
        <h1 className="text-4xl font-black tracking-tighter uppercase">
          Gestão de Revisões (SRS)
        </h1>
        <p className="text-base-content/60 font-medium mt-1">
          Algoritmo de Repetição Espaçada • Otimização de Retenção de Longo
          Prazo
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Pendências e Agendamento */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🚨</span>
              <h2 className="text-lg font-black uppercase tracking-tight">
                Revisões Vencidas
              </h2>
              <span className="badge badge-error font-black text-[10px]">
                {dueSubjects.length}
              </span>
            </div>

            <div className="space-y-4">
              {dueSubjects.map((s) => (
                <div
                  key={s.id}
                  className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden"
                >
                  <div className="p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold border border-base-content/10"
                        style={{
                          backgroundColor: `${s.color}20`,
                          color: s.color,
                        }}
                      >
                        {s.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold">{s.name}</h3>
                        <p className="text-[10px] font-black uppercase opacity-40">
                          Vencido há{" "}
                          {formatDistanceToNow(s.nextReview!, { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSubject(s)}
                      className="btn btn-primary btn-sm font-black uppercase text-xs"
                    >
                      Executar Revisão
                    </button>
                  </div>
                </div>
              ))}
              {dueSubjects.length === 0 && (
                <div className="p-12 text-center bg-base-100 rounded-3xl border-2 border-dashed border-base-300">
                  <span className="text-4xl">✅</span>
                  <p className="text-sm font-medium opacity-40 mt-2 italic">
                    Nenhuma revisão pendente para hoje.
                  </p>
                </div>
              )}
            </div>
          </section>

          {selectedSubject && (
            <section className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="card bg-base-100 border-2 border-primary shadow-2xl overflow-hidden">
                <div className="card-body p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight uppercase">
                        Concluir Revisão: {selectedSubject.name}
                      </h2>
                      <p className="text-sm opacity-60">
                        Como foi o seu domínio do conteúdo durante esta revisão?
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSubject(null)}
                      className="btn btn-ghost btn-circle"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        level: 1,
                        label: "Precário",
                        desc: "Novas lacunas",
                        color: "btn-error",
                      },
                      {
                        level: 2,
                        label: "Suficiente",
                        desc: "Esqueci detalhes",
                        color: "btn-warning",
                      },
                      {
                        level: 3,
                        label: "Bom",
                        desc: "Domínio sólido",
                        color: "btn-accent",
                      },
                      {
                        level: 4,
                        label: "Excelência",
                        desc: "Ensino o tema",
                        color: "btn-success",
                      },
                    ].map((rating) => (
                      <button
                        key={rating.level}
                        onClick={() => {
                          scheduleReview(
                            selectedSubject.id,
                            rating.level as any,
                          );
                          setSelectedSubject(null);
                        }}
                        className={`btn ${rating.color} btn-outline h-24 flex flex-col gap-1 border-2`}
                      >
                        <span className="text-lg font-black">
                          {rating.label}
                        </span>
                        <span className="text-[9px] opacity-70 font-bold uppercase">
                          {rating.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="alert bg-base-200 text-[10px] font-bold uppercase tracking-wider p-4">
                    💡 Dica: Seja honesto. O sistema ajustará o próximo
                    intervalo (1, 7, 15 ou 30 dias) para maximizar sua memória
                    de longo prazo.
                  </div>
                </div>
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⏳</span>
              <h2 className="text-lg font-black uppercase tracking-tight">
                Primeira Revisão Pendente
              </h2>
              <span className="badge badge-neutral font-black text-[10px]">
                {subjectsWithoutReview.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectsWithoutReview.map((s) => (
                <div
                  key={s.id}
                  className="card bg-base-100 border border-base-300 p-4 transition-all hover:border-primary/40 group"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{s.name}</span>
                    <button
                      onClick={() => setSelectedSubject(s)}
                      className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100"
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Lado Direito: Próximos Eventos */}
        <div className="space-y-6">
          <div className="card bg-base-200 border border-base-300 shadow-xl rounded-3xl overflow-hidden">
            <div className="p-6 space-y-6">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] opacity-50">
                CRONOGRAMA DE RETENÇÃO
              </h3>

              <div className="space-y-4">
                {upcomingSubjects.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center min-w-[50px]">
                      <span className="text-lg font-black">
                        {new Date(s.nextReview!).getDate()}
                      </span>
                      <span className="text-[10px] font-black uppercase opacity-40">
                        {new Date(s.nextReview!).toLocaleDateString("pt-BR", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex-1 p-3 bg-base-100 rounded-2xl border border-base-100 shadow-sm">
                      <h4 className="text-xs font-black uppercase truncate">
                        {s.name}
                      </h4>
                      <p className="text-[9px] font-bold opacity-30 mt-1">
                        EM{" "}
                        {formatDistanceToNow(s.nextReview!, { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
                {upcomingSubjects.length === 0 && (
                  <p className="text-xs italic opacity-40 text-center py-4">
                    Nenhum evento futuro agendado.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="card bg-linear-to-br from-primary to-accent text-white shadow-lg rounded-3xl">
            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-black leading-tight italic">
                Efeito de Espaçamento
              </h3>
              <p className="text-sm font-medium opacity-90">
                Estudar o mesmo tema em intervalos crescentes é **3x mais
                eficiente** do que a exaustão em um único bloco.
              </p>
              <div className="pt-4 border-t border-white/20">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span>Sua Eficiência SRS</span>
                  <span>92%</span>
                </div>
                <div className="h-1 bg-black/20 rounded-full mt-2">
                  <div className="h-full bg-white w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
