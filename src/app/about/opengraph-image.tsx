import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "About Tharros Canada";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "About",
    title: "Strong undergraduate work deserves somewhere to go.",
    description:
      "An undergraduate research showcase, searchable database and professional home for authored work.",
    meta: [
      { label: "Focus", value: "Undergraduate work" },
      { label: "Connect", value: "Work · Authors · Portfolios" },
    ],
  });
}
