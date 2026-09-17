"use client";
import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="page">
      <p className="eyebrow">Something failed</p>
      <h1>That page did not load</h1>
      <p className="dek">The error has not been sent anywhere. Try again, and if it persists, reload the app.</p>
      <div className="row">
        <button className="btn" onClick={reset}>Try again</button>
        <Link className="btn ghost" href="/">Back to the course</Link>
      </div>
    </div>
  );
}
