import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Board of Directors",
};

const seats = [
  { role: "President", name: "To be published by the association" },
  { role: "Vice President", name: "To be published by the association" },
  { role: "Secretary / Treasurer", name: "To be published by the association" },
  {
    role: "Architectural Review Committee Chair",
    name: "Alex Brittian",
    note: "Point of contact for new construction and exterior design review.",
  },
];

export default function BoardPage() {
  return (
    <>
      <PageHero
        kicker="Leadership"
        title="Board of Directors"
        lede="The association is governed by its Board of Directors. Officer names will be posted here as the board confirms the public roster for this site."
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {seats.map((seat) => (
            <article
              key={seat.role}
              className="rounded-2xl border border-forest/10 bg-white p-6"
            >
              <p className="text-xs tracking-[0.2em] text-brass-dark uppercase">
                {seat.role}
              </p>
              <h2 className="font-display mt-2 text-2xl text-forest">
                {seat.name}
              </h2>
              {seat.note ? (
                <p className="mt-2 text-sm text-muted">{seat.note}</p>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  Email the board if you need a current officer name before this
                  roster is updated.
                </p>
              )}
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-3xl bg-parchment p-8">
          <h2 className="font-display text-3xl text-forest">
            How owners participate
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted">
            Members in good standing are entitled to vote as provided in the
            declaration. Board meetings, the annual meeting, and special
            meetings will be listed on the calendar. Owners may also write the
            board between meetings.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/calendar"
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream"
            >
              Meeting calendar
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-forest/20 px-5 py-2.5 text-sm text-forest"
            >
              Contact the board
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
