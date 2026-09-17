import type { Metadata, Viewport } from "next";
import { Fraunces, Newsreader, Geist, Geist_Mono } from "next/font/google";
import { Shell } from "@/components/Shell";
import { ServiceWorker } from "@/components/ServiceWorker";
import { meta } from "@/lib/content";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", axes: ["SOFT", "WONK", "opsz"], display: "swap" });
const read = Newsreader({ subsets: ["latin"], variable: "--font-read", style: ["normal", "italic"], display: "swap" });
const ui = Geist({ subsets: ["latin"], variable: "--font-ui", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// Canonical origin for the Open Graph and Twitter card images. Vercel sets
// VERCEL_PROJECT_PRODUCTION_URL to the project's production domain (the custom
// domain once one is attached, otherwise the .vercel.app one), so this tracks
// the real origin without a hardcoded guess. SITE_URL overrides it for local
// previews; the literal is only a last resort when neither is set.
const SITE =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://church-order.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: meta.title, template: `%s · ${meta.title}` },
  description: meta.sub,
  applicationName: "Decently and in Order",
  appleWebApp: { capable: true, title: "Polity", statusBarStyle: "default" },
  icons: { icon: "/icon.svg", apple: "/icons/apple-touch-icon.png" },
  openGraph: { title: meta.title, description: meta.sub, type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F4EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0B0D" },
  ],
};

const NO_FLASH = `try{var t=localStorage.getItem("decently:theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${read.variable} ${ui.variable} ${mono.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: NO_FLASH }} /></head>
      <body>
        <a href="#main" className="skip">Skip to the content</a>
        <Shell>{children}</Shell>
        <ServiceWorker />
      </body>
    </html>
  );
}
