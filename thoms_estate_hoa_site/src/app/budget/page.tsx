import type { Metadata } from "next";
import Link from "next/link";

import { BudgetOverview } from "@/components/budget-overview";
import { PageHero, Section } from "@/components/ui";
import { approvedYear, requestYear } from "@/lib/budget";

export const metadata: Metadata = {
  title: "Budget",
};

export default function BudgetPage() {
  return (
    <>
      <PageHero
        kicker="Committee planning"
        title={`${requestYear} budget workspace`}
        lede={`Each committee reviews historical plan vs actual, then enters a ${requestYear} request. This page rolls those packets into one operating budget. ${approvedYear} is the last approved year.`}
      />
      <Section>
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted">
          Historical plan vs actual comes from Tessier year-end board packets
          (Fund Operating Income Statement, accrual with variance, as of
          December). Years on file: 2020, 2021, 2022, 2023, and 2025. 2026 is
          the current approved plan (that year is not closed). A 2024 year-end
          packet was not in the drop. Each committee can start from the 2026
          plan, then Save — that puts the {requestYear} packet on the{" "}
          <Link href="/budget/full" className="underline decoration-brass">
            Board Budget
          </Link>{" "}
          for the treasurer. Treasurer year-end forecast adjustments on that
          page apply site-wide.{" "}
          <Link href="/documents" className="underline decoration-brass">
            Public governing documents stay on the documents page.
          </Link>
        </p>
        <BudgetOverview />
      </Section>
    </>
  );
}
