import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";
import { publishing } from "@/data/publishing";

export const alt = `${publishing.name}: ${publishing.slogan}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "dark",
    eyebrow: "Tharros Canada",
    title: publishing.slogan,
    description:
      "An undergraduate research showcase, searchable database and professional home for authored work.",
    meta: [
      { label: "For", value: "Canadian undergraduate students" },
      { label: "Explore", value: "Research · Author profiles" },
    ],
  });
}
