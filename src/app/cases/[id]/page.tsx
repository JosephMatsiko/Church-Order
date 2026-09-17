import Link from "next/link";
import { notFound } from "next/navigation";
import { cases } from "@/lib/content";
import { CaseAnswers } from "@/components/CaseAnswers";

export function generateStaticParams() { return cases.map((c) => ({ id: c.id })); }

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = cases.find((x) => x.id === id);
  if (!c) notFound();
  return (
    <article className="page">
      <p className="eyebrow">Invented case · names are placeholders</p>
      <h1>{c.t}</h1>
      <div className="panel prose" style={{ marginBottom: 28 }}><p style={{ margin: 0 }}>{c.sc}</p></div>
      <CaseAnswers questions={c.q} />
      <div className="row"><Link className="btn ghost" href="/practice">Back to the cases</Link></div>
    </article>
  );
}
