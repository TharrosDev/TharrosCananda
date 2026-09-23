import { publicationByReference } from "@/data/publications";

// Stable citation URL: the reference never changes even if a slug does.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const publication = publicationByReference((await params).reference);
  if (!publication) return new Response("Not found", { status: 404 });
  return new Response(null, {
    status: 308,
    headers: { Location: `/research/${publication.slug}` },
  });
}
