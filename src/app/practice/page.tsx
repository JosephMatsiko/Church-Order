import type { Metadata } from "next";
import { Practice } from "@/components/Practice";

export const metadata: Metadata = { title: "Practice" };

export default function PracticePage() {
  return (
    <div className="page">
      <h1>Practice</h1>
      <Practice />
    </div>
  );
}
