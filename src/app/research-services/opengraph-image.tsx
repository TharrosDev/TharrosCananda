import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada commissioned research services";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "dark",
    eyebrow: "Commissioned Research",
    title: "Commissioned Canada–Europe research.",
    description: "Defined services and custom research, scoped in writing.",
    meta: [
      { label: "Flagship", value: "Canadian Buyer Intelligence" },
      { label: "Pricing", value: "Confirmed in writing" },
    ],
  });
}
