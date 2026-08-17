import type { Metadata } from "next";

import { PageHero, Section } from "@/components/ui";
import { FAQ } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        kicker="Owners"
        title="Frequently asked questions"
        lede="Short answers for the questions new and current owners ask most often."
      />
      <Section>
        <div className="divide-y divide-forest/10 rounded-3xl border border-forest/10 bg-white">
          {FAQ.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="cursor-pointer list-none font-semibold text-forest">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
