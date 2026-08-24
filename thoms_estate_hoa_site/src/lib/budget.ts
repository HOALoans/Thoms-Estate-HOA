import history from "@/data/budget-history.json";
import statements from "@/data/ytd-statements.json";
import { yearEndForecast as resolveYearEnd } from "@/lib/forecast";

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
  amount: number | null;
  /** Treasurer Board Revised Budget amount for this account line. */
  planAmount?: number | null;
  months?: number[] | null;
};

export type CommitteeRequest = {
  status: "draft" | "submitted";
  chair: string;
  notes: string;
  updatedAt: string;
  lineItems: LineItem[];
};

export type YtdStatement = {
  id: string;
  asOfYear: number;
  asOfMonth: number;
  label: string;
  kind: string;
  source?: string;
  accounts: Record<string, number>;
  totals?: {
    income?: { month?: number; ytd?: number };
    expense?: { month?: number; ytd?: number };
  };
};

export type RequestStore = {
  requestYear: number;
  operatingYear: number;
  asOfMonth?: number;
  ytdYear?: number;
  ytdStatementId?: string;
  /** Tessier YTD actuals for the operating year (seeded from statements). */
  ytdActual: Record<string, number>;
  /**
   * Treasurer-adjusted  year-end forecasts by account. When set, every view
   * that shows a 2026 year-end forecast must use these values.
   */
  yeForecast: Record<string, number>;
  /** Optional monthly board budget overrides (12 months). */
  monthlyBudget: Record<string, number[]>;
  committees: Record<string, CommitteeRequest>;
};

export const budgetHistory = history;
export const accounts = history.accounts as Account[];
export const committees = history.committees as Committee[];
export const approvedYear = history.approvedYear;
export const requestYear = history.requestYear;
/** Operating / forecast year (current Tessier year). */
export const operatingYear = 2026;
export const ytdStatements = statements as YtdStatement[];

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

export function latestStatement(year = operatingYear) {
  return ytdStatements
    .filter((statement) => statement.asOfYear === year)
    .sort((a, b) => a.asOfMonth - b.asOfMonth)
    .at(-1);
}

export function statementAsOfLabel(statement: YtdStatement | undefined) {
  if (!statement) return null;
  const day = new Date(statement.asOfYear, statement.asOfMonth, 0).getDate();
  return new Date(
    statement.asOfYear,
    statement.asOfMonth - 1,
    day,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function emptyStore(): RequestStore {
  const statement = latestStatement(operatingYear);
  return {
    requestYear,
    operatingYear,
    asOfMonth: statement?.asOfMonth,
    ytdYear: operatingYear,
    ytdStatementId: statement?.id,
    ytdActual: statement ? { ...statement.accounts } : {},
    yeForecast: {},
    monthlyBudget: {},
    committees: {},
  };
}

export function lineBoardAmount(item: LineItem) {
  return item.planAmount ?? item.amount ?? 0;
}

export function requestTotal(
  request: CommitteeRequest | undefined,
  kind?: AccountKind,
) {
  if (!request) return 0;
  return request.lineItems.reduce((sum, item) => {
    if (kind && getAccount(item.accountId)?.kind !== kind) return sum;
    return sum + (item.amount || 0);
  }, 0);
}

export function boardRevisedTotal(
  request: CommitteeRequest | undefined,
  kind?: AccountKind,
) {
  if (!request) return 0;
  return request.lineItems.reduce((sum, item) => {
    if (kind && getAccount(item.accountId)?.kind !== kind) return sum;
    return sum + lineBoardAmount(item);
  }, 0);
}

export function requestByAccount(
  request: CommitteeRequest | undefined,
  mode: "request" | "plan" = "request",
) {
  const totals: Record<string, number> = {};
  for (const item of request?.lineItems ?? []) {
    const amount = mode === "plan" ? lineBoardAmount(item) : item.amount || 0;
    totals[item.accountId] = (totals[item.accountId] ?? 0) + amount;
  }
  return totals;
}

export function aggregateAccounts(store: RequestStore) {
  const submitted: Record<string, number> = {};
  const drafts: Record<string, number> = {};
  const plans: Record<string, number> = {};
  for (const committee of committees) {
    const request = store.committees[committee.slug];
    const byRequest = requestByAccount(request, "request");
    const byPlan = requestByAccount(request, "plan");
    const target = request?.status === "submitted" ? submitted : drafts;
    for (const [accountId, amount] of Object.entries(byRequest)) {
      target[accountId] = (target[accountId] ?? 0) + amount;
    }
    for (const [accountId, amount] of Object.entries(byPlan)) {
      plans[accountId] = (plans[accountId] ?? 0) + amount;
    }
  }
  return { submitted, drafts, plans };
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
        amount: planFor(id, approvedYear) || null,
      }))
      .filter((item) => (item.amount || 0) !== 0),
  };
}

