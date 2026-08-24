import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "thoms_treasurer";
export const MAX_AGE_SEC = 60 * 60 * 24 * 14;

function secret() {
  return (
    process.env.TREASURER_SESSION_SECRET ||
    process.env.TREASURER_PASSWORD ||
    "thoms-dev-treasurer-secret"
  );
}

export function expectedPassword() {
  return process.env.TREASURER_PASSWORD || "";
}

export function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function treasurerCookieValue() {
  const payload = `treasurer:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidTreasurerToken(token: string | undefined | null) {
  if (!token || !token.includes(".")) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function passwordMatches(password: string) {
  const expected = expectedPassword();
  if (!expected) {
    // Dev fallback so local verification works without secrets.
    return password === "TreasurerLocal";
  }
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
