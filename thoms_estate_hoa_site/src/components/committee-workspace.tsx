"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { YearBars } from "@/components/budget-history";
import {
  HISTORY_YEARS,
  actualLabel,
  approvedYear,
  committeeActual,
  committeePlan,
  emptyRequest,
  getAccount,
  money,
  requestTotal,
  requestYear,
  seedFromApproved,
  type Committee,
  type CommitteeRequest,
  type LineItem,
  type RequestStore,
} from "@/lib/budget";
import { budgetHistory } from "@/lib/budget";

export function CommitteeWorkspace({ committee }: { committee: Committee }) {
  const [store, setStore] = useState<RequestStore | null>(null);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [request, setRequest] = useState<CommitteeRequest>(emptyRequest());

  const load = useCallback(async () => {
    const res = await fetch("/api/budget/requests", { cache: "no-store" });
    const data = (await res.json()) as RequestStore;
    setStore(data);
    setRequest(data.committees[committee.slug] ?? emptyRequest());
  }, [committee.slug]);

  useEffect(() => {
    void load();
  }, [load]);

  async function persist(next: CommitteeRequest, nextStore?: RequestStore) {
    const base = nextStore ?? store ?? { requestYear, committees: {} };
    const payload: RequestStore = {
      requestYear: base.requestYear,
      committees: {
        ...base.committees,
        [committee.slug]: { ...next, updatedAt: new Date().toISOString() },
      },
    };
    setRequest(payload.committees[committee.slug]);
    setStore(payload);
    setSaving("saving");
    try {
      const res = await fetch("/api/budget/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      setSaving("saved");
    } catch {
      setSaving("error");
    }
  }

  const lastPlan = committeePlan(committee, approvedYear);
  const lastActual = committeeActual(committee, 2025);
  const total = requestTotal(request);
  const vsPlan = total - lastPlan;
  const prior =
    (budgetHistory.priorRequests as Record<
      string,
      { year: number; items: { accountId: string; description: string; amount: number }[] }[]
    >)[committee.slug] ?? [];

  const expenseAccounts = useMemo(
    () =>
      committee.accounts.filter((id) => getAccount(id)?.kind === "expense"),
    [committee.accounts],
  );

  function updateItem(id: string, patch: Partial<LineItem>) {
    const next = {
      ...request,
      lineItems: request.lineItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    };
    setRequest(next);
  }

  function addItem() {
    const accountId = expenseAccounts[0] ?? committee.accounts[0];
    const next = {
      ...request,
      lineItems: [
        ...request.lineItems,
        {
          id: crypto.randomUUID(),
          accountId,
          description: "",
          amount: 0,
        },
      ],
    };
    setRequest(next);
  }

  function removeItem(id: string) {
    setRequest({
      ...request,
      lineItems: request.lineItems.filter((item) => item.id !== id),
    });
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label={`${approvedYear} approved`} value={money(lastPlan)} />
        <Stat
          label={`2025 ${actualLabel(2025).toLowerCase()}`}
          value={money(lastActual)}
          hint="From the Tessier December 2025 board packet."
        />
        <Stat
          label={`${requestYear} request`}
          value={money(total)}
          hint={
            vsPlan === 0
              ? "Matches last approved plan"
              : `${vsPlan > 0 ? "+" : ""}${money(vsPlan)} vs ${approvedYear}`
          }
        />
      </section>

      <section className="rounded-3xl border border-forest/10 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-forest">
              Plan vs actual
            </h2>
            <p className="text-sm text-muted">
              Gold is plan, green is Tessier year-end actual.
            </p>
          </div>
          <div className="flex gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <i className="inline-block h-2.5 w-2.5 rounded-sm bg-brass/80" /> Plan
            </span>
            <span className="inline-flex items-center gap-1">
              <i className="inline-block h-2.5 w-2.5 rounded-sm bg-pine" /> Actual
            </span>
          </div>
        </div>
        <YearBars
          years={HISTORY_YEARS}
          plan={(year) => committeePlan(committee, year)}
          actual={(year) => committeeActual(committee, year)}
        />
        <Link
          href="#history-table"
          className="mt-4 inline-block text-sm text-pine underline decoration-brass underline-offset-4"
        >
          Open the year-by-year table
        </Link>
      </section>

      {prior.length > 0 ? (
        <section className="rounded-3xl bg-parchment/70 p-6">
          <h2 className="font-display text-2xl text-forest">
            Prior committee packets
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {prior.map((packet) => (
              <article key={packet.year} className="rounded-2xl bg-white p-4">
                <p className="text-xs tracking-[0.2em] text-brass-dark uppercase">
                  {packet.year} request
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {packet.items.map((item) => (
                    <li
                      key={`${item.description}-${item.amount}`}
                      className="flex justify-between gap-3"
                    >
                      <span className="text-forest">{item.description}</span>
                      <span className="shrink-0 tabular-nums text-muted">
                        {money(item.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-right text-sm font-semibold text-forest">
                  {money(
                    packet.items.reduce((sum, item) => sum + item.amount, 0),
                  )}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border border-forest/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-forest">
              {requestYear} request
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Add the same kind of line items you used to put in the committee
              worksheet: a short description, Tessier account, and amount.
              Submit when the packet is ready for the treasurer.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
              request.status === "submitted"
                ? "bg-pine text-cream"
                : "bg-parchment text-forest"
            }`}
          >
            {request.status}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-muted">Committee chair / preparer</span>
            <input
              value={request.chair}
              onChange={(event) =>
                setRequest({ ...request, chair: event.target.value })
              }
              className="mt-1 w-full rounded-xl border border-forest/15 bg-cream px-3 py-2"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-muted">Notes for the treasurer</span>
            <textarea
              value={request.notes}
              onChange={(event) =>
                setRequest({ ...request, notes: event.target.value })
              }
              rows={3}
              className="mt-1 w-full rounded-xl border border-forest/15 bg-cream px-3 py-2"
            />
          </label>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="text-left text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="py-2 pr-3">Account</th>
                <th className="py-2 pr-3">What is this for?</th>
                <th className="py-2 pr-3 text-right">Amount</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {request.lineItems.map((item) => (
                <tr key={item.id} className="border-t border-forest/10">
                  <td className="py-2 pr-3">
                    <select
                      value={item.accountId}
                      onChange={(event) =>
                        updateItem(item.id, { accountId: event.target.value })
                      }
                      className="w-full rounded-lg border border-forest/15 bg-cream px-2 py-1.5"
                    >
                      {expenseAccounts.map((id) => (
                        <option key={id} value={id}>
                          {id} {getAccount(id)?.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      value={item.description}
                      onChange={(event) =>
                        updateItem(item.id, {
                          description: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-forest/15 bg-cream px-2 py-1.5"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="number"
                      step="1"
                      value={item.amount}
                      onChange={(event) =>
                        updateItem(item.id, {
                          amount: Number(event.target.value) || 0,
                        })
                      }
                      className="w-28 rounded-lg border border-forest/15 bg-cream px-2 py-1.5 text-right tabular-nums"
                    />
                  </td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-muted hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={addItem}
            className="rounded-full border border-forest/20 px-4 py-2 text-sm text-forest"
          >
            Add line
          </button>
          <button
            type="button"
            onClick={() => setRequest(seedFromApproved(committee))}
            className="rounded-full border border-forest/20 px-4 py-2 text-sm text-forest"
          >
            Start from {approvedYear} plan
          </button>
          <button
            type="button"
            onClick={() => persist({ ...request, status: "draft" })}
            className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-cream"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={() => persist({ ...request, status: "submitted" })}
            className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-forest-deep"
          >
            Submit to treasurer
          </button>
          <span className="text-xs text-muted">
            {saving === "saving"
              ? "Saving…"
              : saving === "saved"
                ? "Saved"
                : saving === "error"
                  ? "Could not save"
                  : null}
          </span>
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
