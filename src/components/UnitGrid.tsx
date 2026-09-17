"use client";
import Link from "next/link";
import { useProgress } from "@/lib/store";
import { Ring } from "./Ring";

type U = { n: number; t: string; d: string; lessons: { id: string; t: string }[] };

export function UnitGrid({ units }: { units: U[] }) {
  const { progress, ready } = useProgress();
  return (
    <div className="units">
      {units.map((u) => {
        const done = u.lessons.filter((l) => progress.done[l.id]).length;
        return (
          <section className="unit" key={u.n}>
            <header>
              <div>
                <span className="n">Unit {String(u.n).padStart(2, "0")}</span>
                <h3>{u.t}</h3>
              </div>
              {ready && done > 0 ? <Ring done={done} total={u.lessons.length} /> : null}
            </header>
            <p>{u.d}</p>
            <ol>
              {u.lessons.map((l, i) => (
                <li key={l.id}>
                  <Link href={`/lessons/${l.id}`}>
                    <span className="num">{u.n}.{i + 1}</span>
                    <span>{l.t}</span>
                    {progress.done[l.id] ? <span className="tick">✓</span> : null}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
