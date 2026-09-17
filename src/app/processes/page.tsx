import Link from "next/link";
import type { Metadata } from "next";
import { processes } from "@/lib/content";

export const metadata: Metadata = { title: "Processes" };

export default function ProcessesPage() {
  return (
    <div className="page">
      <h1>Processes</h1>
      <p className="lead">The sequences worth knowing cold, each step tied to the provision that requires it.</p>
      <div className="grid2">
        {processes.map((p) => (
          <Link key={p.id} href={`/processes/${p.id}`} className="card">
            <h3>{p.t}</h3>
            <p className="small">{p.d}</p>
            <p className="mono small" style={{ marginTop: 10 }}>{p.steps.length} steps</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
