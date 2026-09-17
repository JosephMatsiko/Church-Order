"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { QuizCard } from "./Quiz";
import { Cites } from "./Cite";
import { useProgress } from "@/lib/store";
import type { CaseStudy, Card, Question } from "@/lib/types";

type Unit = { n: number; t: string };
type Meta = { units: Unit[]; counts: { lessons: number; questions: number; cards: number } };

export function Practice() {
  const [tab, setTab] = useState<"exam" | "cards" | "cases">("exam");
  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => { fetch("/data/meta.json").then((r) => r.json()).then(setMeta).catch(() => {}); }, []);

  return (
    <>
      <div className="seg" style={{ marginBottom: 28 }}>
        {(["exam", "cards", "cases"] as const).map((k) => (
          <button key={k} data-on={tab === k} onClick={() => setTab(k)}>
            {k === "exam" ? "Exam" : k === "cards" ? "Flashcards" : "Cases"}
          </button>
        ))}
      </div>
      {tab === "exam" ? <Exam units={meta?.units ?? []} /> : tab === "cards" ? <Cards /> : <Cases />}
    </>
  );
}

/* ---------------- exam ---------------- */
function Exam({ units }: { units: Unit[] }) {
  const { progress, reset } = useProgress();
  const [pool, setPool] = useState<Question[]>([]);
  const [scope, setScope] = useState(0);
  const [len, setLen] = useState(20);
  const [run, setRun] = useState<Question[] | null>(null);
  const [at, setAt] = useState(0);
  const [right, setRight] = useState(0);

  useEffect(() => { fetch("/data/quiz.json").then((r) => r.json()).then(setPool).catch(() => {}); }, []);

  const start = (unit = scope) => {
    const src = pool.filter((q) => !unit || q.unit === unit);
    const shuffled = [...src].sort(() => Math.random() - 0.5).slice(0, Math.min(len, src.length));
    setRun(shuffled); setAt(0); setRight(0);
  };

  const rows = useMemo(() => Object.entries(progress.acc).sort((a, b) => Number(a[0]) - Number(b[0])), [progress.acc]);
  const weakest = rows.filter(([, a]) => a.n >= 3).sort((a, b) => a[1].r / a[1].n - b[1].r / b[1].n)[0];

  if (run) {
    if (at >= run.length) {
      return (
        <div className="panel" style={{ maxWidth: "36rem" }}>
          <h3>{right} of {run.length} correct</h3>
          <p className="small">{Math.round((right / run.length) * 100)} percent on this set.</p>
          <div className="row"><button className="btn" onClick={() => start()}>Draw another set</button>
            <button className="btn ghost" onClick={() => setRun(null)}>Back</button></div>
        </div>
      );
    }
    const q = run[at];
    return (
      <div style={{ maxWidth: "36rem" }}>
        <div className="bar" style={{ marginBottom: 16 }}><i style={{ width: `${(at / run.length) * 100}%` }} /></div>
        <p className="small">Question {at + 1} of {run.length} · {q.title}</p>
        <QuizCard key={at} q={q} unit={q.unit} onAnswer={(ok) => { if (ok) setRight((n) => n + 1); }} />
        <div className="row">
          <button className="btn" onClick={() => setAt((n) => n + 1)}>Next</button>
          <Link className="btn ghost" href={`/lessons/${q.lesson}`}>Go to the lesson</Link>
          <button className="btn ghost" onClick={() => setRun(null)}>Stop</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="lead">Draw questions at random from the whole course or from one unit. A wrong answer shows the reasoning and the provision behind it.</p>
      <div className="row">
        <label className="field"><span>Scope</span>
          <select value={scope} onChange={(e) => setScope(Number(e.target.value))} style={{ minWidth: "16rem" }}>
            <option value={0}>Whole course</option>
            {units.map((u) => <option key={u.n} value={u.n}>{u.n}. {u.t}</option>)}
          </select>
        </label>
        <label className="field"><span>Questions</span>
          <select value={len} onChange={(e) => setLen(Number(e.target.value))}><option>10</option><option>20</option><option>40</option></select>
        </label>
        <button className="btn" disabled={!pool.length} onClick={() => start()}>Start</button>
      </div>

      {rows.length ? (
        <section style={{ marginTop: 34 }}>
          <h2>Your record</h2>
          <div className="tablewrap">
            <table>
              <thead><tr><th>Unit</th><th>Answered</th><th>Right</th><th style={{ width: "34%" }} /></tr></thead>
              <tbody>
                {rows.map(([u, a]) => {
                  const pct = Math.round((a.r / a.n) * 100);
                  return (
                    <tr key={u}>
                      <td>{u}. {units.find((x) => x.n === Number(u))?.t}</td>
                      <td className="n">{a.n}</td>
                      <td className="n">{a.r} ({pct}%)</td>
                      <td><div className="bar"><i style={{ width: `${pct}%`, background: pct >= 80 ? "var(--ok)" : pct >= 60 ? "var(--warn)" : "var(--bad)" }} /></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="row">
            {weakest ? <button className="btn ghost" onClick={() => { setScope(Number(weakest[0])); start(Number(weakest[0])); }}>Drill unit {weakest[0]}, your weakest</button> : null}
            <button className="btn ghost" onClick={() => reset("acc")}>Clear the record</button>
          </div>
        </section>
      ) : null}
    </>
  );
}

/* ---------------- flashcards ---------------- */
function Cards() {
  const { progress, grade, reset } = useProgress();
  const [deck, setDeck] = useState<Card[]>([]);
  const [i, setI] = useState(0);
  const [face, setFace] = useState<"front" | "back">("front");

  useEffect(() => { fetch("/data/cards.json").then((r) => r.json()).then(setDeck).catch(() => {}); }, []);

  const ordered = useMemo(
    () => [...deck].sort((a, b) => (progress.box[a.key] ?? 0) - (progress.box[b.key] ?? 0) || Math.random() - 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deck],
  );
  if (!ordered.length) return <p className="small">Loading the deck.</p>;
  const card = ordered[i % ordered.length];
  const known = Object.values(progress.box).filter((b) => b >= 2).length;

  const mark = (ok: boolean) => { grade(card.key, ok); setFace("front"); setI((n) => n + 1); };

  return (
    <>
      <p className="lead">Every term in the glossary and every threshold in the tables, drawn as cards. Miss one and it comes back sooner.</p>
      <div className="stats" style={{ maxWidth: "36rem" }}>
        <div className="stat"><b>{ordered.length}</b><span>Cards in the deck</span></div>
        <div className="stat ok"><b>{known}</b><span>Marked known</span></div>
      </div>
      <div className="flip" data-face={face} onClick={() => setFace(face === "front" ? "back" : "front")}>
        <div className="inner">
          <div className="face"><span className="k">{card.kind === "term" ? "Term" : "Threshold"}</span><p>{card.front}</p><span className="small">Tap to turn over</span></div>
          <div className="face back">
            <span className="k">Answer</span><p>{card.back}</p>
            {card.cites?.length ? <div className="side"><Cites list={card.cites} /></div> : null}
          </div>
        </div>
      </div>
      <div className="row">
        <button className="btn ghost" onClick={() => mark(false)}>Missed it</button>
        <button className="btn" onClick={() => mark(true)}>Knew it</button>
        <button className="btn ghost" onClick={() => reset("box")}>Reset the deck</button>
      </div>
    </>
  );
}

/* ---------------- cases ---------------- */
function Cases() {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  useEffect(() => { fetch("/data/cases.json").then((r) => r.json()).then(setCases).catch(() => {}); }, []);
  return (
    <>
      <p className="lead">Each case is invented. The people and churches are placeholders. Work the questions before opening the answers.</p>
      <div className="grid2">
        {cases.map((c) => (
          <Link key={c.id} href={`/cases/${c.id}`} className="card">
            <h3>{c.t}</h3>
            <p className="small">{c.sc.slice(0, 120)}…</p>
            <p className="mono small" style={{ marginTop: 10 }}>{c.q.length} questions</p>
          </Link>
        ))}
      </div>
    </>
  );
}
