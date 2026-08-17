import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { NAV, SITE } from "@/lib/site";

export function SiteFooter() {
  const address = SITE.physicalAddress;
  const mail = SITE.mailingAddress;

  return (
    <footer className="mt-auto bg-forest-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div>
            <BrandLogo className="h-14 w-auto" />
            <p className="mt-3 text-xs tracking-[0.16em] text-moss uppercase">
              {SITE.legalName}
            </p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-moss">
            Serving owners of Thoms Estate in North Asheville. This site is the
            association home for documents, architectural review, meetings, and
            resident notices.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">
            Visit
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {NAV.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brass">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">
            Reach the board
          </p>
          <address className="mt-3 space-y-2 text-sm not-italic text-moss">
            <p>
              {address.street}
              <br />
              {address.city}, {address.state} {address.zip}
            </p>
            <p>
              Mail: {mail.street}
              <br />
              {mail.city}, {mail.state} {mail.zip}
            </p>
            <p>
              <a className="text-cream hover:text-brass" href={`tel:+18283488014`}>
                {SITE.phone}
              </a>
            </p>
            <p>
              <a
                className="text-cream hover:text-brass"
                href={`mailto:${SITE.email}`}
              >
                {SITE.email}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-moss sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}
          </p>
          <p>
            Looking for homes for sale? Visit the developer site at{" "}
            <a
              className="text-cream underline decoration-brass/60 underline-offset-2 hover:text-brass"
              href={SITE.salesSite}
              target="_blank"
              rel="noreferrer"
            >
              thomsestate.com
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
