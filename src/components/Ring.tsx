export function Ring({ done, total }: { done: number; total: number }) {
  const r = 14, c = 2 * Math.PI * r;
  const pct = total ? done / total : 0;
  return (
    <svg className="ring" viewBox="0 0 34 34" aria-label={`${done} of ${total} studied`}>
      <circle className="bg" cx="17" cy="17" r={r} />
      <circle className="fg" cx="17" cy="17" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 17 17)" />
      <text x="17" y="20.5" textAnchor="middle">{done}</text>
    </svg>
  );
}
