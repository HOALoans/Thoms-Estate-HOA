import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, Section } from "@/components/ui";
import { DOCUMENTS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Architectural Review",
};

const steps = [
  {
    n: "01",
    title: "Read the standards",
    body: "Review the covenants and design guidelines before drawing. The ARC applies a community-wide standard, including siting, drainage, materials, and landscaping.",
  },
  {
    n: "02",
    title: "Preliminary review",
    body: "Submit the preliminary application with the non-refundable application fee. The current fee covers preliminary and final review; extra rounds after four submissions may be billed again.",
  },
  {
    n: "03",
    title: "Final review",
    body: "File the final application with product and material information. Do not start construction until the ARC has approved the package.",
  },
  {
    n: "04",
    title: "Construction deposit",
    body: "A construction deposit is due when work begins. It is held for damages, inspection fees, and fines (for example Sunday work, traffic-sign violations, or uncontained jobsite trash).",
  },
];

export default function ArcPage() {
  const forms = DOCUMENTS.filter((doc) => doc.group === "Architectural review");

  return (
    <>
      <PageHero
        kicker="Design review"
        title="Architectural Review Committee"
        lede="The ARC protects the look and value of Thoms Estate. New homes, major additions, and exterior changes need written approval before work starts."
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          <article className="rounded-3xl bg-forest p-6 text-cream md:col-span-1">
            <p className="text-xs tracking-[0.2em] text-brass uppercase">
              Committee chair
            </p>
            <h2 className="font-display mt-3 text-3xl">Alex Brittian</h2>
            <p className="mt-3 text-sm leading-relaxed text-moss">
              Current point of contact for builders and owners preparing to
              build or modify a home in The Thoms Estate.
            </p>
            <a
              href={`mailto:${SITE.arcEmail}`}
              className="mt-5 inline-flex text-sm text-brass underline underline-offset-4"
            >
              {SITE.arcEmail}
            </a>
          </article>
          <div className="md:col-span-2">
            <h2 className="font-display text-3xl text-forest">The process</h2>
            <ol className="mt-6 grid gap-4">
              {steps.map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="font-display text-2xl text-brass-dark">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-semibold text-forest">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <h2 className="font-display mt-14 text-3xl text-forest">Forms & fees</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {forms.map((form) => (
            <li key={form.title}>
              <a
                href={form.href}
                target="_blank"
                rel="noreferrer"
                className="block h-full rounded-2xl border border-forest/10 bg-white p-5 hover:border-brass/60"
              >
                <p className="font-semibold text-forest">{form.title}</p>
                <p className="mt-2 text-sm text-muted">{form.description}</p>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          Make checks payable to <strong>The Thom&apos;s Estate HOA, Inc.</strong>{" "}
          Native planting is encouraged. View protection, erosion control, and
          water conservation are part of landscape review. Questions that are
          not plan-specific can go through the{" "}
          <Link href="/contact" className="underline decoration-brass">
            contact form
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
