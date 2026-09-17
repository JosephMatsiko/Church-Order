export type Cite = string;

export type Block = {
  p?: string; q?: string; src?: string; n?: string; l?: string[];
  ty?: "differ" | "confuse" | "pca" | "note";
  c?: Cite[]; k?: "ok" | "int" | "unv";
};
export type Section = { h?: string; b: Block[] };
export type Question = { q: string; o: string[]; a: number; w: string; c?: Cite[]; lesson?: string; title?: string; unit?: number };
export type Lesson = { id: string; u: number; t: string; d: string; s: Section[]; sc?: string[]; terms?: string[]; qz?: Question[] };
export type Unit = { n: number; t: string; d: string };
export type Term = { t: string; d: string; c?: Cite[] };
export type Num = { g: string; w: string; v: string; c?: Cite[] };
export type MapRow = { part: string; ch: number | string; t: string; s: string; k?: string[] };
export type CaseStudy = { id: string; t: string; u: number; sc: string; q: { q: string; a: string; c?: Cite[] }[] };
export type Process = { id: string; t: string; u: number; d: string; steps: { t: string; b: string; c?: Cite[] }[] };
export type Alert = { h: string; p: string; fix: string };
export type Source = { t: string; pub: string; url: string; use: string };
export type Meta = { title: string; sub: string; edition: string; built: string; bcoPdf: string; wcfPdf: string; lcPdf: string; bcoHome: string };
export type Card = { key: string; front: string; back: string; cites: Cite[]; kind: "term" | "number" };
export type SearchRow = { kind: string; title: string; blurb: string; href: string; text: string };
