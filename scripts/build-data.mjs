// Emits the static JSON the client components fetch. Runs before every build.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const D = JSON.parse(fs.readFileSync(path.join(root, "src/content/content.json"), "utf8"));
const out = path.join(root, "public/data");
fs.mkdirSync(out, { recursive: true });

const write = (name, value) => {
  fs.writeFileSync(path.join(out, name), JSON.stringify(value));
  return `${name} ${(fs.statSync(path.join(out, name)).size / 1024).toFixed(0)} KB`;
};

const quiz = [];
D.lessons.forEach((l) => (l.qz || []).forEach((q) => quiz.push({ ...q, lesson: l.id, title: l.t, unit: l.u })));

const cards = [];
D.glossary.forEach((g) => cards.push({ key: `t:${g.t}`, front: g.t, back: g.d, cites: g.c || [], kind: "term" }));
D.numbers.forEach((n, i) => cards.push({ key: `n:${i}`, front: `${n.w}?`, back: n.v, cites: n.c || [], kind: "number" }));

const index = [];
D.lessons.forEach((l) => {
  const body = (l.s || []).flatMap((s) => (s.b || []).map((b) => b.p || b.q || b.n || (b.l || []).join(" ") || "")).join(" ");
  index.push({ kind: "Lesson", title: l.t, blurb: l.d, href: `/lessons/${l.id}`, text: `${l.t} ${l.d} ${body}`.toLowerCase().slice(0, 4000) });
});
D.glossary.forEach((g) => index.push({ kind: "Term", title: g.t, blurb: g.d, href: `/reference?tab=terms&q=${encodeURIComponent(g.t)}`, text: `${g.t} ${g.d}`.toLowerCase() }));
D.numbers.forEach((n) => index.push({ kind: "Number", title: `${n.g}: ${n.w}`, blurb: n.v, href: `/reference?tab=numbers`, text: `${n.g} ${n.w} ${n.v}`.toLowerCase() }));
D.map.forEach((m) => index.push({ kind: "Chapter", title: typeof m.ch === "number" ? `Chapter ${m.ch}. ${m.t}` : `${m.ch} ${m.t}`, blurb: m.s, href: `/reference?tab=book&q=${encodeURIComponent(String(m.ch))}`, text: `${m.ch} ${m.t} ${m.s}`.toLowerCase() }));
D.cases.forEach((c) => index.push({ kind: "Case", title: c.t, blurb: c.sc.slice(0, 120), href: `/cases/${c.id}`, text: `${c.t} ${c.sc}`.toLowerCase() }));
D.processes.forEach((p) => index.push({ kind: "Process", title: p.t, blurb: p.d, href: `/processes/${p.id}`, text: `${p.t} ${p.d} ${p.steps.map((s) => s.t + " " + s.b).join(" ")}`.toLowerCase() }));

console.log([
  write("quiz.json", quiz),
  write("cards.json", cards),
  write("cases.json", D.cases),
  write("processes.json", D.processes),
  write("numbers.json", D.numbers),
  write("terms.json", D.glossary),
  write("map.json", D.map),
  write("search.json", index),
  write("meta.json", { meta: D.meta, units: D.units, alerts: D.alerts, sources: D.sources, counts: { lessons: D.lessons.length, questions: quiz.length, cards: cards.length } }),
  write("pages.json", D.bcoPages),
].join("\n"));
