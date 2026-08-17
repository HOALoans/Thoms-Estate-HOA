import {
  HISTORY_YEARS,
  figuresFor,
  getAccount,
  money,
  variance,
  yearColumnNote,
  type Committee,
} from "@/lib/budget";

export function HistoryTable({ committee }: { committee: Committee }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-white">
      <table className="w-full min-w-[52rem] text-left text-sm">
        <thead className="bg-parchment/80 text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Account</th>
            {HISTORY_YEARS.map((year) => (
              <th key={year} className="px-3 py-3 font-medium">
                {year}
                <span className="mt-0.5 block text-[9px] font-normal tracking-wide text-sage normal-case">
                  {yearColumnNote(year)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {committee.accounts.map((accountId) => (
            <AccountRows
              key={accountId}
              accountId={accountId}
              label={`${accountId} ${getAccount(accountId)?.name ?? ""}`}
            />
          ))}
        </tbody>
      </table>
      <p className="px-4 py-3 text-xs text-muted">
        Plan is the approved budget. Actuals are Tessier year-end packets (as
        of December). 2026 is the approved plan only — that year is not closed.
        A 2024 year-end packet was not in the files Larry sent.
      </p>
    </div>
  );
}

function AccountRows({
  accountId,
  label,
}: {
  accountId: string;
  label: string;
}) {
  return (
    <>
      <tr className="border-t border-forest/10">
        <td className="px-4 py-2 font-medium text-forest" rowSpan={2}>
          {label}
        </td>
        {HISTORY_YEARS.map((year) => (
          <td key={`${year}-p`} className="px-3 py-2 tabular-nums text-forest">
            <span className="mr-1 text-[10px] tracking-wide text-sage uppercase">
              Plan
            </span>
            {money(figuresFor(accountId, year).plan)}
          </td>
        ))}
      </tr>
      <tr className="bg-cream/40">
        {HISTORY_YEARS.map((year) => {
          const rec = figuresFor(accountId, year);
          const delta = variance(rec.plan, rec.actual);
          const over = delta != null && delta > 0;
          const under = delta != null && delta < 0;
          return (
            <td key={`${year}-a`} className="px-3 py-2 tabular-nums">
              <span className="mr-1 text-[10px] tracking-wide text-sage uppercase">
                Act
              </span>
              <span
                className={
                  over ? "text-red-800" : under ? "text-pine" : "text-forest"
                }
              >
                {money(rec.actual)}
              </span>
            </td>
          );
        })}
      </tr>
    </>
  );
}

export function YearBars({
  years,
  plan,
  actual,
}: {
  years: number[];
  plan: (year: number) => number;
  actual: (year: number) => number | undefined;
}) {
  const max = Math.max(
    1,
    ...years.map((year) => Math.max(plan(year), actual(year) ?? 0)),
  );
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))`,
      }}
    >
      {years.map((year) => {
        const p = plan(year);
        const a = actual(year);
        return (
          <div key={year} className="text-center">
            <div className="flex h-28 items-end justify-center gap-1">
              <div
                className="w-3 rounded-t bg-brass/80"
                style={{ height: `${(p / max) * 100}%` }}
                title={`Plan ${money(p)}`}
              />
              <div
                className="w-3 rounded-t bg-pine"
                style={{ height: `${((a ?? 0) / max) * 100}%` }}
                title={`Actual ${money(a)}`}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted">{year}</p>
            <p className="text-[9px] tracking-wide text-sage uppercase">
              {yearColumnNote(year)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
