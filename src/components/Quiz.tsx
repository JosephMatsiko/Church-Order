"use client";
import { useState } from "react";
import { Cites } from "./Cite";
import { useProgress } from "@/lib/store";
import type { Question } from "@/lib/types";

export function QuizCard({ q, unit, onAnswer }: { q: Question; unit?: number; onAnswer?: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const { record } = useProgress();

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === q.a;
    if (unit) record(unit, ok);
    onAnswer?.(ok);
  };

  return (
    <div className="quiz panel" style={{ marginBottom: 16 }}>
      <p className="stem">{q.q}</p>
      {q.o.map((o, i) => (
        <button
          key={i}
          className="opt"
          disabled={picked !== null}
          data-state={picked === null ? undefined : i === q.a ? "right" : i === picked ? "wrong" : undefined}
          onClick={() => choose(i)}
        >
          {o}
        </button>
      ))}
      {picked !== null ? (
        <div className="verdict">
          <b>{picked === q.a ? "Right" : "Not quite"}</b>
          {q.w}
          {q.c?.length ? <div className="side" style={{ marginTop: 10 }}><Cites list={q.c} /></div> : null}
        </div>
      ) : null}
    </div>
  );
}

export function Quiz({ questions, unit }: { questions: Question[]; unit: number }) {
  const [right, setRight] = useState(0);
  const [answered, setAnswered] = useState(0);
  return (
    <div>
      {questions.map((q, i) => (
        <QuizCard key={i} q={q} unit={unit} onAnswer={(ok) => { setAnswered((n) => n + 1); if (ok) setRight((n) => n + 1); }} />
      ))}
      {answered === questions.length ? (
        <p className="small">You answered {right} of {questions.length} correctly.</p>
      ) : null}
    </div>
  );
}
