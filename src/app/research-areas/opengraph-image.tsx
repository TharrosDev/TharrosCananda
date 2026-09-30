import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada research areas";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Research areas",
    title: "Questions connecting Canada and Europe.",
    description: "Trade, security, energy, technology and the quality of public evidence.",
    meta: [{ label: "Scope", value: "Canada & Europe" }],
  });
}
