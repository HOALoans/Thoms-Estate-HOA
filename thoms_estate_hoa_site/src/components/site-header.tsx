"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { TreeMark } from "@/components/tree-mark";
import { NAV, SITE } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-forest">
          <TreeMark className="h-11 w-11" />
          <span className="leading-tight">
            <span className="font-display block text-lg tracking-wide">
              Thoms Estate
            </span>
            <span className="block text-[11px] font-medium tracking-[0.18em] text-sage uppercase">
              Homeowners Association
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV.filter((item) => item.href !== "/").map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-forest text-cream"
                    : "text-forest/80 hover:bg-parchment hover:text-forest"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-forest/20 text-forest xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-forest/10 bg-cream px-4 py-3 xl:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-forest hover:bg-parchment"
            >
              {item.label}
            </Link>
          ))}
          <p className="px-3 pt-2 text-xs text-muted">{SITE.domain}</p>
        </nav>
      ) : null}
    </header>
  );
}
