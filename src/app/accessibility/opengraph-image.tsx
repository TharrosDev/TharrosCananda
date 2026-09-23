import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada accessibility";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Accessibility",
    title: "Accessibility.",
    description:
      "How the site supports keyboard navigation, assistive technology and reduced motion.",
    meta: [
      { label: "Target", value: "WCAG 2.2 AA" },
      { label: "Status", value: "Policy" },
    ],
  });
}
