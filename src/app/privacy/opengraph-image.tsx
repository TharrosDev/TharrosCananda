import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Undergraduate Publishing privacy";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Privacy",
    title: "Privacy.",
    description:
      "What the site collects now, editorial contact and the status of future submissions.",
    meta: [
      { label: "Status", value: "Policy" },
      { label: "Submissions", value: "Forthcoming" },
    ],
  });
}
