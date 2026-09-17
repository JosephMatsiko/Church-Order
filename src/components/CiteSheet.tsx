"use client";
import { useEffect, useState } from "react";
import { citeInfo } from "@/lib/cites";

export function CiteSheet() {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const open = (e: Event) => setCode((e as CustomEvent).detail as string);
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setCode(null); };
    window.addEventListener("cite:open", open);
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("cite:open", open); window.removeEventListener("keydown", key); };
  }, []);

  if (!code) return null;
  const info = citeInfo(code);
  return (
    <aside className="sheet" role="dialog" aria-label={info.label}>
      <button className="x" aria-label="Close" onClick={() => setCode(null)}>×</button>
      <h3>{info.label}</h3>
      <p>{info.title}</p>
      {info.note ? <p className="small">{info.note}</p> : null}
      <a className="btn tiny ghost" href={info.url} target="_blank" rel="noopener noreferrer">Open the source</a>
    </aside>
  );
}
