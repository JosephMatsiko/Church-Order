import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Decently and in Order",
    short_name: "Polity",
    description: "A course in Presbyterian church government, worked through the Book of Church Order.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F4EE",
    theme_color: "#F6F4EE",
    orientation: "portrait",
    categories: ["education", "reference"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
