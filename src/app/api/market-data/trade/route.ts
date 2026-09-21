import { NextRequest, NextResponse } from "next/server";
import { getCetaTradeSeries } from "@/lib/statcan";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const flow = request.nextUrl.searchParams.get("flow");
  const commodity = request.nextUrl.searchParams.get("commodity");

  try {
    const data = await getCetaTradeSeries({ flow, commodity });
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Statistics Canada trade integration failed", error);
    return NextResponse.json(
      {
        error: "Official Statistics Canada data is temporarily unavailable. No substitute or synthetic values are being shown.",
      },
      { status: 502 },
    );
  }
}
