import { NextResponse } from "next/server";

import {
  COOKIE,
  MAX_AGE_SEC,
  passwordMatches,
  treasurerCookieValue,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  if (!body?.password || !passwordMatches(body.password)) {
    return NextResponse.json(
      { error: "That password did not match." },
      { status: 401 },
    );
  }
  const response = NextResponse.json({ ok: true, treasurer: true });
  response.cookies.set(COOKIE, treasurerCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.VERCEL === "1",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
  return response;
}
