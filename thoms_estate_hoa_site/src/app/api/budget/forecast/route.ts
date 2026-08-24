import { NextResponse } from "next/server";

import { applyYeForecastOverrides } from "@/lib/budget";
import {
  mergeForecastWrite,
  readRequests,
  writeRequests,
} from "@/lib/budget-store";
import { requireTreasurer } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Treasurer-only year-end forecast adjustments.
 * Writes into the same durable store that committee Saves use, so every
 * public and board view that reads yeForecast sees the new numbers.
 */
export async function GET(request: Request) {
  const denied = await requireTreasurer(request);
  if (denied) return denied;
  const store = await readRequests();
  return NextResponse.json({
    yeForecast: store.yeForecast,
    asOfMonth: store.asOfMonth,
    ytdActual: store.ytdActual,
  });
}

export async function PUT(request: Request) {
  const denied = await requireTreasurer(request);
  if (denied) return denied;

  const body = (await request.json()) as {
    yeForecast?: Record<string, number | null | undefined>;
    monthlyBudget?: Record<string, number[]>;
  };
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const current = await readRequests();
  const withForecast = applyYeForecastOverrides(
    current,
    body.yeForecast ?? {},
  );
  const saved = await writeRequests(
    mergeForecastWrite(
      withForecast,
      withForecast.yeForecast,
      body.monthlyBudget,
    ),
  );
  return NextResponse.json(saved);
}
