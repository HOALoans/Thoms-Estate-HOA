import { NextResponse } from "next/server";

import { readTreasurerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const treasurer = await readTreasurerSession();
  return NextResponse.json({ treasurer });
}
