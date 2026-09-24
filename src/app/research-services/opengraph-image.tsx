import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada research services";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "dark",
    eyebrow: "Commission research",
    title: "Research, scoped to your question.",
    description: "Custom and partner research, market assessments, buyer and partner research.",
    meta: [
      { label: "Lead service", value: "Custom & Partner Research" },
      { label: "Pricing", value: "Per case, in writing" },
    ],
  });
}
