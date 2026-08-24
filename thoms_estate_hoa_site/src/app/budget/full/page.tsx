import type { Metadata } from "next";

import { BoardBudgetDesk } from "@/components/board-budget-desk";
import { PageHero, Section } from "@/components/ui";
import { operatingYear, requestYear } from "@/lib/budget";

export const metadata: Metadata = {
  title: "Board Budget",
};

export default function BoardBudgetPage() {
  return (
    <>
      <PageHero
        kicker="Treasurer"
        title="Board Budget"
        lede={`Committee Saves land here as ${requestYear} packets. Adjust ${operatingYear} year-end forecasts once; every committee page and rollup reads the same shared store.`}
      />
      <Section>
        <BoardBudgetDesk />
      </Section>
    </>
  );
}
