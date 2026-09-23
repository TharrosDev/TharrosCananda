import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "About Tharros Canada";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "About",
    title: "Independent research focused on Canada and Europe.",
    description:
      "Tharros studies the trade, policy, industry and organizations connecting both markets.",
    meta: [
      { label: "Scope", value: "Canada–Europe" },
      { label: "Status", value: "Independent" },
    ],
  });
}
