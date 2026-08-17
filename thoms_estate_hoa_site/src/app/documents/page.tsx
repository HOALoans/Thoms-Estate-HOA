import type { Metadata } from "next";
import { FileDown } from "lucide-react";

import { PageHero, Section } from "@/components/ui";
import { DOCUMENTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documents",
};

const groups = ["Governing documents", "Architectural review"] as const;

export default function DocumentsPage() {
  return (
    <>
      <PageHero
        kicker="Library"
        title="Association documents"
        lede="Current governing documents and architectural review forms. Meeting minutes, budgets, and insurance certificates can be added here as the board publishes them."
      />
      <Section>
        {groups.map((group) => (
          <div key={group} className="mb-12 last:mb-0">
            <h2 className="font-display text-3xl text-forest">{group}</h2>
            <ul className="mt-5 grid gap-4">
              {DOCUMENTS.filter((doc) => doc.group === group).map((doc) => (
                <li key={doc.title}>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex gap-4 rounded-2xl border border-forest/10 bg-white p-5 transition hover:border-brass/60"
                  >
                    <FileDown className="mt-1 h-5 w-5 shrink-0 text-pine" />
                    <div>
                      <p className="font-semibold text-forest">{doc.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {doc.description}
                      </p>
                      <p className="mt-2 text-xs tracking-wide text-brass-dark uppercase">
                        Open PDF
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="rounded-2xl bg-parchment px-5 py-4 text-sm text-muted">
          Minutes, audited financials, the annual budget, and insurance
          certificates are not yet uploaded. Send files to the board if you
          have a current copy that should appear in this library.
        </p>
      </Section>
    </>
  );
}
