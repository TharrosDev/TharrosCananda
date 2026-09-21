import { NextRequest, NextResponse } from "next/server";
import type { OfficialDatasetSearchResponse } from "@/types/official-data";

type CkanPackage = {
  id: string;
  title?: string;
  metadata_modified?: string;
  organization?: { title?: string };
  resources?: Array<{ format?: string }>;
};

type CkanResponse = {
  success?: boolean;
  result?: { results?: CkanPackage[] };
};

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "international trade").trim().slice(0, 100);
  const url = new URL("https://open.canada.ca/data/en/api/3/action/package_search");
  url.searchParams.set("q", query || "international trade");
  url.searchParams.set("rows", "5");

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 21600 },
    });
    if (!response.ok) throw new Error(`Open Government returned HTTP ${response.status}`);
    const payload = (await response.json()) as CkanResponse;
    if (!payload.success) throw new Error("Open Government API returned an unsuccessful response");

    const result: OfficialDatasetSearchResponse = {
      query,
      results: (payload.result?.results ?? []).map((item) => ({
        id: item.id,
        title: item.title || "Untitled Government of Canada dataset",
        publisher: item.organization?.title || "Government of Canada",
        modified: item.metadata_modified ?? null,
        url: `https://open.canada.ca/data/en/dataset/${item.id}`,
        formats: [...new Set((item.resources ?? []).map((resource) => resource.format).filter(Boolean) as string[])].slice(0, 5),
      })),
    };
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Open Government dataset search failed", error);
    return NextResponse.json({ query, results: [] } satisfies OfficialDatasetSearchResponse, { status: 502 });
  }
}
