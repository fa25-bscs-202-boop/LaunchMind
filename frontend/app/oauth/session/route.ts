import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "launchmind_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/oauth/error?message=Authentication%20failed", request.url),
    );
  }

  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"));
  const successUrl = new URL("/oauth/success", request.url);
  successUrl.searchParams.set("token", token);
  successUrl.searchParams.set("next", nextPath);

  const response = NextResponse.redirect(successUrl);
  response.cookies.set(SESSION_COOKIE, token, {
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
  });

  return response;
}
