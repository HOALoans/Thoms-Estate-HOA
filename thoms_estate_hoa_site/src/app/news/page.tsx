import type { Metadata } from "next";

import { PageHero, Section } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Notices",
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        kicker="Owner notices"
        title="News from the board"
        lede="Official notices, meeting packets, and community updates will be posted here. There are no notices on file yet for this new association site."
      />
      <Section>
        <div className="rounded-3xl border border-dashed border-forest/20 bg-white px-8 py-16 text-center">
          <p className="text-xs tracking-[0.24em] text-brass-dark uppercase">
            Empty on purpose
          </p>
          <h2 className="font-display mt-3 text-3xl text-forest">
            No notices have been published yet.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            When the board has a message for owners — a meeting notice, a
            common-area closure, or an assessment reminder — it will appear on
            this page. Until then, email {SITE.email}.
          </p>
        </div>
      </Section>
    </>
  );
}
