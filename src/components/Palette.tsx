"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchRow } from "@/lib/types";

export function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rows, setRows] = useState<SearchRow[]>([]);
  const [q, setQ] = useState("");
  const [at, setAt] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open || rows.length) return;
    fetch("/data/search.json").then((r) => r.json()).then(setRows).catch(() => {});
  }, [open, rows.length]);

  useEffect(() => { if (open) { setQ(""); setAt(0); setTimeout(() => input.current?.focus(), 30); } }, [open]);

  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows.filter((r) => r.kind === "Lesson").slice(0, 12);
    const starts: SearchRow[] = [], has: SearchRow[] = [];
    for (const r of rows) {
      const t = r.title.toLowerCase();
      if (t.startsWith(needle)) starts.push(r);
      else if (t.includes(needle) || r.text.includes(needle)) has.push(r);
      if (starts.length + has.length > 120) break;
    }
    return [...starts, ...has].slice(0, 24);
  }, [q, rows]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setAt((i) => Math.min(i + 1, hits.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setAt((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && hits[at]) { e.preventDefault(); onClose(); router.push(hits[at].href); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, hits, at, onClose, router]);

  if (!open) return null;
  return (
    <div className="scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="palette" role="dialog" aria-label="Search">
        <input ref={input} value={q} placeholder="Search lessons, sections, terms, numbers, cases" onChange={(e) => { setQ(e.target.value); setAt(0); }} />
        <ul>
          {hits.map((r, i) => (
            <li key={r.href + r.title} data-on={i === at} onMouseEnter={() => setAt(i)}>
              <Link href={r.href} onClick={onClose}>
                <span className="kind">{r.kind}</span>
                <span className="t">{r.title}</span>
                <span className="b">{r.blurb}</span>
              </Link>
            </li>
          ))}
          {!hits.length ? <li><span className="small" style={{ padding: "12px 14px", display: "block" }}>Nothing matches. Try a shorter word, or a section number such as 43-2.</span></li> : null}
        </ul>
        <footer><span>↑↓ to move</span><span>↵ to open</span><span>esc to close</span></footer>
      </div>
    </div>
  );
}
