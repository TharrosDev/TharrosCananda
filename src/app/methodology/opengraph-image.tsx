import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada sources and methodology";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Sources & Methodology",
    title: "Sources and methodology.",
    description:
      "Sources are recorded with their period, retrieval date, interpretation and limitations.",
    meta: [
      { label: "Scope", value: "Canada & Europe" },
      { label: "Status", value: "Methodology" },
    ],
  });
}
