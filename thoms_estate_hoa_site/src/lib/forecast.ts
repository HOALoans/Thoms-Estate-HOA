import seasonality from "@/data/seasonality.json";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const EVEN_SHARES = Array.from({ length: 12 }, () => 1 / 12);

export type SeasonalitySource =
  | "even"
  | "history"
  | "history-remaining-dollars";

export type Projection = {
  impliedAnnual: number;
  remaining: number;
  projected: number;
  ytdShare: number;
  remainingShare: number;
  shares: number[];
  source: SeasonalitySource;
};

function sumShares(shares: number[], fromMonth: number, toMonth: number) {
  return shares.slice(fromMonth - 1, toMonth).reduce((sum, value) => sum + value, 0);
}

function averageRemainingDollars(accountId: string, asOfMonth: number) {
  const byYear = (seasonality.accounts as Record<string, Record<string, number[]>>)[
    accountId
  ];
  if (!byYear) return null;
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => a - b)
    .slice(-seasonality.lookbackYears);
  const remainders: number[] = [];
  for (const year of years) {
    const months = byYear[String(year)];
    if (!months || months.length !== 12) continue;
    const yearTotal = months.reduce((sum, value) => sum + (value || 0), 0);
    if (yearTotal <= 0) continue;
    remainders.push(
      months.slice(asOfMonth).reduce((sum, value) => sum + (value || 0), 0),
    );
  }
  if (remainders.length === 0) return null;
  return remainders.reduce((sum, value) => sum + value, 0) / remainders.length;
}

export function monthShares(accountId: string) {
  const byYear = (seasonality.accounts as Record<string, Record<string, number[]>>)[
    accountId
  ];
  if (!byYear) return { shares: EVEN_SHARES, source: "even" as const };

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => a - b)
    .slice(-seasonality.lookbackYears);
  const totals = Array.from({ length: 12 }, () => 0);
  let used = 0;
  for (const year of years) {
    const months = byYear[String(year)];
    if (!months || months.length !== 12) continue;
    const yearTotal = months.reduce((sum, value) => sum + (value || 0), 0);
    if (yearTotal <= 0) continue;
    used += 1;
    months.forEach((value, index) => {
      totals[index] += (value || 0) / yearTotal;
    });
  }
  if (!used) return { shares: EVEN_SHARES, source: "even" as const };
  return {
    shares: totals.map((value) => value / used),
    source: "history" as const,
  };
}

function resolveShares(accountId: string, asOfMonth: number) {
  const base = monthShares(accountId);
  if (base.source !== "history" || asOfMonth <= 0 || asOfMonth >= 12) {
    return base;
  }
  const ytdShare = sumShares(base.shares, 1, asOfMonth);
  if (ytdShare < (asOfMonth / 12) * 0.4) {
    return { shares: base.shares, source: "history-remaining-dollars" as const };
  }
  return base;
}

function projectFromShares(ytd: number, asOfMonth: number, shares: number[]) {
  const ytdShare = sumShares(shares, 1, asOfMonth);
  const remainingShare = sumShares(shares, asOfMonth + 1, 12);
  if (ytd === 0) {
    return {
      impliedAnnual: 0,
      remaining: 0,
      projected: 0,
      ytdShare,
      remainingShare,
    };
  }
  if (ytdShare <= 0) {
    return {
      impliedAnnual: ytd,
      remaining: 0,
      projected: ytd,
      ytdShare,
      remainingShare,
    };
  }
  const impliedAnnual = ytd / ytdShare;
  const remaining = impliedAnnual * remainingShare;
  return {
    impliedAnnual,
    remaining,
    projected: ytd + remaining,
    ytdShare,
    remainingShare,
  };
}

/** Project year-end from YTD using Tessier seasonality. */
export function projectYearEnd(
  accountId: string,
  ytd: number,
  asOfMonth: number,
): Projection {
  const { shares, source } = resolveShares(accountId, asOfMonth);
  if (source === "history-remaining-dollars") {
    const remaining = averageRemainingDollars(accountId, asOfMonth) ?? 0;
    return {
      impliedAnnual: ytd + remaining,
      remaining,
      projected: ytd + remaining,
      ytdShare: sumShares(shares, 1, asOfMonth),
      remainingShare: sumShares(shares, asOfMonth + 1, 12),
      shares,
      source,
    };
  }
  return { ...projectFromShares(ytd, asOfMonth, shares), shares, source };
}

/**
 * Site-wide year-end figure: treasurer override wins, otherwise seasonality
 * projection from the shared YTD actual.
 */
export function yearEndForecast(
  accountId: string,
  ytd: number,
  asOfMonth: number,
  override?: number | null,
) {
  if (override != null && Number.isFinite(override)) return override;
  return projectYearEnd(accountId, ytd, asOfMonth).projected;
}

export function remainingMonthMix(asOfMonth: number, shares: number[]) {
  return MONTH_LABELS.map((label, index) => ({
    label,
    month: index + 1,
    share: shares[index] ?? 0,
    remaining: index + 1 > asOfMonth,
  })).filter((row) => row.remaining);
}

export function currentCalendarMonth(date = new Date()) {
  return date.getMonth() + 1;
}

export { MONTH_LABELS };
