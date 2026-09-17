// Optional. Works once ANTHROPIC_API_KEY is set in the Vercel project.
// Without the key the lesson pages never render the Ask box.
export const runtime = "edge";

const RULES = [
  "You are teaching Presbyterian church government as the Presbyterian Church in America holds it.",
  "Answer only from the material supplied. If the material does not settle the question, say so plainly and name where in the Book of Church Order to look.",
  "Never reproduce the wording of the Book of Church Order and never invent section numbers: cite only sections that appear in the material, in brackets.",
  "Answer in three or four sentences, in plain words, with no em dashes.",
].join(" ");

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: "No API key is configured for this deployment." }, { status: 503 });

  let body: { question?: string; title?: string; material?: string };
  try { body = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const question = (body.question ?? "").slice(0, 600).trim();
  const material = (body.material ?? "").slice(0, 20000);
  if (!question) return Response.json({ error: "Ask a question first." }, { status: 400 });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5",
      max_tokens: 700,
      system: RULES,
      messages: [{ role: "user", content: `LESSON: ${body.title ?? ""}\n\nQUESTION: ${question}\n\nMATERIAL:\n${material}` }],
    }),
  });

  if (!res.ok) return Response.json({ error: "The model did not answer. Try again." }, { status: 502 });
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const answer = (data.content ?? []).filter((c) => c.type === "text").map((c) => c.text ?? "").join("\n").trim();
  return Response.json({ answer });
}
