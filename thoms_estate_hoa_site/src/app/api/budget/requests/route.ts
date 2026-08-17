import { NextResponse } from "next/server";

import { requestYear, type RequestStore } from "@/lib/budget";
import { readRequests, writeRequests } from "@/lib/budget-store";

export async function GET() {
  const store = await readRequests();
  return NextResponse.json(store);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as RequestStore;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const store: RequestStore = {
    requestYear: body.requestYear ?? requestYear,
    committees: body.committees ?? {},
  };
  await writeRequests(store);
  return NextResponse.json(store);
}
