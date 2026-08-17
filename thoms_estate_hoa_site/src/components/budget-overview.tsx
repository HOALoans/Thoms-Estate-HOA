"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  aggregateAccounts,
  approvedYear,
  actualLabel,
  committeeActual,
  committeePlan,
  committees,
  getAccount,
  money,
  planFor,
  requestTotal,
  requestYear,
  type RequestStore,
} from "@/lib/budget";

export function BudgetOverview() {
  const [store, setStore] = useState<RequestStore | null>(null);

  useEffect(() => {
    void fetch("/api/budget/requests", { cache: "no-store" })
      .then((res) => res.json())
      .then(setStore);
  }, []);

  const data = store ?? { requestYear, committees: {} };
  const { submitted, drafts } = useMemo(() => aggregateAccounts(data), [data]);

  const volunteer = committees.filter((committee) => !committee.boardManaged);
  const board = committees.find((committee) => committee.boardManaged);

  const submittedExpense = volunteer.reduce((sum, committee) => {
    const request = data.committees[committee.slug];
    return request?.status === "submitted" ? sum + requestTotal(request) : sum;
  }, 0);
  const draftExpense = volunteer.reduce((sum, committee) => {
    const request = data.committees[committee.slug];
    return request && request.status !== "submitted"
      ? sum + requestTotal(request)
      : sum;
  }, 0);
  const volunteerPlan = volunteer.reduce(
    (sum, committee) => sum + committeePlan(committee, approvedYear),
    0,
  );

  const expenseAccounts = committees
    .flatMap((committee) => committee.accounts)
    .filter((id, index, all) => all.indexOf(id) === index)
    .filter((id) => getAccount(id)?.kind === "expense");

  const proposedTotal = expenseAccounts.reduce((sum, id) => {
    const amount = submitted[id] || drafts[id] || planFor(id, approvedYear);
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-4">
        <Stat label={`${approvedYear} committee plan`} value={money(volunteerPlan)} />
        <Stat label={`${requestYear} submitted`} value={money(submittedExpense)} />
        <Stat label="Still in draft" value={money(draftExpense)} />
        <Stat
          label={`${requestYear} proposed operating`}
          value={money(proposedTotal)}
          hint="Submitted amounts, else drafts, else last approved plan."
        />
      </section>

      <section>
        <h2 className="font-display text-3xl text-forest">Committees</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Each chair opens a workspace, reviews historical plan vs actual, and
          submits a {requestYear} packet. Totals on this page update as packets
          are saved.
        </p>
        <div className="mt-5 grid gap-3">
          {volunteer.map((committee) => {
            const request = data.committees[committee.slug];
            const plan = committeePlan(committee, approvedYear);
            const ytd = committeeActual(committee, 2025);
            const asked = requestTotal(request);
            return (
              <Link
                key={committee.slug}
                href={`/budget/${committee.slug}`}
                className="grid gap-2 rounded-2xl border border-forest/10 bg-white p-4 transition hover:border-brass/60 sm:grid-cols-[1fr_auto_auto_auto_auto]"
              >
                <div>
                  <p className="font-semibold text-forest">{committee.name}</p>
                  <p className="text-sm text-muted">{committee.blurb}</p>
                </div>
                <Cell label={`${approvedYear} plan`} value={money(plan)} />
                <Cell label={`2025 ${actualLabel(2025).toLowerCase()}`} value={money(ytd)} />
                <Cell
                  label={`${requestYear} request`}
                  value={request ? money(asked) : "—"}
                />
                <span
                  className={`self-center rounded-full px-3 py-1 text-center text-xs font-semibold tracking-wide uppercase ${
                    request?.status === "submitted"
                      ? "bg-pine text-cream"
                      : request
                        ? "bg-parchment text-forest"
                        : "bg-cream text-muted"
                  }`}
                >
                  {request?.status ?? "not started"}
                </span>
              </Link>
            );
          })}
          {board ? (
            <Link
              href={`/budget/${board.slug}`}
              className="rounded-2xl border border-dashed border-forest/20 bg-parchment/50 p-4"
            >
              <p className="font-semibold text-forest">{board.name}</p>
              <p className="text-sm text-muted">{board.blurb}</p>
            </Link>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl text-forest">
          {requestYear} operating budget (rolled up)
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Submitted packets fill the proposed column. Drafts are shown beside
          them so in-progress work is visible without being treated as final.
          Accounts with no packet yet keep the {approvedYear} plan.
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-forest/10 bg-white">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-parchment/80 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Acct</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">{approvedYear} plan</th>
                <th className="px-4 py-3 text-right">
                  {requestYear} submitted
                </th>
                <th className="px-4 py-3 text-right">{requestYear} drafts</th>
                <th className="px-4 py-3 text-right">Proposed</th>
              </tr>
            </thead>
            <tbody>
              {expenseAccounts.map((id) => {
                const plan = planFor(id, approvedYear);
                const sub = submitted[id] ?? 0;
                const draft = drafts[id] ?? 0;
                const proposed = sub || draft || plan;
                return (
                  <tr key={id} className="border-t border-forest/10">
                    <td className="px-4 py-2 tabular-nums text-muted">{id}</td>
                    <td className="px-4 py-2 text-forest">
                      {getAccount(id)?.name}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {money(plan)}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {sub ? money(sub) : "—"}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-muted">
                      {draft ? money(draft) : "—"}
                    </td>
                    <td className="px-4 py-2 text-right font-medium tabular-nums text-forest">
                      {money(proposed)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-forest/10 bg-white p-5">
      <p className="text-xs tracking-[0.2em] text-brass-dark uppercase">
        {label}
      </p>
      <p className="font-display mt-2 text-3xl text-forest">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <p className="text-[10px] tracking-wide text-muted uppercase">{label}</p>
      <p className="tabular-nums text-forest">{value}</p>
    </div>
  );
}
