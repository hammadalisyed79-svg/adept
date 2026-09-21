import Link from "next/link";
import { company } from "@/lib/company";

type LogoProps = {
  className?: string;
  inverted?: boolean;
};

export function Logo({ className = "", inverted = false }: LogoProps) {
  const text = inverted ? "text-ivory" : "text-charcoal";
  const accent = inverted ? "text-champagne-soft" : "text-champagne-deep";

  return (
    <Link
      href="/"
      className={`group inline-flex flex-col ${className}`}
      aria-label={`${company.name} home`}
    >
      <span className={`font-display text-2xl font-semibold tracking-[0.12em] ${text}`}>
        {company.logoPrimary}
      </span>
      <span
        className={`text-[0.65rem] font-sans uppercase tracking-[0.22em] ${accent} transition-colors duration-soft group-hover:text-champagne`}
      >
        {company.logoSecondary}
      </span>
    </Link>
  );
}
