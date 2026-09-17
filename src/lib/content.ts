import raw from "@/content/content.json";
import type { Alert, CaseStudy, Lesson, MapRow, Meta, Num, Process, Source, Term, Unit } from "./types";

type Store = {
  meta: Meta; units: Unit[]; alerts: Alert[]; sources: Source[];
  map: MapRow[]; numbers: Num[]; glossary: Term[];
  lessons: Lesson[]; cases: CaseStudy[]; processes: Process[];
  bcoPages: { sec: Record<string, number>; ch: Record<string, number>; pref: Record<string, number> };
};

const D = raw as unknown as Store;

export const meta = D.meta;
export const units = D.units;
export const alerts = D.alerts;
export const sources = D.sources;
export const bookMap = D.map;
export const numbers = D.numbers;
export const glossary = D.glossary;
export const lessons = D.lessons;
export const cases = D.cases;
export const processes = D.processes;
export const pages = D.bcoPages;

export const lessonById = (id: string) => lessons.find((l) => l.id === id);
export const lessonsInUnit = (n: number) => lessons.filter((l) => l.u === n);
export const unitOf = (n: number) => units.find((u) => u.n === n);
export const neighbours = (id: string) => {
  const i = lessons.findIndex((l) => l.id === id);
  return { prev: i > 0 ? lessons[i - 1] : null, next: i >= 0 && i < lessons.length - 1 ? lessons[i + 1] : null, index: i };
};

export const counts = (() => {
  let ok = 0, int = 0, unv = 0, questions = 0;
  const cited = new Set<string>();
  lessons.forEach((l) => {
    questions += (l.qz || []).length;
    (l.s || []).forEach((s) => (s.b || []).forEach((b) => {
      const k = b.k || (b.q ? "ok" : b.c && b.c.length ? "ok" : "int");
      if (k === "ok") ok++; else if (k === "unv") unv++; else int++;
      (b.c || []).forEach((c) => cited.add(c));
    }));
    (l.qz || []).forEach((q) => (q.c || []).forEach((c) => cited.add(c)));
  });
  return { ok, int, unv, questions, cited: cited.size, lessons: lessons.length, units: units.length };
})();
