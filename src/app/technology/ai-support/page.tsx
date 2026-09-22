import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { TechnologyVisual } from "@/components/media/TechnologyVisual";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { aiHowWeDeliver, aiOfferings } from "@/content/technology";

export const metadata: Metadata = {
  title: "AI Support & Chatbots",
  description:
    "AI-assisted customer support and website chatbots for fragrance and B2B brands — lead capture, guided answers, and human handoff.",
  alternates: { canonical: "/technology/ai-support" },
};

export default function TechnologyAiSupportPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Support & Chatbots"
        title="Assist visitors. Capture interest. Hand off with clarity."
        description="Website chatbots and AI support that answer common questions, collect project details, and connect serious enquiries to your team."
        visual={
          <TechnologyVisual variant="ai" aspectClassName="aspect-[4/3] lg:aspect-[5/4]" />
        }
      />

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What AI support can cover"
            description="Each chatbot is scoped to your approved content and commercial rules — so answers stay useful and controlled."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {aiOfferings.map((o) => (
              <div key={o.title} className="border border-charcoal/10 bg-white p-6">
                <h3 className="font-display text-xl text-charcoal">{o.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{o.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="How We Deliver"
              title="From brief to a working assistant"
              description="A practical sequence to launch AI support without over-promising what automation can decide alone."
            />
            <ol className="mt-10 space-y-5">
              {aiHowWeDeliver.map((step, i) => (
                <li key={step.title} className="border-l-2 border-champagne pl-5">
                  <p className="text-xs uppercase tracking-wideish text-champagne-deep">
                    Step 0{i + 1}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-charcoal">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <TechnologyVisual variant="ai" aspectClassName="aspect-[4/3]" />
        </Container>
      </Section>

      <QuoteCta
        title="Discuss AI support or a chatbot"
        description="Tell us about your website, common visitor questions, and how you want leads handed to sales. We respond by email."
        primaryHref="/technology/request-quote"
        primaryLabel="Request Technology Quote"
        showEmail
      />
    </>
  );
}
