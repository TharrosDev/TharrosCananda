import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada Research Archive";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Research Archive",
    title: "Independent research, published as it is finished.",
    description: "Trade, defence, energy, industry and technology across Canada and Europe.",
    meta: [
      { label: "Scope", value: "Canada–Europe" },
      { label: "Status", value: "Growing archive" },
    ],
  });
}
