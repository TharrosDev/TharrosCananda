import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada: independent Canada–Europe research";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "dark",
    eyebrow: "Tharros Canada",
    title: "Independent Canada–Europe research.",
    description: "Trade · Defence · Energy & industry · Technology",
    meta: [
      { label: "Scope", value: "Canada–Europe" },
      { label: "Status", value: "Independent research" },
    ],
  });
}
