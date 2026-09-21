import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { processSteps } from "@/content/process";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "How ADEPT moves from client inquiry to sampling, quotation, manufacturing, and dispatch.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="How we work with business clients"
        description="A structured path designed for procurement clarity. Services are confirmed against each project brief — we only guarantee what has been agreed."
      />
      <Section>
        <Container>
          <ol className="space-y-0">
            {processSteps.map((step, index) => (
              <li
                key={step.number}
                className={`grid gap-4 border-charcoal/10 py-8 md:grid-cols-[6rem_1fr] md:gap-10 ${
                  index < processSteps.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="font-display text-3xl text-champagne-deep">{step.number}</span>
                <div>
                  <h2 className="font-display text-2xl text-charcoal md:text-3xl">{step.title}</h2>
                  <p className="mt-3 max-w-2xl leading-relaxed text-charcoal-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-2xl text-sm text-charcoal-muted">
            Manufacturing and supply commitments begin only after written commercial agreement.
            Sampling availability, lead times, and partner-dependent steps are confirmed during
            requirement assessment.
          </p>
        </Container>
      </Section>
      <QuoteCta title="Begin with a project inquiry" />
    </>
  );
}
