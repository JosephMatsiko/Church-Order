"use client";
import Link from "next/link";
import { useProgress } from "@/lib/store";
export function Continue({ titles }: { titles: Record<string, string> }) {
  const { progress, ready } = useProgress();
  if (!ready || !progress.last || !titles[progress.last]) return null;
  const doneCount = Object.keys(progress.done).length;
  return (
    <Link href={`/lessons/${progress.last}`} className="card" style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 36 }}>
      <div>
        <p className="small" style={{ margin: 0 }}>Continue where you stopped</p>
        <h3 style={{ margin: "4px 0 0" }}>{titles[progress.last]}</h3>
      </div>
      <span className="mono small" style={{ marginLeft: "auto" }}>{doneCount} studied</span>
    </Link>
  );
}
