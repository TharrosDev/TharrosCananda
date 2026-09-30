import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Undergraduate Publishing publications";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Publications",
    title: "Work worth reading beyond the classroom.",
    description:
      "Explore the publication archive. Future undergraduate contributions will join the existing research collection after launch and editorial acceptance.",
    meta: [
      { label: "Access", value: "Publication pages & PDFs" },
      { label: "Submissions", value: "Forthcoming" },
    ],
  });
}
