"use client";
import { useCallback, useEffect, useState } from "react";

export type Progress = {
  done: Record<string, true>;
  best: Record<string, number>;
  box: Record<string, number>;
  acc: Record<string, { r: number; n: number }>;
  last?: string;
};
const EMPTY: Progress = { done: {}, best: {}, box: {}, acc: {} };
const KEY = "decently:v2";

let cache: Progress | null = null;
const listeners = new Set<(p: Progress) => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch { cache = { ...EMPTY }; }
  return cache!;
}
function commit(next: Progress) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  listeners.forEach((fn) => fn(next));
}

export function useProgress() {
  const [state, setState] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(read());
    setReady(true);
    const fn = (p: Progress) => setState({ ...p });
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => { commit(fn({ ...read() })); }, []);

  const toggleDone = useCallback((id: string) => update((p) => {
    const done = { ...p.done };
    if (done[id]) delete done[id]; else done[id] = true;
    return { ...p, done };
  }), [update]);

  const setLast = useCallback((id: string) => update((p) => ({ ...p, last: id })), [update]);

  const record = useCallback((unit: number, right: boolean) => update((p) => {
    const acc = { ...p.acc };
    const a = acc[unit] ?? { r: 0, n: 0 };
    acc[unit] = { r: a.r + (right ? 1 : 0), n: a.n + 1 };
    return { ...p, acc };
  }), [update]);

  const grade = useCallback((key: string, known: boolean) => update((p) => ({
    ...p, box: { ...p.box, [key]: known ? Math.min((p.box[key] ?? 0) + 1, 2) : 0 },
  })), [update]);

  const reset = useCallback((what: "acc" | "box" | "all") => update((p) =>
    what === "all" ? { ...EMPTY } : what === "acc" ? { ...p, acc: {} } : { ...p, box: {} }), [update]);

  return { progress: state, ready, toggleDone, setLast, record, grade, reset };
}
