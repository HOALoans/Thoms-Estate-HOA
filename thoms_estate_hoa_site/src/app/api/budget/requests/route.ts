import { NextResponse } from "next/server";

import type { RequestStore } from "@/lib/budget";
import {
  mergeCommitteeWrite,
  readRequests,
  writeRequests,
} from "@/lib/budget-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await readRequests();
  return NextResponse.json(store);
}

/**
 * Committee chairs and the board desk save packets here.
 * Only committee (and requestYear) fields are merged from the body —
 * yeForecast / monthlyBudget / ytdActual are preserved from durable store
 * so a chair Save cannot wipe treasurer year-end adjustments.
 */
export async function PUT(request: Request) {
  const body = (await request.json()) as Partial<RequestStore>;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const current = await readRequests();
  const merged = mergeCommitteeWrite(current, body);
  const saved = await writeRequests(merged);
  return NextResponse.json(saved);
}
