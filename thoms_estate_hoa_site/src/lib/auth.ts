import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  COOKIE,
  isValidTreasurerToken,
  passwordMatches,
  treasurerCookieValue,
  MAX_AGE_SEC,
} from "@/lib/auth-shared";

export {
  COOKIE,
  MAX_AGE_SEC,
  isValidTreasurerToken,
  passwordMatches,
  treasurerCookieValue,
};

export async function readTreasurerSession() {
  const jar = await cookies();
  return isValidTreasurerToken(jar.get(COOKIE)?.value);
}

export async function requireTreasurer(request?: Request) {
  const headerCookie = request?.headers.get("cookie") ?? "";
  const match = headerCookie.match(new RegExp(`${COOKIE}=([^;]+)`));
  const fromHeader = match?.[1] ? decodeURIComponent(match[1]) : null;
  const ok =
    isValidTreasurerToken(fromHeader) || (await readTreasurerSession());
  if (ok) return null;
  return NextResponse.json(
    { error: "Treasurer login required." },
    { status: 401 },
  );
}