/**
 * Prepare a committee packet for the Board Budget / Treasurer view.
 * Save always marks the packet submitted so it appears in the rollup.
 * Preserves existing Board Revised planAmount when the treasurer already set one.
 */
export function prepareForBoardBudget(
  next: CommitteeRequest,
  previous: CommitteeRequest | undefined,
  preservePlanAmount = false,
): CommitteeRequest {
  const byId = new Map((previous?.lineItems ?? []).map((item) => [item.id, item]));
  const byAccount = new Map(
    (previous?.lineItems ?? []).map((item) => [item.accountId, item]),
  );
  return {
    ...next,
    status: "submitted",
    lineItems: next.lineItems.map((item) => {
      if (preservePlanAmount && item.planAmount != null) return item;
      const prior = byId.get(item.id) ?? byAccount.get(item.accountId);
      const priorPlan = prior?.planAmount ?? null;
      const priorAmount = prior?.amount ?? null;
      return {
        ...item,
        planAmount:
          priorPlan != null && priorPlan !== priorAmount
            ? priorPlan
            : item.amount,
      };
    }),
  };
}

export function ensureCommitteeAccounts(
  committee: Committee,
  request: CommitteeRequest,
): CommitteeRequest {
  const existing = new Set(request.lineItems.map((item) => item.accountId));
  const missing = seedFromApproved(committee).lineItems.filter(
    (item) => !existing.has(item.accountId),
  );
  if (missing.length === 0) return request;
  return { ...request, lineItems: [...request.lineItems, ...missing] };
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

export function committeeExpenseAccounts(committee: Committee) {
  return committee.accounts.filter((id) => getAccount(id)?.kind === "expense");
}

export function committeeRevenueAccounts(committee: Committee) {
  return committee.accounts.filter((id) => getAccount(id)?.kind === "revenue");
}

/** Site-wide YE forecast for one account from the shared store. */
export function storeYearEndForecast(
  store: RequestStore,
  accountId: string,
  asOfMonth?: number,
) {
  const month = asOfMonth ?? store.asOfMonth ?? latestStatement()?.asOfMonth ?? 7;
  const ytd = store.ytdActual[accountId] ?? 0;
  return resolveYearEnd(accountId, ytd, month, store.yeForecast[accountId]);
}

export function committeeYearEndForecast(
  store: RequestStore,
  committee: Committee,
  kind: AccountKind = "expense",
) {
  const month = store.asOfMonth ?? latestStatement()?.asOfMonth ?? 7;
  return committee.accounts
    .filter((id) => getAccount(id)?.kind === kind)
    .reduce((sum, id) => sum + storeYearEndForecast(store, id, month), 0);
}

/**
 * Apply treasurer YE forecast edits. Values that match the auto-projection
 * are cleared so the site keeps using live seasonality until overridden again.
 */
export function applyYeForecastOverrides(
  store: RequestStore,
  edits: Record<string, number | null | undefined>,
): RequestStore {
  const next = { ...store.yeForecast };
  const month = store.asOfMonth ?? latestStatement()?.asOfMonth ?? 7;
  let changed = false;
  for (const [accountId, raw] of Object.entries(edits)) {
    const projected = Math.round(
      resolveYearEnd(accountId, store.ytdActual[accountId] ?? 0, month, null),
    );
    const value =
      raw == null || !Number.isFinite(raw)
        ? null
        : Math.max(0, Math.round(raw));
    if (value == null || value === projected) {
      if (accountId in next) {
        delete next[accountId];
        changed = true;
      }
      continue;
    }
    if (next[accountId] !== value) {
      next[accountId] = value;
      changed = true;
    }
  }
  return changed ? { ...store, yeForecast: next } : store;
}

export function statusLabel(request: CommitteeRequest | undefined) {
  if (!request) return "Not started";
  return request.status === "submitted" ? "Submitted" : "Not yet submitted";
}
