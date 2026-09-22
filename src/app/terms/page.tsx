import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms governing use of the ${company.name} corporate website and online inquiry tools.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="The conditions that apply when you visit this website or submit a commercial inquiry."
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-10 text-base leading-relaxed text-charcoal-muted">
            <p className="text-sm text-charcoal-muted/80">Last updated: 22 September 2026</p>

            <section>
              <h2 className="font-display text-2xl text-charcoal">1. Acceptance</h2>
              <p className="mt-3">
                By using this website you agree to these Terms of Use and our{" "}
                <Link href="/privacy" className="text-charcoal underline underline-offset-2">
                  Privacy Policy
                </Link>
                . If you do not agree, please discontinue use of the site.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">2. Business audience</h2>
              <p className="mt-3">
                {company.name} presents fragrance concentrates, packaging components, manufacturing
                support, private-label pathways, and Technology & Growth services for business
                customers. Content is informational and does not constitute a binding offer,
                quotation, or warranty unless confirmed in a separate written commercial agreement.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">3. Inquiries and quotations</h2>
              <p className="mt-3">
                Submitting an inquiry or chat message does not create a contract. Pricing, sampling,
                volumes, lead times, and production commitments are confirmed only through written
                commercial correspondence. Further detail appears in our{" "}
                <Link
                  href="/commercial-terms"
                  className="text-charcoal underline underline-offset-2"
                >
                  Commercial Terms
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">4. Accuracy of information</h2>
              <p className="mt-3">
                We take care to keep website information current and clear. Capabilities,
                availability, and timelines may evolve. Where imagery or descriptions are
                illustrative of category or process, they should be read as guidance rather than a
                depiction of a specific confirmed order or facility commitment.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">5. Acceptable use</h2>
              <p className="mt-3">
                You agree not to misuse this website — including attempting unauthorized access,
                disrupting services, scraping content at scale without permission, or submitting
                unlawful, deceptive, or harmful material through forms or chat.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">6. Intellectual property</h2>
              <p className="mt-3">
                Website design, text, logos, and other brand materials belong to {company.name} or
                its licensors. You may not copy, adapt, or redistribute them without prior written
                consent, except for ordinary browsing and legitimate business evaluation.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">7. Limitation of liability</h2>
              <p className="mt-3">
                To the fullest extent permitted by law, {company.name} is not liable for indirect,
                incidental, or consequential losses arising from use of this website. Liability for
                commercial supply, manufacturing, or technology projects is governed solely by the
                written agreements that apply to those engagements.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">8. Governing framework</h2>
              <p className="mt-3">
                These Terms are intended for use of this website. Disputes relating to commercial
                contracts are resolved under the governing law and forum stated in those contracts.
                Website terms may be updated from time to time; continued use after publication
                constitutes acceptance of the revised version.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">9. Contact</h2>
              <p className="mt-3">
                Questions about these Terms:{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-charcoal underline underline-offset-2"
                >
                  {company.email}
                </a>
                .
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}
