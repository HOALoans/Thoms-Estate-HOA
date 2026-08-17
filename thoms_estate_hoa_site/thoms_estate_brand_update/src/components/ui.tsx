import Image from "next/image";
import Link from "next/link";

export function PageHero({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-forest/10 text-cream">
      <Image
        src="/brand/hero.jpg"
        alt=""
        fill
        className="object-cover object-[center_35%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-forest-deep/75" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="text-xs tracking-[0.28em] text-brass uppercase">{kicker}</p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-moss">{lede}</p>
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 ${className}`}>
      {children}
    </section>
  );
}

export function CardLink({
  href,
  title,
  body,
  external = false,
}: {
  href: string;
  title: string;
  body: string;
  external?: boolean;
}) {
  const className =
    "group block rounded-2xl border border-forest/10 bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-md";

  const content = (
    <>
      <h3 className="font-display text-xl text-forest group-hover:text-pine">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
