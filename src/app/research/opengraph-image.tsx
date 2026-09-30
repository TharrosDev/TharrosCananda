import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada research database";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Research database",
    title: "Work worth reading beyond the classroom.",
    description:
      "Find published work, explore its evidence and authors, and use citations, original PDFs and stable links to reference it.",
    meta: [
      { label: "Access", value: "Publication pages & PDFs" },
      { label: "Submissions", value: "Forthcoming" },
    ],
  });
}
