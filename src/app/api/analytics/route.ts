import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/admin-data";
import { guardAdminApi } from "@/lib/auth-guard";
import type { AnalyticsRange } from "@/types";

export async function GET(request: Request) {
  const guard = await guardAdminApi();
  if (guard.error) return guard.error;

  const rangeParam = new URL(request.url).searchParams.get("range");
  const range: AnalyticsRange =
    rangeParam === "7d" || rangeParam === "30d" ? rangeParam : "12h";

  try {
    const data = await getAnalytics(range);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
