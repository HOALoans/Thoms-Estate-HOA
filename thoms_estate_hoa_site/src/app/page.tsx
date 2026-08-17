import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  FileText,
  Landmark,
  Mail,
  MapPin,
  Trees,
} from "lucide-react";

import { CardLink, Section } from "@/components/ui";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-forest-deep text-cream">
        <Image
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80"
          alt="Blue Ridge mountain ridgeline at dusk"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/30 via-forest-deep/55 to-forest-deep" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-xs tracking-[0.32em] text-brass uppercase">
            Asheville, North Carolina
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-5xl leading-[1.05] sm:text-7xl">
            A mountain neighborhood, tended by its owners.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-moss">
            {SITE.tagline} Documents, architectural review, meetings, and
            common-area information for The Thoms Estate — minutes from downtown
            Asheville, along Beaver Creek.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/documents"
              className="rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-forest-deep hover:bg-cream"
            >
              Association documents
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-cream/30 px-5 py-2.5 text-sm text-cream hover:bg-cream/10"
            >
              Contact the board
            </Link>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          <CardLink
            href="/budget"
            title="Committee budgets"
            body="See historical plan vs actual and submit next year’s request. The treasurer page rolls packets into one budget."
          />
          <CardLink
            href="/documents"
            title="Governing documents"
            body="Covenants, design guidelines, and ARC applications in one place."
          />
          <CardLink
            href="/architectural-review"
            title="Architectural review"
            body="How to submit plans, fees, deposits, and who currently chairs the ARC."
          />
        </div>
      </Section>

      <section className="bg-parchment/70">
        <Section className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.24em] text-brass-dark uppercase">
              Why this site exists
            </p>
            <h2 className="font-display mt-2 text-4xl text-forest">
              Built for homeowners, not for sales.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              The Thoms Estate Homeowner&apos;s Association, Inc. owns and cares
              for the common areas, enforces the covenants, and reviews
              architectural changes. This domain —{" "}
              <strong>{SITE.domain}</strong> — is the association&apos;s public
              home.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Homes for sale, builder information, and inventory remain on the
              developer website. Owners come here for the business of living in
              the neighborhood.
            </p>
            <Link
              href="/association"
              className="mt-6 inline-flex text-sm font-semibold text-pine underline decoration-brass underline-offset-4"
            >
              How the association works
            </Link>
          </div>
          <ul className="grid gap-4">
            {[
              {
                icon: Landmark,
                title: "Board & governance",
                body: "Officers, meetings, and how members participate.",
              },
              {
                icon: FileText,
                title: "A living document library",
                body: "Recorded covenants and current ARC forms.",
              },
              {
                icon: CalendarDays,
                title: "Notices & calendar",
                body: "Board meetings, annual meeting, and community events.",
              },
              {
                icon: Trees,
                title: "Shared landscape",
                body: "Trails, pavilion, courts, and Beaver Creek open space.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-2xl bg-white/80 p-4 shadow-sm"
              >
                <item.icon className="mt-0.5 h-5 w-5 text-pine" />
                <div>
                  <p className="font-semibold text-forest">{item.title}</p>
                  <p className="text-sm text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </section>

      <Section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-forest p-8 text-cream">
          <MapPin className="h-6 w-6 text-brass" />
          <h2 className="font-display mt-4 text-3xl">Find us</h2>
          <p className="mt-3 text-moss">
            {SITE.physicalAddress.street}
            <br />
            {SITE.physicalAddress.city}, {SITE.physicalAddress.state}{" "}
            {SITE.physicalAddress.zip}
          </p>
          <p className="mt-4 text-sm text-moss">
            From downtown, follow Merrimon Avenue to Beaverdam Road, then Elk
            Mountain Scenic Highway. The French Willow Drive gate is on the
            right.
          </p>
        </div>
        <div className="rounded-3xl border border-forest/10 bg-white p-8">
          <Mail className="h-6 w-6 text-pine" />
          <h2 className="font-display mt-4 text-3xl text-forest">
            Write the board
          </h2>
          <p className="mt-3 text-muted">
            Questions about dues, meetings, common areas, or covenants can go
            to {SITE.email}. Architectural packages go to the ARC.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream hover:bg-pine"
          >
            Open the contact form
          </Link>
        </div>
      </Section>
    </>
  );
}
