import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api";

export function GET() {
  return NextResponse.redirect(new URL("/auth/google/login", API_BASE_URL));
}
