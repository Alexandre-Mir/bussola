"use client";

import { useState, useEffect, useRef } from "react";

interface StudyTimerProps {
  onTick?: (seconds: number) => void;
  isRunning: boolean;
}

export default function StudyTimer({ onTick, isRunning }: StudyTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (onTick) onTick(1);
          return next;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, onTick]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 bg-base-300 px-4 py-2 rounded-full border border-base-100 shadow-inner">
      <div
        className={`w-2 h-2 rounded-full ${isRunning ? "bg-success animate-pulse" : "bg-error"}`}
      ></div>
      <span className="font-mono text-xl font-black tracking-tighter w-16 text-center">
        {formatTime(seconds)}
      </span>
      <span className="text-[10px] font-black uppercase opacity-40">
        Tempo de Sessão
      </span>
    </div>
  );
}
