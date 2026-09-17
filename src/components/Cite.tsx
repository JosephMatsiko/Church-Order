"use client";
import { citeInfo } from "@/lib/cites";

export function Cite({ code }: { code: string }) {
  const info = citeInfo(code);
  return (
    <button
      className="cite"
      title={info.title}
      onClick={() => window.dispatchEvent(new CustomEvent("cite:open", { detail: code }))}
    >
      {info.label}
    </button>
  );
}

export function Cites({ list }: { list?: string[] }) {
  if (!list || !list.length) return null;
  return <>{list.map((c) => <Cite key={c} code={c} />)}</>;
}
