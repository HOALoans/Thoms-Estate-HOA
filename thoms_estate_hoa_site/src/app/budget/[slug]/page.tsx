import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HistoryTable } from "@/components/budget-history";
import { CommitteeWorkspace } from "@/components/committee-workspace";
import { PageHero, Section } from "@/components/ui";
import { committees, getAccount, getCommittee, requestYear } from "@/lib/budget";

type Params = { slug: string };

export function generateStaticParams() {
  return committees.map((committee) => ({ slug: committee.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const committee = getCommittee(slug);
  return { title: committee ? `${committee.name} budget` : "Committee" };
}

export default async function CommitteeBudgetPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const committee = getCommittee(slug);
  if (!committee) notFound();

  return (
    <>
      <PageHero
        kicker={committee.boardManaged ? "Board-held accounts" : "Committee"}
        title={committee.name}
        lede={`${committee.blurb} Enter the ${requestYear} request below after checking how this area has spent against plan.`}
      />
      <Section>
        <p className="mb-6 text-sm">
          <Link href="/budget" className="text-pine underline decoration-brass">
            ← All committees / rolled-up {requestYear} budget
          </Link>
        </p>
        <p className="mb-8 text-sm text-muted">
          Tessier accounts:{" "}
          {committee.accounts
            .map((id) => `${id} ${getAccount(id)?.name ?? ""}`)
            .join(" · ")}
        </p>
        <CommitteeWorkspace committee={committee} />
        <div id="history-table" className="mt-12">
          <h2 className="font-display mb-4 text-3xl text-forest">
            Year-by-year detail
          </h2>
          <HistoryTable committee={committee} />
        </div>
      </Section>
    </>
  );
}
