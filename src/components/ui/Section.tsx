import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-content px-5 md:px-8 ${className}`}>{children}</div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-wideish text-champagne-deep">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl leading-tight text-charcoal md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-charcoal-muted md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-charcoal/10 bg-gradient-to-b from-ivory to-ivory-soft">
      <Container className="py-16 md:py-20">
        {eyebrow && (
          <p className="mb-3 text-xs font-medium uppercase tracking-wideish text-champagne-deep">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl font-display text-4xl leading-tight text-charcoal md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal-muted">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
