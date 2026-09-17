import Link from "next/link";
import { notFound } from "next/navigation";
import { processes } from "@/lib/content";
import { Cites } from "@/components/Cite";

export function generateStaticParams() { return processes.map((p) => ({ id: p.id })); }

export default async function ProcessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = processes.find((x) => x.id === id);
  if (!p) notFound();
  return (
    <article className="page">
      <p className="eyebrow">Process</p>
      <h1>{p.t}</h1>
      <p className="dek">{p.d}</p>
      <ol className="steps">
        {p.steps.map((s, i) => (
          <li key={i}>
            <h3>{s.t}</h3>
            <p>{s.b}</p>
            <div className="side"><Cites list={s.c} /></div>
          </li>
        ))}
      </ol>
      <div className="row"><Link className="btn ghost" href="/processes">All processes</Link></div>
    </article>
  );
}
