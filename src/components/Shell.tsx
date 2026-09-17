"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icons";
import { Palette } from "./Palette";
import { CiteSheet } from "./CiteSheet";

const NAV = [
  { href: "/", label: "Course", icon: Icon.course, match: (p: string) => p === "/" || p.startsWith("/lessons") },
  { href: "/practice", label: "Practice", icon: Icon.practice, match: (p: string) => p.startsWith("/practice") || p.startsWith("/cases") },
  { href: "/processes", label: "Processes", icon: Icon.steps, match: (p: string) => p.startsWith("/processes") },
  { href: "/tools", label: "Tools", icon: Icon.tools, match: (p: string) => p.startsWith("/tools") },
  { href: "/reference", label: "Reference", icon: Icon.reference, match: (p: string) => p.startsWith("/reference") },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (localStorage.getItem("decently:theme") as "light" | "dark" | null);
    const next = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((v) => !v); }
      else if (e.key === "/" && !/input|textarea/i.test((e.target as HTMLElement)?.tagName ?? "")) { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("decently:theme", next); } catch {}
  };

  return (
    <div className="app">
      <aside className="rail">
        <Link href="/" className="wordmark">
          <span className="m1">Decently<br />and in Order</span>
          <span className="m2">Presbyterian polity</span>
        </Link>
        <button className="searchbtn" onClick={() => setOpen(true)}>
          <Icon.search style={{ width: 15, height: 15 }} />
          Search everything
          <span className="k">⌘K</span>
        </button>
        <nav className="railnav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} data-on={n.match(path)}>
              <n.icon />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="railfoot">
          <button className="btn ghost tiny" onClick={flip} style={{ width: "fit-content" }}>
            {theme === "dark" ? <Icon.sun style={{ width: 14, height: 14 }} /> : <Icon.moon style={{ width: 14, height: 14 }} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <p className="small" style={{ margin: 0, lineHeight: 1.45 }}>
            Checked against the 2026 Book of Church Order. Paraphrase only; no text reproduced.
          </p>
        </div>
      </aside>

      <div>
        <header className="topbar">
          <Link href="/" className="wordmark"><span className="m1" style={{ fontSize: 17 }}>Decently and in Order</span></Link>
          <button className="btn ghost tiny" style={{ marginLeft: "auto" }} onClick={() => setOpen(true)} aria-label="Search">
            <Icon.search style={{ width: 15, height: 15 }} />
          </button>
          <button className="btn ghost tiny" onClick={flip} aria-label="Theme">
            {theme === "dark" ? <Icon.sun style={{ width: 15, height: 15 }} /> : <Icon.moon style={{ width: 15, height: 15 }} />}
          </button>
        </header>
        <main id="main">{children}</main>
      </div>

      <nav className="tabbar">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} data-on={n.match(path)}>
            <n.icon />
            {n.label}
          </Link>
        ))}
      </nav>

      <Palette open={open} onClose={() => setOpen(false)} />
      <CiteSheet />
    </div>
  );
}
