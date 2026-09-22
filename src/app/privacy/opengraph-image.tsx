import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada privacy";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Privacy",
    title: "Privacy.",
    description: "What the site collects and how submitted information is used.",
    meta: [
      { label: "Status", value: "Policy" },
      { label: "Scope", value: "Research request form" },
    ],
  });
}
