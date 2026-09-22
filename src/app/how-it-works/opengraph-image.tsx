import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "How commissioned research works at Tharros Canada";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "How It Works",
    title: "How commissioned research works.",
    description: "Scope, price and timing are agreed in writing before work begins.",
    meta: [
      { label: "Account", value: "Not required" },
      { label: "Status", value: "Process" },
    ],
  });
}
