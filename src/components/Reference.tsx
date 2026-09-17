"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Cites } from "./Cite";
import type { MapRow, Meta, Num, Source, Term } from "@/lib/types";

type Props = {
  map: MapRow[]; terms: Term[]; numbers: Num[]; sources: Source[]; meta: Meta;
  counts: { ok: number; int: number; unv: number; cited: number };
};
type Tab = "book" | "terms" | "numbers" | "sources";

export function Reference({ map, terms, numbers, sources, meta, counts }: Props) {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) || "book");
  const [q, setQ] = useState(params.get("q") ?? "");

  const needle = q.trim().toLowerCase();
  const filtMap = useMemo(() => map.filter((m) => !needle || `${m.ch} ${m.t} ${m.s}`.toLowerCase().includes(needle)), [map, needle]);
  const filtTerms = useMemo(
    () => [...terms].sort((a, b) => a.t.localeCompare(b.t)).filter((t) => !needle || `${t.t} ${t.d}`.toLowerCase().includes(needle)),
    [terms, needle],
  );
  const groups = useMemo(() => [...new Set(numbers.map((n) => n.g))], [numbers]);

  return (
    <>
      <div className="seg" style={{ marginBottom: 24 }}>
        {(["book", "terms", "numbers", "sources"] as const).map((k) => (
          <button key={k} data-on={tab === k} onClick={() => setTab(k)}>
            {k === "book" ? "The book" : k === "terms" ? "Terms" : k === "numbers" ? "Numbers" : "Sources"}
          </button>
        ))}
      </div>

      {tab !== "sources" && tab !== "numbers" ? (
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tab === "book" ? "Filter by word or chapter number" : "Filter the terms"} style={{ width: "100%", maxWidth: "26rem", marginBottom: 22 }} />
      ) : null}

      {tab === "book" ? (
        <>
          {["Preface", "Form of Government", "Rules of Discipline", "Directory for the Worship of God"].map((part) => {
            const rows = filtMap.filter((m) => m.part === part);
            if (!rows.length) return null;
            return (
              <section key={part}>
                <h2>{part}</h2>
                {rows.map((m) => (
                  <div className="entry" key={String(m.ch)}>
                    <h3>{typeof m.ch === "number" ? `Chapter ${m.ch}. ${m.t}` : `${m.ch} ${m.t}`}</h3>
                    <p>{m.s}</p>
                    <div className="side">
                      <Cites list={[typeof m.ch === "number" ? `BCO ${m.ch}` : `BCO ${m.ch}`]} />
                      <Cites list={(m.k ?? []).map((k) => `BCO ${k}`)} />
                    </div>
                  </div>
                ))}
              </section>
            );
          })}
        </>
      ) : null}

      {tab === "terms" ? (
        <>
          <p className="small">{filtTerms.length} of {terms.length} terms</p>
          {filtTerms.map((t) => (
            <div className="entry" key={t.t}>
              <h3>{t.t}</h3>
              <p>{t.d}</p>
              <div className="side"><Cites list={t.c} /></div>
            </div>
          ))}
        </>
      ) : null}

      {tab === "numbers" ? (
        <>
          <p className="lead">Every quorum, threshold, notice period and deadline taught in this course.</p>
          {groups.map((g) => (
            <section key={g}>
              <h2>{g}</h2>
              <div className="tablewrap">
                <table>
                  <thead><tr><th>Question</th><th>Answer</th><th>Where</th></tr></thead>
                  <tbody>
                    {numbers.filter((n) => n.g === g).map((n, i) => (
                      <tr key={i}><td>{n.w}</td><td className="n">{n.v}</td><td><Cites list={n.c} /></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </>
      ) : null}

      {tab === "sources" ? (
        <>
          <p className="lead">{meta.edition} {meta.built}</p>
          <h2>How to read the labels</h2>
          <div className="prose">
            <ul>
              <li>A citation beside a passage means it was written from that section of the current text, and the chip opens the page where it is printed.</li>
              <li>A passage marked <b>Teaching summary</b> is explanation, comparison or judgment rather than a provision of the book.</li>
              <li>A passage marked <b>Not checked here</b> rests on standard accounts that were not verified against a primary source.</li>
              <li>Quotations appear only where the text quoted is public domain. The Book of Church Order is paraphrased throughout and never reproduced.</li>
            </ul>
          </div>
          <div className="stats">
            <div className="stat ok"><b>{counts.ok}</b><span>Checked passages</span></div>
            <div className="stat warn"><b>{counts.int}</b><span>Teaching summaries</span></div>
            <div className="stat bad"><b>{counts.unv}</b><span>Not checked here</span></div>
            <div className="stat"><b>{counts.cited}</b><span>Distinct provisions cited</span></div>
          </div>
          <h2>Sources</h2>
          {sources.map((s) => (
            <div className="entry" key={s.url + s.t}>
              <h3><a href={s.url} target="_blank" rel="noopener noreferrer">{s.t}</a></h3>
              <p className="small">{s.pub}</p>
              <p>{s.use}</p>
            </div>
          ))}
          <h2>Permission</h2>
          <div className="prose">
            <p>The current Book of Church Order carries a notice against reproducing its text without written permission from the Office of the Stated Clerk, and names electronic resources in particular. This course cites and paraphrases, and reproduces no part of it.</p>
          </div>
        </>
      ) : null}
    </>
  );
}
