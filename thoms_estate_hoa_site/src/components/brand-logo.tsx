import Image from "next/image";

export function BrandLogo({
  variant = "white",
  className = "h-12 w-auto",
}: {
  variant?: "white" | "forest";
  className?: string;
}) {
  const src =
    variant === "forest" ? "/brand/logo-forest.png" : "/brand/logo-white.png";

  return (
    <Image
      src={src}
      alt="Thoms Estate, Asheville, North Carolina"
      width={774}
      height={254}
      className={className}
      priority
    />
  );
}
