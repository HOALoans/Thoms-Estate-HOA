import type { Metadata } from "next";

import { PageHero, Section } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Association",
};

export default function AssociationPage() {
  return (
    <>
      <PageHero
        kicker="Governance"
        title="The Thoms Estate Homeowner's Association"
        lede="A North Carolina nonprofit corporation that owns the common areas, administers the covenants, and represents every lot owner in the community."
      />
      <Section className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 className="font-display text-3xl text-forest">Membership</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Each purchaser of a lot in The Thoms Estate automatically becomes a
            member of {SITE.legalName}. The association owns and manages the
            common areas set aside for the mutual use of residents — roads and
            related easements, recreational areas, and platted open space.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Those membership rights come with obligations: assessments, care of
            private lots, and respect for the architectural and use standards
            that protect the neighborhood&apos;s character and property values.
          </p>

          <h2 className="font-display mt-10 text-3xl text-forest">
            What the association does
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            <li>Own and maintain common areas and amenities</li>
            <li>Levy and collect assessments for operations and reserves</li>
            <li>Enforce the declaration of covenants</li>
            <li>Administer architectural review through the ARC</li>
            <li>Hold board and membership meetings</li>
            <li>
              Coordinate additional services in The Village (Phase 2), including
              lawn care and certain exterior maintenance
            </li>
          </ul>

          <h2 className="font-display mt-10 text-3xl text-forest">
            The land and its story
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Harold Thoms assembled this North Asheville property as a private
            estate, holding out for rolling land, mountain views, and proximity
            to town. The community that followed is still framed by that
            landscape: Beaver Creek, wooded ridgelines, and 32 acres of
            greenspace. The association&apos;s work is to keep that shared
            setting intact for the people who live here now.
          </p>
        </div>
        <aside className="md:col-span-5">
          <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-sm">
            <p className="text-xs tracking-[0.2em] text-brass-dark uppercase">
              Legal name
            </p>
            <p className="font-display mt-2 text-2xl text-forest">
              {SITE.legalName}
            </p>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-muted">Community</dt>
                <dd className="font-medium text-forest">The Thoms Estate</dd>
              </div>
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="font-medium text-forest">
                  {SITE.physicalAddress.street}, {SITE.physicalAddress.city},{" "}
                  {SITE.physicalAddress.state} {SITE.physicalAddress.zip}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Declarant (as recorded)</dt>
                <dd className="font-medium text-forest">
                  The Gated Communities of Asheville LLC
                </dd>
              </div>
              <div>
                <dt className="text-muted">This domain</dt>
                <dd className="font-medium text-forest">{SITE.domain}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </Section>
    </>
  );
}
