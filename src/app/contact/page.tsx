import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section } from "@/components/ui/Section";
import {
  company,
  getWhatsAppUrl,
  isTelephonePlaceholder,
  isWhatsAppPlaceholder,
} from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${company.name} for fragrance trading, toll manufacturing, and private-label inquiries.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to our commercial team"
        description="Use the inquiry form for project briefs, or reach us by the channels listed below once verified."
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.3fr]">
          <aside className="space-y-8">
            <div>
              <h2 className="font-display text-2xl text-charcoal">Direct channels</h2>
              <ul className="mt-5 space-y-4 text-sm text-charcoal-muted">
                <li>
                  <span className="block text-xs uppercase tracking-wideish text-champagne-deep">
                    Email
                  </span>
                  <a
                    href={`mailto:${company.email}`}
                    className="mt-1 inline-block text-charcoal underline-offset-2 hover:underline"
                  >
                    {company.email}
                  </a>
                </li>
                {!isTelephonePlaceholder() ? (
                  <li>
                    <span className="block text-xs uppercase tracking-wideish text-champagne-deep">
                      Telephone
                    </span>
                    <a
                      href={`tel:${company.telephone.replace(/\s/g, "")}`}
                      className="mt-1 inline-block text-charcoal underline-offset-2 hover:underline"
                    >
                      {company.telephone}
                    </a>
                  </li>
                ) : (
                  <li>
                    <span className="block text-xs uppercase tracking-wideish text-champagne-deep">
                      Telephone
                    </span>
                    <p className="mt-1 text-sm text-charcoal-muted">
                      Production telephone pending configuration.
                    </p>
                  </li>
                )}
                {!isWhatsAppPlaceholder() ? (
                  <li>
                    <span className="block text-xs uppercase tracking-wideish text-champagne-deep">
                      WhatsApp
                    </span>
                    <div className="mt-2">
                      <Button
                        href={getWhatsAppUrl(
                          "Hello ADEPT Fragrances — I would like to make an inquiry.",
                        )}
                        variant="champagne"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Message on WhatsApp
                      </Button>
                    </div>
                  </li>
                ) : (
                  <li>
                    <span className="block text-xs uppercase tracking-wideish text-champagne-deep">
                      WhatsApp
                    </span>
                    <p className="mt-1 text-sm text-charcoal-muted">
                      WhatsApp number pending configuration.
                    </p>
                  </li>
                )}
              </ul>
            </div>

            <div className="border border-charcoal/10 bg-white p-6">
              <h3 className="font-display text-xl text-charcoal">Location</h3>
              {company.addressVerified && company.address ? (
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted whitespace-pre-line">
                  {company.address}
                </p>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">
                  A verified public address will be published once confirmed. Location details can
                  be shared during commercial discussions.
                </p>
              )}
            </div>

            <p className="text-sm text-charcoal-muted">
              Prefer a structured quotation brief?{" "}
              <a href="/request-quote" className="text-charcoal underline underline-offset-2">
                Open Request a Quote
              </a>
              .
            </p>
          </aside>

          <InquiryForm sourcePage="/contact" />
        </Container>
      </Section>
    </>
  );
}
