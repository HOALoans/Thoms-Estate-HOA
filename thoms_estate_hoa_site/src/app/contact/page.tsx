import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { PageHero, Section } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const address = SITE.physicalAddress;
  const mail = SITE.mailingAddress;

  return (
    <>
      <PageHero
        kicker="Resident services"
        title="Contact the association"
        lede="Write the board, ask about a meeting, report a common-area issue, or start an architectural conversation."
      />
      <Section className="grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <h2 className="font-display text-3xl text-forest">Direct channels</h2>
          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="text-muted">Board</dt>
              <dd>
                <a className="font-medium text-forest" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Architectural Review</dt>
              <dd>
                <a
                  className="font-medium text-forest"
                  href={`mailto:${SITE.arcEmail}`}
                >
                  {SITE.arcEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="font-medium text-forest">{SITE.phone}</dd>
            </div>
            <div>
              <dt className="text-muted">Physical</dt>
              <dd className="font-medium text-forest">
                {address.street}
                <br />
                {address.city}, {address.state} {address.zip}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Mail</dt>
              <dd className="font-medium text-forest">
                {mail.street}
                <br />
                {mail.city}, {mail.state} {mail.zip}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            The phone number and mailing address above are the currently
            published community contacts. Mailboxes for {SITE.email} and{" "}
            {SITE.arcEmail} should be created on this domain as part of launch.
          </p>
        </div>
        <div className="md:col-span-3">
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
