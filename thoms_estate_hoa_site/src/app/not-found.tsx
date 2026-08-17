import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs tracking-[0.28em] text-brass-dark uppercase">404</p>
      <h1 className="font-display mt-3 text-4xl text-forest">
        That path is not on the map.
      </h1>
      <p className="mt-3 text-muted">
        The page you requested is not part of the association site.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream"
      >
        Return home
      </Link>
    </div>
  );
}
