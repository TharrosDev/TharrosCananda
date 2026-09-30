import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";
import { publishing } from "@/data/publishing";

export const alt = `${publishing.name}: ${publishing.slogan}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "dark",
    eyebrow: "Undergraduate publishing",
    title: publishing.slogan,
    description: "Turn your strongest undergraduate work into a professional publication.",
    meta: [
      { label: "For", value: "Canadian undergraduate students" },
      { label: "Status", value: "Preparing for launch" },
    ],
  });
}
