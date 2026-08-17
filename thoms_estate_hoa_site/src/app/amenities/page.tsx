import type { Metadata } from "next";
import Image from "next/image";

import { PageHero, Section } from "@/components/ui";
import { AMENITIES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Amenities",
};

export default function AmenitiesPage() {
  return (
    <>
      <PageHero
        kicker="Common areas"
        title="Shared ground in a mountain setting"
        lede="Thirty-two acres of parks, gardens, trails, creek, and open space — owned and maintained for every member of the association."
      />
      <div className="relative h-64 w-full sm:h-80">
        <Image
          src="/brand/hero.jpg"
          alt="Blue Ridge sunset from Thoms Estate"
          fill
          className="object-cover object-[center_40%]"
        />
      </div>
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {AMENITIES.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-forest/10 bg-white p-6"
            >
              <h2 className="font-display text-2xl text-forest">{item.title}</h2>
              <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
          The Country Club of Asheville sits less than a mile from the front
          gate and is a separate private club. Membership there is not included
          with association dues. Reserve the pavilion or report a common-area
          issue through the contact page.
        </p>
      </Section>
    </>
  );
}
