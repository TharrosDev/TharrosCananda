import { publicationBySlug, publications } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;
export const generateStaticParams = () => publications.map((publication) => ({ slug: publication.slug }));

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const publication = publicationBySlug(slug);
  const area = publication ? researchAreas.find((item) => item.slug === publication.area) : undefined;

  return renderOgImage({
    tone: "light",
    eyebrow: "Research",
    title: publication?.title ?? "Tharros Canada research",
    description: publication?.summary,
    meta: [
      { label: "Format", value: publication?.type ?? "Report" },
      {
        label: "Published",
        value: publication
          ? new Date(publication.publishedAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", timeZone: "UTC" })
          : "—",
      },
      ...(area ? [{ label: "Expertise", value: area.name }] : []),
    ],
  });
}
