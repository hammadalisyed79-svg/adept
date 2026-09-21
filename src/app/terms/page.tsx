import type { Metadata } from "next";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of Use for the ${company.name} corporate website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="Draft terms governing use of this website. Requires legal review before public launch."
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-8 text-charcoal-muted leading-relaxed">
            <aside className="border border-champagne/40 bg-ivory px-4 py-3 text-sm text-charcoal">
              LEGAL REVIEW REQUIRED — This document is a working draft and must be reviewed by
              qualified counsel before launch. It is not legal advice.
            </aside>

            <section>
              <h2 className="font-display text-2xl text-charcoal">1. Acceptance</h2>
              <p className="mt-3">
                By accessing this website you agree to these Terms of Use. If you do not agree, do
                not use the site.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">2. B2B information only</h2>
              <p className="mt-3">
                Content on this site describes business services for commercial customers. Website
                materials do not constitute an offer, quotation, warranty, or commitment unless
                confirmed in a separate written commercial agreement.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">3. Inquiries</h2>
              <p className="mt-3">
                Submitting an inquiry does not create a contract. Responses, sampling, pricing, and
                production commitments are subject to assessment and written confirmation.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">4. Accuracy</h2>
              <p className="mt-3">
                We aim to keep information accurate, but capabilities, timelines, and availability
                may change. Unverified corporate claims are intentionally omitted.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">5. Intellectual property</h2>
              <p className="mt-3">
                Website design, text, and branding elements are owned by {company.name} or its
                licensors and may not be reused without permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">6. Limitation of liability</h2>
              <p className="mt-3">
                To the fullest extent permitted by law, {company.name} is not liable for indirect or
                consequential losses arising from use of this website. Liability terms for commercial
                supply are governed by separate contracts.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">7. Contact</h2>
              <p className="mt-3">
                Questions about these terms: {company.email}.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}
