import type { Metadata } from "next";
import { Suspense } from "react";
import { bookMap, glossary, meta, numbers, sources, counts } from "@/lib/content";
import { Reference } from "@/components/Reference";

export const metadata: Metadata = { title: "Reference" };

export default function ReferencePage() {
  return (
    <div className="page">
      <h1>Reference</h1>
      <Suspense fallback={<p className="small">Loading.</p>}>
        <Reference map={bookMap} terms={glossary} numbers={numbers} sources={sources} meta={meta} counts={counts} />
      </Suspense>
    </div>
  );
}
