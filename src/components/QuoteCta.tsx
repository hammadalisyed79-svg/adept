import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";

export function QuoteCta({
  title = "Ready to discuss your project?",
  description = "Tell us about your fragrance, packaging, manufacturing, or private-label requirements. Our team will respond with next steps.",
  primaryHref = "/request-quote",
  primaryLabel = "Request a Quote",
  secondaryHref = "/contact",
  secondaryLabel = "Contact Us",
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <Section className="bg-charcoal text-ivory">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wideish text-champagne-soft">
              Next step
            </p>
            <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/70">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button href={primaryHref} variant="champagne">
              {primaryLabel}
            </Button>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center border border-ivory/30 px-6 py-3 text-sm text-ivory transition hover:border-ivory hover:bg-ivory/5"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
