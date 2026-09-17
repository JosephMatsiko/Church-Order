import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Decently and in Order";

// Google Fonts serves a TTF when the request does not look like a modern browser,
// which is what ImageResponse needs. If the fetch fails the card still renders,
// in the runtime's default face.
async function font(family: string, weight: number) {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());
    const url = css.match(/src: url\((https:[^)]+)\) format\('(truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OG() {
  const [display, text] = await Promise.all([font("Fraunces", 600), font("Newsreader", 400)]);
  const fonts = [
    ...(display ? [{ name: "Display", data: display, weight: 600 as const, style: "normal" as const }] : []),
    ...(text ? [{ name: "Text", data: text, weight: 400 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F6F4EE", padding: "70px 76px" }}>
        <div style={{ display: "flex", fontSize: 21, letterSpacing: 5, textTransform: "uppercase", color: "#A8833C", fontFamily: "Text" }}>
          Presbyterian Church in America · Book of Church Order, 2026
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Display" }}>
          <div style={{ fontSize: 112, lineHeight: 1.0, color: "#14161A", letterSpacing: -4 }}>Decently</div>
          <div style={{ fontSize: 112, lineHeight: 1.0, color: "#14161A", letterSpacing: -4 }}>and in Order</div>
          <div style={{ fontSize: 34, color: "#5C6169", marginTop: 30, fontFamily: "Text" }}>
            A course in Presbyterian church government
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 40, fontSize: 23, color: "#5C6169", fontFamily: "Text" }}>
          <div style={{ display: "flex", width: 120, height: 2, background: "#A8833C" }} />
          <div style={{ display: "flex" }}>47 lessons</div>
          <div style={{ display: "flex" }}>13 units</div>
          <div style={{ display: "flex" }}>141 questions</div>
          <div style={{ display: "flex" }}>381 provisions cited</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
