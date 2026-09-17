import type { Metadata } from "next";
import { Tools } from "@/components/Tools";
import { units } from "@/lib/content";

export const metadata: Metadata = { title: "Tools" };

export default function ToolsPage() {
  return (
    <div className="page">
      <h1>Tools</h1>
      <Tools units={units} />
    </div>
  );
}
