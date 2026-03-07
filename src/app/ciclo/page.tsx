"use client";

import { useState, useEffect } from "react";
import { useStudy } from "@/contexts/StudyContext";
import { CycleSubject } from "@/types";

export default function Ciclo() {
  const { subjects, setSubjects, rebalanceCycle } = useStudy();
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState<number | string>(60);
  const [newWeight, setNewWeight] = useState<number>(1);
  const [newExamPart, setNewExamPart] = useState<"P1" | "P2">("P1");
  const [newBaseIsq, setNewBaseIsq] = useState<number>(0.5);
  const [totalCycleHours, setTotalCycleHours] = useState<number>(20);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSubjects((prev) => {
        const anyRunning = prev.some((s) => s.isRunning);
        if (!anyRunning) return prev;

        return prev.map((subject) => {
          if (!subject.isRunning) return subject;
          return {
            ...subject,
            elapsedSeconds: subject.elapsedSeconds + 1,
          };
        });
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [setSubjects]);

  function handleAddSubject() {
    if (newName.trim() === "" || newDuration === "") return;
    const newSubject: CycleSubject = {
      id: Date.now().toString(),
      name: newName,
      durationMinutes: Number(newDuration),
      color: "primary",
      elapsedSeconds: 0,
      isRunning: false,
      weight: newWeight,
      examPart: newExamPart,
      performance: {
        correct: 0,
        wrong: 0,
        omitted: 0,
        totalTimeSeconds: 0,
        averageConfidence: 0,
      },
      baseIsq: newBaseIsq,
    };
    setSubjects([...subjects, newSubject]);
    setNewName("");
    setNewDuration(60);
    setNewWeight(1);
    setNewBaseIsq(0.5);
  }

  function handleDelete(id: string) {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  }

  function handleToggleTimer(id: string) {
    setSubjects((prev) => {
      return prev.map((subject) => ({
        ...subject,
        isRunning: subject.id === id ? !subject.isRunning : false,
      }));
    });
  }

  const totalMinutes = subjects.reduce(
    (acc, subject) => acc + subject.durationMinutes,
    0,
  );

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b border-base-300 pb-4">
        <div>
          <h1 className="text-3xl font-black">Ciclo de Estudos</h1>
          <p className="text-base-content/60">
            Gestão dinâmica de carga horária
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold opacity-50">
              Meta Semanal
            </span>
            <input
              type="number"
              className="input input-sm input-bordered w-20 text-right font-bold"
              value={totalCycleHours}
              onChange={(e) => setTotalCycleHours(Number(e.target.value))}
            />
          </div>
          <button
            className="btn btn-accent btn-sm font-black uppercase"
            onClick={() => rebalanceCycle(totalCycleHours)}
          >
            🔄 Rebalancear Ciclo
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Adicionar Matéria */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-6 space-y-4">
            <h3 className="card-title text-sm uppercase opacity-50">
              Nova Disciplina
            </h3>
            <div className="form-control">
              <label className="label text-xs font-bold">Nome</label>
              <input
                type="text"
                placeholder="Ex: Administração Geral"
                className="input input-bordered w-full"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label text-xs font-bold">Peso Edital</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                />
              </div>
              <div className="form-control">
                <label className="label text-xs font-bold">Tempo (min)</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold flex justify-between">
                <span>Dificuldade (ISQ Base)</span>
                <span className="opacity-50">{newBaseIsq.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                className="range range-primary range-xs"
                value={newBaseIsq}
                onChange={(e) => setNewBaseIsq(Number(e.target.value))}
              />
              <div className="flex justify-between text-[8px] font-black uppercase mt-1 opacity-30">
                <span>Literal</span>
                <span>Alpha</span>
              </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold">Bloco do Edital</label>
              <div className="flex bg-base-200 p-1 rounded-lg gap-1">
                <button
                  className={`flex-1 py-1 text-[10px] font-black rounded-md transition-all ${newExamPart === "P1" ? "bg-primary text-primary-content shadow" : "opacity-40"}`}
                  onClick={() => setNewExamPart("P1")}
                >
                  P1 (BÁSICOS)
                </button>
                <button
                  className={`flex-1 py-1 text-[10px] font-black rounded-md transition-all ${newExamPart === "P2" ? "bg-secondary text-secondary-content shadow" : "opacity-40"}`}
                  onClick={() => setNewExamPart("P2")}
                >
                  P2 (ESPECÍFICOS)
                </button>
              </div>
            </div>
            <button
              className="btn btn-primary btn-block mt-4 uppercase font-black"
              onClick={handleAddSubject}
            >
              Adicionar ao Ciclo
            </button>
          </div>
        </div>

        {/* Lista de Matérias */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm uppercase font-bold opacity-50">
              Disciplinas Ativas
            </h3>
            <span className="badge badge-neutral font-mono">
              {totalMinutes} min totais
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {subjects.map((subject) => {
              const progress =
                (subject.elapsedSeconds / (subject.durationMinutes * 60)) * 100;
              const totalItems =
                subject.performance.correct + subject.performance.wrong;
              const dl =
                totalItems > 0
                  ? (subject.performance.correct - subject.performance.wrong) /
                    totalItems
                  : 0;

              return (
                <div
                  key={subject.id}
                  className={`card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all overflow-hidden ${subject.isRunning ? "ring-2 ring-primary border-transparent" : ""}`}
                >
                  <div className="card-body p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-xl font-bold">{subject.name}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="badge badge-xs badge-outline opacity-50">
                            Peso: {subject.weight}
                          </span>
                          <span
                            className={`badge badge-xs font-bold ${subject.examPart === "P1" ? "badge-primary" : "badge-secondary"}`}
                          >
                            {subject.examPart}
                          </span>
                          <span
                            className={`badge badge-xs font-bold ${subject.baseIsq < 0.4 ? "badge-info" : subject.baseIsq > 0.6 ? "badge-accent" : "badge-neutral"}`}
                          >
                            ISQ: {subject.baseIsq.toFixed(2)}
                          </span>
                          <span
                            className={`badge badge-xs font-bold ${dl < 0.4 ? "badge-error" : dl < 0.7 ? "badge-warning" : "badge-success"}`}
                          >
                            DL: {(dl * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-mono font-black">
                          {formatTime(subject.elapsedSeconds)}
                        </div>
                        <div className="text-[10px] opacity-50 uppercase font-bold">
                          Meta: {subject.durationMinutes} min
                        </div>
                      </div>
                    </div>

                    <progress
                      className={`progress w-full h-3 mb-4 ${progress > 100 ? "progress-success" : "progress-primary"}`}
                      value={Math.min(progress, 100)}
                      max="100"
                    ></progress>

                    <div className="card-actions justify-between items-center">
                      <button
                        className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                        onClick={() => handleDelete(subject.id)}
                      >
                        Remover
                      </button>
                      <button
                        className={`btn btn-sm ${subject.isRunning ? "btn-warning" : "btn-primary"} gap-2 px-6 font-black uppercase`}
                        onClick={() => handleToggleTimer(subject.id)}
                      >
                        {subject.isRunning ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Pausar
                          </>
                        ) : (
                          <>
                            <span>▶</span>
                            Estudar Agora
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {subjects.length === 0 && (
              <div className="text-center py-12 bg-base-200/50 rounded-2xl border-2 border-dashed border-base-300">
                <p className="opacity-40 italic">
                  Nenhuma disciplina no seu ciclo. Adicione uma para começar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
