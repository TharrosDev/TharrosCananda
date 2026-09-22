import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Commission research from Tharros Canada";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "dark",
    eyebrow: "Commission research",
    title: "Describe your research question.",
    description: "Tharros replies with a proposed scope, price and timeline.",
    meta: [
      { label: "Account", value: "Not required" },
      { label: "Call", value: "Not required" },
    ],
  });
}
