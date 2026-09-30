import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "About Tharros Undergraduate Publishing";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "About",
    title: "Strong undergraduate work deserves somewhere to go.",
    description:
      "Professional undergraduate publishing, initially for Canadian students. Preparing for launch.",
    meta: [
      { label: "Focus", value: "Undergraduate work" },
      { label: "Status", value: "Preparing for launch" },
    ],
  });
}
