import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Tharros Canada Live Monitor";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    tone: "dark",
    eyebrow: "Live Monitor",
    title: "Follow the relationship as it moves.",
    description: "Recent Canada–Europe reporting, discovered through Currents and linked back to original publishers.",
    meta: [
      { label: "Source", value: "Currents" },
      { label: "Refresh", value: "Hourly" },
    ],
  });
}
