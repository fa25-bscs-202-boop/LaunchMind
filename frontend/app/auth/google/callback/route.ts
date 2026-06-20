import { NextRequest, NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api";

export function GET(request: NextRequest) {
  const callbackUrl = new URL("/auth/google/callback", API_BASE_URL);
  callbackUrl.search = request.nextUrl.search;

  return NextResponse.redirect(callbackUrl);
}
