import assert from "node:assert/strict";
import test from "node:test";

import {
  applyYeForecastOverrides,
  emptyStore,
  prepareForBoardBudget,
  storeYearEndForecast,
  type CommitteeRequest,
} from "@/lib/budget";
import {
  mergeCommitteeWrite,
  mergeForecastWrite,
  normalizeStore,
} from "@/lib/budget-store";
import { yearEndForecast } from "@/lib/forecast";

test("committee merge preserves treasurer yeForecast", () => {
  const current = normalizeStore({
    ...emptyStore(),
    yeForecast: { "8500": 12000 },
    committees: {
      safety: {
        status: "submitted",
        chair: "Mark",
        notes: "AED",
        updatedAt: "2026-08-18T00:00:00.000Z",
        lineItems: [
          {
            id: "8543-carry",
            accountId: "8543",
            description: "",
            amount: 400,
            planAmount: 400,
          },
        ],
      },
    },
  });

  const merged = mergeCommitteeWrite(current, {
    committees: {
      landscape: {
        status: "submitted",
        chair: "Ada",
        notes: "",
        updatedAt: "2026-08-24T00:00:00.000Z",
        lineItems: [
          {
            id: "8500-1",
            accountId: "8500",
            description: "Landscape",
            amount: 5000,
          },
        ],
      },
    },
  });

  assert.equal(merged.yeForecast["8500"], 12000);
  assert.equal(merged.committees.safety?.chair, "Mark");
  assert.equal(merged.committees.landscape?.status, "submitted");
  assert.equal(merged.committees.landscape?.lineItems[0]?.amount, 5000);
});

test("prepareForBoardBudget marks Save as submitted for treasurer view", () => {
  const draft: CommitteeRequest = {
    status: "draft",
    chair: "Sam",
    notes: "ready",
    updatedAt: "2026-08-24T00:00:00.000Z",
    lineItems: [
      {
        id: "1",
        accountId: "8543",
        description: "AED",
        amount: 400,
      },
    ],
  };
  const prepared = prepareForBoardBudget(draft, undefined);
  assert.equal(prepared.status, "submitted");
  assert.equal(prepared.lineItems[0]?.planAmount, 400);
});

test("forecast override wins site-wide helper", () => {
  const store = normalizeStore({
    ...emptyStore(),
    ytdActual: { "8500": 7784 },
    asOfMonth: 7,
    yeForecast: { "8500": 15000 },
  });
  assert.equal(storeYearEndForecast(store, "8500"), 15000);
  const auto = yearEndForecast("8500", 7784, 7, null);
  assert.ok(auto > 7784);
});

test("applyYeForecastOverrides clears values that match auto projection", () => {
  const store = emptyStore();
  const accountId = Object.keys(store.ytdActual)[0] ?? "8500";
  const auto = Math.round(storeYearEndForecast({ ...store, yeForecast: {} }, accountId));
  const withOverride = applyYeForecastOverrides(store, { [accountId]: auto + 250 });
  assert.equal(withOverride.yeForecast[accountId], auto + 250);
  const cleared = applyYeForecastOverrides(withOverride, { [accountId]: auto });
  assert.equal(cleared.yeForecast[accountId], undefined);
});

test("forecast merge keeps committees intact", () => {
  const current = normalizeStore({
    ...emptyStore(),
    committees: {
      social: {
        status: "submitted",
        chair: "Pat",
        notes: "",
        updatedAt: "2026-08-18T00:00:00.000Z",
        lineItems: [
          {
            id: "8544-1",
            accountId: "8544",
            description: "Event",
            amount: 900,
          },
        ],
      },
    },
  });
  const next = mergeForecastWrite(current, { "8544": 2200 });
  assert.equal(next.yeForecast["8544"], 2200);
  assert.equal(next.committees.social?.chair, "Pat");
  assert.equal(next.committees.social?.lineItems[0]?.amount, 900);
});
