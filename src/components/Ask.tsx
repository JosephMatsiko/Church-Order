"use client";
import { useState } from "react";

export function Ask({ title, material }: { title: string; material: string }) {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  const ask = async () => {
    const question = q.trim();
    if (!question || busy) return;
    setBusy(true);
    setAnswer("Thinking.");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, title, material }),
      });
      const data = await res.json();
      setAnswer(res.ok ? data.answer : data.error ?? "That did not work. Try again.");
    } catch {
      setAnswer("That did not work. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: "36rem" }}>
      <div className="row" style={{ marginTop: 0 }}>
        <input style={{ flex: 1, minWidth: "16rem" }} value={q} placeholder="A question about this material"
          onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ask(); }} />
        <button className="btn" onClick={ask} disabled={busy}>Ask</button>
      </div>
      {answer ? <div className="prose" style={{ marginTop: 6 }}><p>{answer}</p></div> : null}
    </div>
  );
}
