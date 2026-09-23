import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada copyright and licence";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "light",
    eyebrow: "Copyright",
    title: "Copyright and licence.",
    description: "Tharros public research is open to reuse under CC BY 4.0.",
    meta: [
      { label: "Licence", value: "CC BY 4.0" },
      { label: "Scope", value: "Public research" },
    ],
  });
}
