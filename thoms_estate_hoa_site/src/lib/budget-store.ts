import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  emptyStore,
  operatingYear,
  requestYear,
  type CommitteeRequest,
  type RequestStore,
} from "@/lib/budget";

const FILE = path.join(process.cwd(), "data", "requests.json");
const KV_KEY = "thoms:budget:requests";

type DurableBackend = "file" | "memory" | "kv";

const memoryFallback = new Map<string, RequestStore>();

function kvConfigured() {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
  );
}

async function readFromKv(): Promise<RequestStore | null> {
  if (!kvConfigured()) return null;
  try {
    const url = `${process.env.KV_REST_API_URL}/get/${encodeURIComponent(KV_KEY)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const payload = (await res.json()) as { result?: string | null };
    if (!payload.result) return null;
    return JSON.parse(payload.result) as RequestStore;
  } catch {
    return null;
  }
}

async function writeToKv(store: RequestStore) {
  if (!kvConfigured()) return false;
  try {
    const url = `${process.env.KV_REST_API_URL}/set/${encodeURIComponent(KV_KEY)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(store),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function normalizeCommittee(raw: CommitteeRequest | undefined): CommitteeRequest | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  return {
    status: raw.status === "submitted" ? "submitted" : "draft",
    chair: typeof raw.chair === "string" ? raw.chair : "",
    notes: typeof raw.notes === "string" ? raw.notes : "",
    updatedAt:
      typeof raw.updatedAt === "string"
        ? raw.updatedAt
        : new Date().toISOString(),
    lineItems: Array.isArray(raw.lineItems)
      ? raw.lineItems.map((item) => ({
          id: String(item.id ?? crypto.randomUUID()),
          accountId: String(item.accountId ?? ""),
          description: String(item.description ?? ""),
          amount:
            item.amount == null || Number.isNaN(Number(item.amount))
              ? null
              : Number(item.amount),
          planAmount:
            item.planAmount == null || Number.isNaN(Number(item.planAmount))
              ? null
              : Number(item.planAmount),
        }))
      : [],
  };
}

/**
 * Normalize a store payload and re-seed statement-backed fields so every
 * reader sees the same operating-year YTD baseline.
 */
export function normalizeStore(input?: Partial<RequestStore> | null): RequestStore {
  const seed = emptyStore();
  const committees: Record<string, CommitteeRequest> = {};
  for (const [slug, value] of Object.entries(input?.committees ?? {})) {
    const normalized = normalizeCommittee(value);
    if (normalized) committees[slug] = normalized;
  }

  const yeForecast: Record<string, number> = {};
  for (const [accountId, value] of Object.entries(input?.yeForecast ?? {})) {
    if (typeof value === "number" && Number.isFinite(value)) {
      yeForecast[accountId] = value;
    }
  }

  const monthlyBudget: Record<string, number[]> = {};
  for (const [accountId, months] of Object.entries(input?.monthlyBudget ?? {})) {
    if (
      Array.isArray(months) &&
      months.length === 12 &&
      months.every((value) => typeof value === "number")
    ) {
      monthlyBudget[accountId] = months.map((value) => Math.round(value || 0));
    }
  }

  return {
    requestYear: input?.requestYear ?? seed.requestYear ?? requestYear,
    operatingYear: seed.operatingYear ?? operatingYear,
    asOfMonth: seed.asOfMonth,
    ytdYear: seed.ytdYear,
    ytdStatementId: seed.ytdStatementId,
    // Statement YTD is the shared baseline; treasurer YE overrides live in yeForecast.
    ytdActual: { ...seed.ytdActual },
    yeForecast,
    monthlyBudget,
    committees,
  };
}

/**
 * Merge an incoming committee/board write into the durable store without
 * dropping treasurer YE forecast overrides or other committees.
 */
export function mergeCommitteeWrite(
  current: RequestStore,
  incoming: Partial<RequestStore>,
): RequestStore {
  const base = normalizeStore(current);
  const committees = { ...base.committees };
  for (const [slug, value] of Object.entries(incoming.committees ?? {})) {
    const normalized = normalizeCommittee(value);
    if (normalized) committees[slug] = normalized;
  }
  return normalizeStore({
    ...base,
    requestYear: incoming.requestYear ?? base.requestYear,
    committees,
    // Preserve treasurer-controlled fields unless a dedicated forecast write runs.
    yeForecast: base.yeForecast,
    monthlyBudget: base.monthlyBudget,
  });
}

export function mergeForecastWrite(
  current: RequestStore,
  yeForecast: Record<string, number>,
  monthlyBudget?: Record<string, number[]>,
): RequestStore {
  const base = normalizeStore(current);
  return normalizeStore({
    ...base,
    yeForecast,
    monthlyBudget: monthlyBudget ?? base.monthlyBudget,
  });
}

export async function readRequests(): Promise<RequestStore> {
  const fromKv = await readFromKv();
  if (fromKv) return normalizeStore(fromKv);

  try {
    const raw = await readFile(FILE, "utf8");
    return normalizeStore(JSON.parse(raw) as RequestStore);
  } catch {
    const mem = memoryFallback.get(KV_KEY);
    return normalizeStore(mem ?? emptyStore());
  }
}

export async function writeRequests(store: RequestStore) {
  const normalized = normalizeStore(store);
  memoryFallback.set(KV_KEY, normalized);

  const wroteKv = await writeToKv(normalized);
  // Always mirror to the local file in non-KV environments (dev / tests /
  // single-node). On Vercel, set KV_REST_API_* so committee Saves and
  // treasurer forecasts share one durable store across instances.
  if (!wroteKv) {
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  }
  return normalized;
}

export function storageBackend(): DurableBackend {
  if (kvConfigured()) return "kv";
  if (process.env.VERCEL) return "memory";
  return "file";
}
