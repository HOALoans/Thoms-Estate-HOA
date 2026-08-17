import type { Metadata } from "next";

import { PageHero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Calendar",
};

const upcoming = [
  {
    when: "To be scheduled",
    title: "Regular board meeting",
    where: "Location to be posted",
    detail:
      "Agenda, packet, and Zoom/in-person details will appear here once the board sets the next date.",
  },
  {
    when: "Annual",
    title: "Annual meeting of members",
    where: "To be noticed in writing",
    detail:
      "The annual meeting is noticed according to the bylaws and declaration. Owners in good standing may vote.",
  },
];

export default function CalendarPage() {
  return (
    <>
      <PageHero
        kicker="Meetings & events"
        title="Association calendar"
        lede="Board meetings, the annual meeting, and community gatherings. This page starts empty of specific dates so nothing here is invented."
      />
      <Section>
        <div className="grid gap-4">
          {upcoming.map((event) => (
            <article
              key={event.title}
              className="grid gap-4 rounded-2xl border border-forest/10 bg-white p-6 md:grid-cols-[10rem_1fr]"
            >
              <p className="text-sm font-semibold tracking-wide text-brass-dark uppercase">
                {event.when}
              </p>
              <div>
                <h2 className="font-display text-2xl text-forest">
                  {event.title}
                </h2>
                <p className="mt-1 text-sm text-sage">{event.where}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {event.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          Pavilion reservations and neighborhood events can be requested through
          the contact form. Please do not treat the developer sales calendar as
          the official association calendar.
        </p>
      </Section>
    </>
  );
}
