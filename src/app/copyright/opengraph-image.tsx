import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada copyright and licence";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Copyright",
    title: "Copyright and licence.",
    description:
      "Existing research keeps its stated licence. Author terms for future submissions are forthcoming.",
    meta: [
      { label: "Existing research", value: "CC BY 4.0" },
      { label: "Author terms", value: "Forthcoming" },
    ],
  });
}
