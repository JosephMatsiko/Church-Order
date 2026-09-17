"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Cites } from "./Cite";
import type { Unit } from "@/lib/types";

type Rule = { g: string; from: "act" | "notice"; days: number; w: string; c: string[]; before?: boolean; noDate?: boolean };

const DEADLINES: Rule[] = [
  { g: "Complaint", from: "act", days: 60, w: "Last day to file the complaint with the clerk of the court complained against", c: ["BCO 43-2"] },
  { g: "Complaint", from: "act", days: 10, w: "A complaint must be in at least this long before a called meeting for that meeting to consider it", c: ["BCO 43-2"], before: true },
  { g: "Complaint", from: "notice", days: 30, w: "Last day to carry a denied complaint to the higher court, filing with both clerks", c: ["BCO 43-3"] },
  { g: "Complaint", from: "notice", days: 30, w: "The lower court files the Record of the Case with the higher court", c: ["BCO 43-6"] },
  { g: "Appeal", from: "notice", days: 30, w: "Last day to file written notice of appeal with the reasons, with both clerks", c: ["BCO 42-4"] },
  { g: "Appeal", from: "notice", days: 30, w: "The lower court files the Record of the Case, counted from receipt of the notice", c: ["BCO 42-5"] },
  { g: "Dissent, protest, objection", from: "act", days: 30, w: "Last day to file with the clerk; at the Assembly, before it adjourns", c: ["BCO 45-1"] },
  { g: "Trial", from: "act", days: 10, w: "Earliest date of the second meeting, counted from the citation of the accused", c: ["BCO 32-3"] },
  { g: "Trial", from: "act", days: 14, w: "Earliest date of the trial, counted from the citation of parties and witnesses", c: ["BCO 32-3"] },
  { g: "Censure", from: "act", days: 30, w: "Earliest date a court may act on a motion to raise an indefinite suspension", c: ["BCO 36-8"] },
  { g: "Congregation", from: "act", days: 7, w: "Earliest date of an ordinary congregational meeting, counted from public notice", c: ["BCO 25-2"] },
  { g: "Congregation", from: "act", days: 30, w: "Earliest date of a meeting to elect officers", c: ["BCO 24-1"] },
  { g: "Congregation", from: "act", days: 30, w: "Earliest date of a meeting to vote on withdrawal from the denomination", c: ["BCO 25-11"] },
  { g: "Congregation", from: "act", days: 30, w: "Last day for the Session to act on a proper written request for a meeting", c: ["BCO 25-2"] },
  { g: "Congregation", from: "act", days: 60, w: "Last day for the Session to report on a request that an officer be released", c: ["BCO 24-7"] },
  { g: "Courts", from: "act", days: 10, w: "Earliest date of a special meeting of presbytery, counted from notice", c: ["BCO 13-12"] },
  { g: "Courts", from: "act", days: 20, w: "Earliest date of a special meeting of the General Assembly", c: ["BCO 14-3"] },
  { g: "Courts", from: "act", days: 60, w: "Earliest date presbytery may dissolve a church, counted from notice", c: ["BCO 13-10"] },
];

const fmt = (d: Date) => d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const gap = (d: Date) => {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const x = new Date(d); x.setHours(0, 0, 0, 0);
  const n = Math.round((+x - +t) / 86400000);
  return n === 0 ? "today" : n > 0 ? (n === 1 ? "tomorrow" : `in ${n} days`) : (n === -1 ? "yesterday" : `${Math.abs(n)} days ago`);
};
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function Tools({ units }: { units: Unit[] }) {
  const [tab, setTab] = useState<"deadlines" | "quorums" | "remedy">("deadlines");
  return (
    <>
      <div className="seg" style={{ marginBottom: 26 }}>
        {(["deadlines", "quorums", "remedy"] as const).map((k) => (
          <button key={k} data-on={tab === k} onClick={() => setTab(k)}>
            {k === "deadlines" ? "Deadlines" : k === "quorums" ? "Quorums" : "Which remedy"}
          </button>
        ))}
      </div>
      {tab === "deadlines" ? <Deadlines /> : tab === "quorums" ? <Quorums /> : <Remedy units={units} />}
    </>
  );
}

