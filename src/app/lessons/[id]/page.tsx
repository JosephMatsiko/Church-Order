import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { lessonById, lessons, neighbours, unitOf } from "@/lib/content";
import { Cites } from "@/components/Cite";
import { LessonChrome } from "@/components/LessonChrome";
import { Quiz } from "@/components/Quiz";
import { Ask } from "@/components/Ask";
import type { Block } from "@/lib/types";

export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = lessonById(id);
  return l ? { title: l.t, description: l.d } : {};
}

const LABEL: Record<string, string> = {
  differ: "Where elders differ",
  confuse: "Do not confuse these",
  pca: "A PCA distinctive",
  note: "Worth noting",
};

function Body({ b }: { b: Block }) {
  if (b.p) return <p>{b.p}</p>;
  if (b.q) return <blockquote>{b.q}<cite>{b.src}</cite></blockquote>;
  if (b.l) return <ul>{b.l.map((x, i) => <li key={i}>{x}</li>)}</ul>;
  if (b.n) {
    const kind = b.ty ?? "note";
    return <div className={`aside ${kind}`}><span className="k">{LABEL[kind]}</span><p>{b.n}</p></div>;
  }
  return null;
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = lessonById(id);
  if (!l) notFound();
  const unit = unitOf(l.u);
  const { prev, next } = neighbours(l.id);
  const canAsk = Boolean(process.env.ANTHROPIC_API_KEY);
  const plain = l.s.flatMap((s) => [s.h ?? "", ...s.b.map((b) => b.p ?? b.q ?? b.n ?? (b.l ?? []).join(" ") ?? "")]).join("\n");

  return (
    <article className="page">
      <div className="lesshead">
        <p className="eyebrow">Unit {l.u} · {unit?.t}</p>
        <LessonChrome id={l.id} unit={l.u} />
      </div>
      <h1>{l.t}</h1>
      <p className="dek">{l.d}</p>

      {l.s.map((sec, si) => (
        <section key={si}>
          {sec.h ? <h2 className="sect">{sec.h}</h2> : null}
          {sec.b.map((b, bi) => {
            const k = b.k ?? (b.q ? "ok" : b.c?.length ? "ok" : "int");
            return (
              <div className="lesson" key={bi}>
                <div className="prose block"><Body b={b} /></div>
                <div className="side">
                  <Cites list={b.c} />
                  {k === "int" ? <span className="flag int">Teaching summary</span> : null}
                  {k === "unv" ? <span className="flag unv">Not checked here</span> : null}
                </div>
              </div>
            );
          })}
        </section>
      ))}

      {l.sc?.length ? (
        <section>
          <h2 className="sect">Scripture in view</h2>
          <p className="lead">{l.sc.join("; ")}</p>
        </section>
      ) : null}

      {l.terms?.length ? (
        <section>
          <h2 className="sect">Terms from this lesson</h2>
          <div className="row" style={{ marginTop: 0, gap: 10 }}>
            {l.terms.map((t) => (
              <Link key={t} className="btn ghost tiny" href={`/reference?tab=terms&q=${encodeURIComponent(t)}`}>{t}</Link>
            ))}
          </div>
        </section>
      ) : null}

      {l.qz?.length ? (
        <section>
          <h2 className="sect">Check yourself</h2>
          <Quiz questions={l.qz} unit={l.u} />
        </section>
      ) : null}

      {canAsk ? (
        <section>
          <h2 className="sect">Ask about this lesson</h2>
          <Ask title={l.t} material={plain} />
        </section>
      ) : null}

      <nav className="row" style={{ marginTop: 44, justifyContent: "space-between" }}>
        <div className="row" style={{ margin: 0 }}>
          {prev ? <Link className="btn ghost" href={`/lessons/${prev.id}`}>← {prev.t}</Link> : <span />}
        </div>
        {next ? <Link className="btn" href={`/lessons/${next.id}`}>{next.t} →</Link> : null}
      </nav>
    </article>
  );
}
