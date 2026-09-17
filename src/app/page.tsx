import { alerts, counts, lessons, meta, units } from "@/lib/content";
import { UnitGrid } from "@/components/UnitGrid";
import { Continue } from "@/components/Continue";

export default function Home() {
  const summary = units.map((u) => ({
    ...u,
    lessons: lessons.filter((l) => l.u === u.n).map((l) => ({ id: l.id, t: l.t })),
  }));

  return (
    <div className="page">
      <header className="cover">
        <p className="eyebrow">Presbyterian Church in America · Book of Church Order, 2026</p>
        <h1>Decently<br />and in Order</h1>
        <p className="dek">{meta.sub}</p>
        <div className="ornament"><span /></div>
        <div className="figs">
          <div className="fig"><b>{counts.lessons}</b><span>Lessons</span></div>
          <div className="fig"><b>{counts.units}</b><span>Units</span></div>
          <div className="fig"><b>{counts.questions}</b><span>Questions</span></div>
          <div className="fig"><b>{counts.cited}</b><span>Provisions cited</span></div>
        </div>
      </header>

      <Continue titles={Object.fromEntries(lessons.map((l) => [l.id, l.t]))} />

      <section className="notice">
        <h2>Four things to settle before relying on this</h2>
        <p className="small">{meta.edition}</p>
        <div className="items">
          {alerts.map((a) => (
            <div key={a.h}>
              <h3>{a.h}</h3>
              <p>{a.p}</p>
              <p className="fix">{a.fix}</p>
            </div>
          ))}
        </div>
      </section>

      <h2 style={{ marginTop: 0 }}>The course</h2>
      <UnitGrid units={summary} />

      <section style={{ marginTop: 48 }}>
        <h2>How much of this was checked</h2>
        <div className="stats">
          <div className="stat ok"><b>{counts.ok}</b><span>Passages written from the 2026 text and cited to it</span></div>
          <div className="stat warn"><b>{counts.int}</b><span>Teaching summaries, marked as such</span></div>
          <div className="stat bad"><b>{counts.unv}</b><span>Passages resting on accounts not checked here</span></div>
          <div className="stat"><b>{counts.cited}</b><span>Distinct provisions cited</span></div>
        </div>
      </section>

      <footer className="site">
        <p>{meta.built} Every provision should be checked against the current Book of Church Order before it is relied on in a court of the church.</p>
      </footer>
    </div>
  );
}