function Deadlines() {
  const today = iso(new Date());
  const [act, setAct] = useState(today);
  const [notice, setNotice] = useState(today);
  const groups = useMemo(() => [...new Set(DEADLINES.map((r) => r.g))], []);
  const a = new Date(act + "T00:00:00"), n = new Date(notice + "T00:00:00");

  return (
    <>
      <p className="lead">Enter the date a court acted, and the date you were notified if they differ. Every period in the Rules of Discipline is then counted out. Treat the result as the day to work back from, not as legal advice.</p>
      <div className="row">
        <label className="field"><span>Date of the act, meeting or citation</span><input type="date" value={act} onChange={(e) => setAct(e.target.value)} /></label>
        <label className="field"><span>Date you were notified</span><input type="date" value={notice} onChange={(e) => setNotice(e.target.value)} /></label>
      </div>
      {groups.map((g) => (
        <section key={g}>
          <h2>{g}</h2>
          <div className="tablewrap">
            <table>
              <thead><tr><th>What the period governs</th><th>Period</th><th>Date</th><th>Where</th></tr></thead>
              <tbody>
                {DEADLINES.filter((r) => r.g === g).map((r, i) => {
                  const base = r.from === "notice" ? n : a;
                  const d = addDays(base, r.before ? -r.days : r.days);
                  return (
                    <tr key={i}>
                      <td>{r.w}</td>
                      <td className="n">{r.days} days</td>
                      <td>{fmt(d)} <span className="small">({gap(d)})</span></td>
                      <td><Cites list={r.c} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}

function Quorums() {
  const [re, setRe] = useState(4);
  const [pastor, setPastor] = useState(true);
  const [com, setCom] = useState(350);
  const [res, setRes] = useState(300);
  const [present, setPresent] = useState(60);

  const session = pastor
    ? re >= 4 ? "The pastor and two ruling elders" : "The pastor and one ruling elder"
    : re >= 5 ? "Three ruling elders" : re >= 2 ? "Two ruling elders" : re === 1
      ? "No Session. One ruling elder is not a court: he gives oversight, represents the church at presbytery, grants letters, and reports matters needing a court"
      : "No Session, and no ruling elder. Presbytery must be told";
  const cq = res <= 100 ? Math.ceil(res / 4) : Math.ceil(res / 6);
  const [pet, petWhat] =
    com <= 100 ? [Math.ceil(com / 4), "a fourth"] :
    com <= 300 ? [Math.ceil(com / 5), "a fifth"] :
    com <= 500 ? [Math.ceil(com / 6), "a sixth"] :
    com <= 700 ? [Math.ceil(com / 7), "a seventh"] : [100, "one hundred members"];
  const reps = com <= 0 ? 0 : 2 + (com > 350 ? Math.ceil((com - 350) / 500) : 0);

  const rows: [string, string, string[]][] = [
    ["Session quorum", session, ["BCO 12-1"]],
    ["Congregational meeting quorum", `${cq} resident communing members, ${res <= 100 ? "a fourth" : "a sixth"} of ${res}`, ["BCO 25-3"]],
    ["Signatures that force the Session to call a meeting", `${pet} communing members, that is ${petWhat}`, ["BCO 25-2"]],
    ["Signatures that force a meeting to elect additional officers", `${Math.ceil(com / 4)} of those entitled to vote, a fourth`, ["BCO 24-1"]],
    ["Ruling elders this church may send to presbytery and the Assembly", `${reps}`, ["BCO 13-1", "BCO 14-2"]],
    [`Simple majority of ${present} present and voting`, `${Math.floor(present / 2) + 1} votes`, ["BCO 20-4", "BCO 24-3"]],
    ["Two-thirds", `${Math.ceil((present * 2) / 3)} votes`, ["BCO 31-10", "BCO 34-10"]],
    ["Three-fourths", `${Math.ceil((present * 3) / 4)} votes`, ["BCO 21-4", "BCO 34-8"]],
    ["Four-fifths", `${Math.ceil((present * 4) / 5)} votes`, ["BCO 23-1"]],
  ];

  return (
    <>
      <p className="lead">Enter what a church actually has, and read off the quorums, the petition thresholds, the representation it may send, and what a given majority comes to in votes.</p>
      <div className="row">
        <label className="field"><span>Ruling elders</span><input type="number" min={0} value={re} onChange={(e) => setRe(+e.target.value)} style={{ width: "7rem" }} /></label>
        <label className="field"><span>Pastor in place</span>
          <select value={pastor ? "1" : "0"} onChange={(e) => setPastor(e.target.value === "1")}><option value="1">Yes</option><option value="0">No</option></select>
        </label>
        <label className="field"><span>Communing members</span><input type="number" min={0} value={com} onChange={(e) => setCom(+e.target.value)} style={{ width: "8rem" }} /></label>
        <label className="field"><span>Resident communing</span><input type="number" min={0} value={res} onChange={(e) => setRes(+e.target.value)} style={{ width: "8rem" }} /></label>
        <label className="field"><span>Present and voting</span><input type="number" min={0} value={present} onChange={(e) => setPresent(+e.target.value)} style={{ width: "8rem" }} /></label>
      </div>
      <div className="tablewrap">
        <table>
          <thead><tr><th>Question</th><th>Answer</th><th>Where</th></tr></thead>
          <tbody>{rows.map(([q, a, c], i) => <tr key={i}><td>{q}</td><td className="n">{a}</td><td><Cites list={c} /></td></tr>)}</tbody>
        </table>
      </div>
      <p className="small">Any Session or presbytery may fix a larger quorum for itself by majority vote, and blanks and abstentions are excluded when a majority of votes cast is counted.</p>
    </>
  );
}

type Node = { q: string; o: { t: string; go?: string; end?: string }[] };
const TREE: Record<string, Node> = {
  start: { q: "What has happened?", o: [
    { t: "A court tried a case and rendered judgment against me", go: "judg" },
    { t: "A court did something, or failed to do something, that I believe was wrong", go: "act" },
    { t: "I sit on a court that cannot settle a matter before it", go: "ref" },
    { t: "I was in the minority and want my position on the record", go: "record" },
    { t: "I am on a higher court and something below looks irregular", go: "rev" },
  ] },
  judg: { q: "Were you the party against whom the decision went?", o: [
    { t: "Yes", end: "appeal" },
    { t: "No, but I was censured on my own confession without a trial", end: "appeal" },
    { t: "No, I simply disagree with what the court did", go: "act" },
  ] },
  act: { q: "Has judicial process already begun in that matter?", o: [
    { t: "No", end: "complaint" },
    { t: "Yes, process has commenced", end: "held" },
  ] },
  ref: { q: "What does the court need?", o: [
    { t: "Advice, or a ruling on a difficult or divisive question", end: "reference" },
    { t: "Someone else to try the case, or extra elders to sit with us", end: "reference41" },
  ] },
  record: { q: "Did you have the right to vote on the question?", o: [
    { t: "Yes", end: "dissent" },
    { t: "No, because it was an appeal or a complaint", end: "objection" },
  ] },
  rev: { q: "How did it come to your notice?", o: [
    { t: "Through the records sent up for annual review", end: "review" },
    { t: "Through a credible report of delinquency or unconstitutional proceedings", end: "cite405" },
  ] },
};
const ENDS: Record<string, { t: string; b: string; s: string[]; c: string[]; href: string }> = {
  appeal: { t: "Appeal", b: "An appeal transfers a judicial case, after judgment, to the next higher court, and is open only to the party against whom the decision was rendered.", s: ["Give notice, which may be done before the court adjourns.", "File written notice with the reasons with both clerks within thirty days of notification.", "The lower court sends up the Record of the Case within thirty days.", "The judgment is suspended while the appeal is pending, unless the court restricts you by a two-thirds vote, which is never a censure."], c: ["BCO 42-1", "BCO 42-2", "BCO 42-4", "BCO 42-6"], href: "/processes/p7" },
  complaint: { t: "Complaint", b: "A complaint is a written representation against an act or decision of a court, open to any communing member in good standing who is subject to that court.", s: ["File with the clerk of that court within sixty days following the meeting.", "It is considered at the next stated meeting, or a called meeting if filed at least ten days in advance.", "If denied, file notice with both clerks within thirty days of notification.", "The act is not suspended unless a third of those present when it was taken vote to suspend it."], c: ["BCO 43-1", "BCO 43-2", "BCO 43-3", "BCO 43-4"], href: "/processes/p6" },
  held: { t: "Complaint, held until the case ends", b: "No complaint is allowable in a judicial case after process has commenced. One filed then waits, and is adjudicated after the case and any appeal are finished.", s: ["File as usual, within sixty days following the meeting.", "During the process, raise objections as the trial rules allow.", "Expect the complaint to be taken up after final disposition."], c: ["BCO 43-1"], href: "/lessons/remedies" },
  reference: { t: "Reference for advice", b: "A written application from a lower court to a higher one for advice on a matter still pending below.", s: ["Adopt the reference in the lower court and put it in writing.", "Send it ordinarily to the next higher court.", "The higher court should ordinarily give the advice asked."], c: ["BCO 41-1", "BCO 41-2", "BCO 41-5"], href: "/lessons/remedies" },
  reference41: { t: "Reference asking for disposition", b: "A lower court may ask the higher court to take original jurisdiction of a judicial case, or to supply additional elders to sit with it as judges. The second option was added in 2026.", s: ["State which of the two you are asking for.", "Supplied elders have all the rights and responsibilities of judges while they serve.", "Either party may still challenge a member for cause."], c: ["BCO 41-3", "BCO 32-16"], href: "/lessons/remedies" },
  dissent: { t: "Dissent or protest", b: "A dissent records that a minority's opinion differs from the court's action. A protest is more solemn, bearing testimony against an action deemed improper or erroneous.", s: ["File with the clerk within thirty days following the meeting, or before the Assembly adjourns.", "Keep the language temperate and respectful.", "The court may record an answer beside it."], c: ["BCO 45-1", "BCO 45-2", "BCO 45-3"], href: "/lessons/minority" },
  objection: { t: "Objection", b: "The declaration of a member who had no right to vote on an appeal or complaint but differs from the decision.", s: ["File with the clerk within thirty days.", "Keep it temperate and respectful.", "If you want the act changed rather than recorded, the instrument is a complaint."], c: ["BCO 45-4", "BCO 43-2"], href: "/lessons/minority" },
  review: { t: "Review and control", b: "Every court above the Session reviews the records below at least once a year, on four questions.", s: ["Record approval, disapproval or correction.", "Require review and correction below where a serious irregularity appears.", "No judgment in a judicial case may be reversed this way."], c: ["BCO 40-1", "BCO 40-2", "BCO 40-3"], href: "/lessons/review" },
  cite405: { t: "Citation of the lower court", b: "On a credible report of important delinquency or grossly unconstitutional proceedings, the first step is to cite that court to appear and show what it has done or failed to do.", s: ["Cite the court to appear by representative or in writing.", "Then reverse or redress in other than judicial cases, censure the court, remit with an injunction, or stay proceedings."], c: ["BCO 40-4", "BCO 40-5"], href: "/lessons/review" },
};

function Remedy({ units }: { units: Unit[] }) {
  void units;
  const [at, setAt] = useState("start");
  const [trail, setTrail] = useState<string[]>([]);
  const end = ENDS[at];

  return (
    <>
      <p className="lead">Four routes run upward from a lower court, and the wrong choice loses time the filing periods do not give back. Answer two or three questions.</p>
      {trail.length ? <p className="small">{trail.join(" › ")}</p> : null}
      {end ? (
        <div className="panel" style={{ maxWidth: "36rem" }}>
          <h3>{end.t}</h3>
          <p className="prose" style={{ margin: "8px 0 14px" }}>{end.b}</p>
          <ol className="prose" style={{ paddingLeft: "1.2em" }}>{end.s.map((s, i) => <li key={i}>{s}</li>)}</ol>
          <div className="side" style={{ marginTop: 10 }}><Cites list={end.c} /></div>
          <div className="row">
            <Link className="btn" href={end.href}>Open the full treatment</Link>
            <button className="btn ghost" onClick={() => { setAt("start"); setTrail([]); }}>Start again</button>
          </div>
        </div>
      ) : (
        <div className="panel" style={{ maxWidth: "36rem" }}>
          <p className="stem">{TREE[at].q}</p>
          {TREE[at].o.map((o, i) => (
            <button key={i} className="opt" onClick={() => { setTrail([...trail, o.t]); setAt(o.end ?? o.go ?? "start"); }}>{o.t}</button>
          ))}
          {trail.length ? <button className="btn ghost tiny" style={{ marginTop: 12 }} onClick={() => { setAt("start"); setTrail([]); }}>Start again</button> : null}
        </div>
      )}
    </>
  );
}
