import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada: independent research across Canada and Europe";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "dark",
    eyebrow: "Tharros Canada",
    title: "Independent research across Canada and Europe.",
    description: "Trade · Defence · Energy & industry · Technology",
    meta: [
      { label: "Scope", value: "Canada & Europe" },
      { label: "Status", value: "Independent research" },
    ],
  });
}
