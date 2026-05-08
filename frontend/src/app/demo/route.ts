import { NextRequest, NextResponse } from "next/server";

const DEMO_MODE_COOKIE_NAME = "storemesh_demo_mode";
const DEMO_MODE_COOKIE_VALUE = "mock";

const resolveNextPath = (rawPath: string | null): string => {
  if (!rawPath || !rawPath.startsWith("/")) {
    return "/";
  }

  return rawPath;
};

export async function GET(request: NextRequest) {
  const nextPath = resolveNextPath(request.nextUrl.searchParams.get("next"));
  const redirectUrl = new URL(nextPath, request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(DEMO_MODE_COOKIE_NAME, DEMO_MODE_COOKIE_VALUE, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false
  });

  return response;
}
