import history from "@/data/budget-history.json";

export type AccountKind = "revenue" | "expense";

export type Account = {
  id: string;
  name: string;
  kind: AccountKind;
};

export type Committee = {
  slug: string;
  name: string;
  blurb: string;
  accounts: string[];
  boardManaged?: boolean;
};

export type YearFigures = {
  plan?: number;
  actual?: number;
};

export type LineItem = {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  months?: number[] | null;
};

export type CommitteeRequest = {
  status: "draft" | "submitted";
  chair: string;
  notes: string;
  updatedAt: string;
  lineItems: LineItem[];
};

export type RequestStore = {
  requestYear: number;
  committees: Record<string, CommitteeRequest>;
};

export const budgetHistory = history;
export const accounts = history.accounts as Account[];
export const committees = history.committees as Committee[];
export const approvedYear = history.approvedYear;
export const requestYear = history.requestYear;

const accountById = new Map(accounts.map((account) => [account.id, account]));

export function getAccount(id: string) {
  return accountById.get(id);
}

export function getCommittee(slug: string) {
  return committees.find((committee) => committee.slug === slug);
}

export function figuresFor(accountId: string, year: number | string): YearFigures {
  const rec = (
    history.history as Record<string, Record<string, YearFigures>>
  )[accountId]?.[String(year)];
  return rec ?? {};
}

export function planFor(accountId: string, year: number) {
  return figuresFor(accountId, year).plan ?? 0;
}

export function actualFor(accountId: string, year: number) {
  return figuresFor(accountId, year).actual;
}

export function committeePlan(committee: Committee, year: number) {
  return committee.accounts
    .filter((id) => getAccount(id)?.kind === "expense")
    .reduce((sum, id) => sum + planFor(id, year), 0);
}

export function committeeActual(committee: Committee, year: number) {
  const values = committee.accounts
    .filter((id) => getAccount(id)?.kind === "expense")
    .map((id) => actualFor(id, year))
    .filter((value): value is number => value != null);
  if (values.length === 0) return undefined;
  return values.reduce((sum, value) => sum + value, 0);
}

export function requestTotal(request: CommitteeRequest | undefined) {
  if (!request) return 0;
  return request.lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
}

export function requestByAccount(request: CommitteeRequest | undefined) {
  const totals: Record<string, number> = {};
  for (const item of request?.lineItems ?? []) {
    totals[item.accountId] = (totals[item.accountId] ?? 0) + (item.amount || 0);
  }
  return totals;
}

export function aggregateAccounts(store: RequestStore) {
  const submitted: Record<string, number> = {};
  const drafts: Record<string, number> = {};
  for (const committee of committees) {
    const request = store.committees[committee.slug];
    const byAccount = requestByAccount(request);
    const target = request?.status === "submitted" ? submitted : drafts;
    for (const [accountId, amount] of Object.entries(byAccount)) {
      target[accountId] = (target[accountId] ?? 0) + amount;
    }
  }
  return { submitted, drafts };
}

export function emptyRequest(): CommitteeRequest {
  return {
    status: "draft",
    chair: "",
    notes: "",
    updatedAt: new Date().toISOString(),
    lineItems: [],
  };
}

export function seedFromApproved(committee: Committee): CommitteeRequest {
  return {
    status: "draft",
    chair: "",
    notes: "",
    updatedAt: new Date().toISOString(),
    lineItems: committee.accounts
      .filter((id) => getAccount(id)?.kind === "expense")
      .map((id) => ({
        id: `${id}-carry`,
        accountId: id,
        description: `Carry forward ${approvedYear} plan`,
        amount: planFor(id, approvedYear),
      }))
      .filter((item) => item.amount !== 0),
  };
}

export function money(value: number | undefined | null) {
  if (value == null || Number.isNaN(value)) return "—";
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: abs >= 100 ? 0 : 2,
  });
  return value < 0 ? `(${formatted})` : formatted;
}

export function variance(plan: number | undefined, actual: number | undefined) {
  if (plan == null || actual == null) return undefined;
  return actual - plan;
}

/** Years with Tessier year-end packets, plus the current approved plan year. */
export const HISTORY_YEARS = Object.keys(history.sourceByYear)
  .map(Number)
  .sort((a, b) => a - b);

export function actualLabel(year: number) {
  const kind = (history.actualKindByYear as Record<string, string>)[
    String(year)
  ];
  if (kind === "year-end") return "Year-end actual";
  if (kind === "ytd") return "YTD actual";
  if (kind === "forecast") return "Year-end forecast";
  if (kind === "full") return "Actual";
  if (year === approvedYear) return "Plan only";
  return "Actual";
}

export function yearColumnNote(year: number) {
  const kind = (history.actualKindByYear as Record<string, string>)[
    String(year)
  ];
  if (kind === "year-end") return "year-end";
  if (year === approvedYear) return "plan only";
  return "";
}
