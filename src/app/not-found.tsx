import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <p className="eyebrow">Not found</p>
      <h1>No such page</h1>
      <p className="dek">That address does not match a lesson, a case or a process in this course.</p>
      <div className="row"><Link className="btn" href="/">Back to the course</Link></div>
    </div>
  );
}
