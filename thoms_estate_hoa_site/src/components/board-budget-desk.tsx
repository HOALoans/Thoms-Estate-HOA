"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  accounts,
  boardRevisedTotal,
  committees,
  emptyStore,
  getAccount,
  money,
  operatingYear,
  requestTotal,
  requestYear,
  statusLabel,
  storeYearEndForecast,
  type RequestStore,
} from "@/lib/budget";
import { useTreasurer } from "@/lib/use-treasurer";

export function BoardBudgetDesk() {
  const { isTreasurer, ready, logout } = useTreasurer();
  const [store, setStore] = useState<RequestStore | null>(null);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [draftForecast, setDraftForecast] = useState<Record<string, string>>(
    {},
  );

  const load = useCallback(async () => {
    const res = await fetch("/api/budget/requests", { cache: "no-store" });
    const data = (await res.json()) as RequestStore;
    setStore(data);
    const next: Record<string, string> = {};
    for (const account of accounts) {
      const value = storeYearEndForecast(data, account.id);
      next[account.id] = String(Math.round(value || 0));
    }
    setDraftForecast(next);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const data = store ?? emptyStore();
  const volunteer = committees.filter((committee) => !committee.boardManaged);
  const expenseAccounts = useMemo(
    () => accounts.filter((account) => account.kind === "expense"),
    [],
  );

  async function saveForecasts() {
    if (!isTreasurer) return;
    setSaving("saving");
    try {
      const yeForecast: Record<string, number | null> = {};
      for (const account of expenseAccounts) {
        const raw = draftForecast[account.id];
        yeForecast[account.id] =
          raw === "" || raw == null ? null : Number(raw);
      }
      const res = await fetch("/api/budget/forecast", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yeForecast }),
      });
      if (!res.ok) throw new Error("save failed");
      const saved = (await res.json()) as RequestStore;
      setStore(saved);
      setSaving("saved");
    } catch {
      setSaving("error");
    }
  }

  return (
    <div className="space-y-10">
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-forest/10 bg-white p-6">
        <div>
          <h2 className="font-display text-3xl text-forest">Board Budget</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Committee Save writes {requestYear} packets here. Adjust {operatingYear}{" "}
            year-end forecasts below; those numbers feed every committee page and
            the public budget rollup.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ready && isTreasurer ? (
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-full border border-forest/20 px-4 py-2 text-sm"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login?next=/budget/full"
              className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-forest-deep"
            >
              Treasurer login
            </Link>
          )}
          <Link
            href="/budget"
            className="rounded-full border border-forest/20 px-4 py-2 text-sm"
          >
            Committees
          </Link>
        </div>
      </section>

      <section>
        <h3 className="font-display text-2xl text-forest">
          {requestYear} committee packets
        </h3>
        <div className="mt-4 grid gap-3">
          {volunteer.map((committee) => {
            const request = data.committees[committee.slug];
            return (
              <Link
                key={committee.slug}
                href={`/budget/${committee.slug}`}
                className="grid gap-2 rounded-2xl border border-forest/10 bg-white p-4 sm:grid-cols-[1fr_auto_auto_auto]"
              >
                <div>
                  <p className="font-semibold text-forest">{committee.name}</p>
                  <p className="text-sm text-muted">
                    {request?.chair
                      ? `Chair: ${request.chair}`
                      : "No chair listed yet"}
                  </p>
                  {request?.notes ? (
                    <p className="mt-1 text-sm text-muted">{request.notes}</p>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-wide text-muted uppercase">
                    Request
                  </p>
                  <p className="tabular-nums">{money(requestTotal(request))}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-wide text-muted uppercase">
                    Board revised
                  </p>
                  <p className="tabular-nums">
                    {money(boardRevisedTotal(request))}
                  </p>
                </div>
                <span
                  className={`self-center rounded-full px-3 py-1 text-center text-xs font-semibold tracking-wide uppercase ${
                    request?.status === "submitted"
                      ? "bg-pine text-cream"
                      : "bg-parchment text-forest"
                  }`}
                >
                  {statusLabel(request)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-forest/10 bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl text-forest">
              {operatingYear} year-end forecast
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              Edit an amount and save. Cleared or unchanged auto-projections are
              not stored as overrides. Saved overrides appear on every budget
              view.
            </p>
          </div>
          {isTreasurer ? (
            <button
              type="button"
              onClick={() => void saveForecasts()}
              className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-cream"
            >
              Save forecasts
            </button>
          ) : (
            <p className="text-sm text-muted">
              Log in as treasurer to adjust forecasts.
            </p>
          )}
        </div>
        <p className="mt-2 text-xs text-muted">
          {saving === "saving"
            ? "Saving…"
            : saving === "saved"
              ? "Saved — forecasts now site-wide"
              : saving === "error"
                ? "Could not save forecasts"
                : null}
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="text-left text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="py-2 pr-3">Account</th>
                <th className="py-2 pr-3 text-right">YTD actual</th>
                <th className="py-2 pr-3 text-right">Year-end forecast</th>
                <th className="py-2 text-right">Override?</th>
              </tr>
            </thead>
            <tbody>
              {expenseAccounts.map((account) => {
                const ytd = data.ytdActual[account.id] ?? 0;
                const overridden = data.yeForecast[account.id] != null;
                return (
                  <tr key={account.id} className="border-t border-forest/10">
                    <td className="py-2 pr-3 text-forest">
                      {account.id} {getAccount(account.id)?.name}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {money(ytd)}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {isTreasurer ? (
                        <input
                          type="number"
                          step="1"
                          value={draftForecast[account.id] ?? ""}
                          onChange={(event) =>
                            setDraftForecast((prev) => ({
                              ...prev,
                              [account.id]: event.target.value,
                            }))
                          }
                          className="w-32 rounded-lg border border-forest/15 bg-cream px-2 py-1.5 text-right tabular-nums"
                        />
                      ) : (
                        <span className="tabular-nums">
                          {money(storeYearEndForecast(data, account.id))}
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-right text-xs text-muted">
                      {overridden ? "Yes" : "Auto"}
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
