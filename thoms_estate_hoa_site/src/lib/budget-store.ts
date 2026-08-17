import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { requestYear, type RequestStore } from "@/lib/budget";

const FILE = path.join(process.cwd(), "data", "requests.json");

export async function readRequests(): Promise<RequestStore> {
  try {
    const raw = await readFile(FILE, "utf8");
    return JSON.parse(raw) as RequestStore;
  } catch {
    return { requestYear, committees: {} };
  }
}

export async function writeRequests(store: RequestStore) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}
