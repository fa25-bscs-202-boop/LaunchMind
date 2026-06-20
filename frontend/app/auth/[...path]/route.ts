import { NextRequest, NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const backendUrl = new URL(`/auth/${path.join("/")}`, API_BASE_URL);
  backendUrl.search = request.nextUrl.search;

  return NextResponse.redirect(backendUrl);
}
