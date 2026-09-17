"use client";
import { useState } from "react";
import { Cites } from "./Cite";

type Q = { q: string; a: string; c?: string[] };

export function CaseAnswers({ questions }: { questions: Q[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  return (
    <div style={{ maxWidth: "36rem" }}>
      {questions.map((q, i) => (
        <div className="panel" key={i} style={{ marginBottom: 14 }}>
          <p className="stem">{i + 1}. {q.q}</p>
          {open[i] ? (
            <div className="verdict">
              <b>Answer</b>
              {q.a}
              {q.c?.length ? <div className="side" style={{ marginTop: 10 }}><Cites list={q.c} /></div> : null}
            </div>
          ) : (
            <button className="btn ghost tiny" onClick={() => setOpen({ ...open, [i]: true })}>Show the answer</button>
          )}
        </div>
      ))}
    </div>
  );
}
