import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada Research";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Research",
    title: "Independent research, published as it is finished.",
    description:
      "Trade, defence, energy, industry, technology and public data across Canada and Europe.",
    meta: [
      { label: "Scope", value: "Canada & Europe" },
      { label: "Format", value: "Reports & data notes" },
    ],
  });
}
