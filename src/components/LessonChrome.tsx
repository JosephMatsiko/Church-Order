"use client";
import { useEffect, useState } from "react";
import { useProgress } from "@/lib/store";

export function LessonChrome({ id }: { id: string; unit: number }) {
  const { progress, ready, toggleDone, setLast } = useProgress();
  const [pct, setPct] = useState(0);

  useEffect(() => { setLast(id); }, [id, setLast]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const done = ready && progress.done[id];
  return (
    <>
      <div className="readbar" style={{ width: `${(pct * 100).toFixed(1)}%` }} />
      <button className={`btn tiny ${done ? "" : "ghost"} spacer`} onClick={() => toggleDone(id)}>
        {done ? "✓ Studied" : "Mark studied"}
      </button>
    </>
  );
}
