import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { company } from "@/lib/company";

export const metadata: Metadata = pageMetadata({
  title: "Commercial Terms",
  description:
    "How ADEPT Fragrances approaches quotation, sampling, supply, delivery, and quality for B2B engagements.",
  path: "/commercial-terms",
});

export default function CommercialTermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Commercial Terms"
        description="How quotation, sampling, supply, and delivery are handled for business engagements with ADEPT Fragrances."
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-10 text-base leading-relaxed text-charcoal-muted">
            <p className="text-sm text-charcoal-muted/80">Last updated: 22 September 2026</p>

            <p>
              These notes describe our usual commercial practice for fragrance concentrates,
              packaging, manufacturing support, private label, and Technology & Growth projects.
              Binding terms for any order or project are set out in the written quotation, purchase
              confirmation, or service agreement that applies to that engagement.
            </p>

            <section>
              <h2 className="font-display text-2xl text-charcoal">1. Quotations</h2>
              <p className="mt-3">
                Website content and chat guidance are informational. Formal pricing, volumes,
                materials, and timelines are issued in writing after we review your brief. A
                quotation is valid only for the period and conditions stated in that document.
              </p>
              <p className="mt-3">
                Begin with a{" "}
                <Link href="/request-quote" className="text-charcoal underline underline-offset-2">
                  product quotation
                </Link>{" "}
                or a{" "}
                <Link
                  href="/technology/request-quote"
                  className="text-charcoal underline underline-offset-2"
                >
                  Technology & Growth consultation
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">2. Sampling</h2>
              <p className="mt-3">
                Fragrance and packaging samples may be arranged where commercially appropriate.
                Sample scope, costs, and evaluation windows are confirmed in writing. Sampling does
                not guarantee subsequent production or supply acceptance.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">3. Supply and manufacturing</h2>
              <p className="mt-3">
                Trading and sourcing relationships differ from toll manufacturing and private-label
                programmes. Scope — including what is traded, developed, blended, filled, or
                packed — is defined per project. Production and dispatch proceed only after written
                commercial agreement and any required approvals.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">4. Delivery and logistics</h2>
              <p className="mt-3">
                Delivery timing, Incoterms, packing standards, and shipping methods are confirmed
                for each order. Published process steps describe our usual pathway; actual schedules
                depend on materials, capacity, and the agreed brief.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">5. Quality and non-conformance</h2>
              <p className="mt-3">
                Quality expectations are established against the approved brief, samples, and
                written specifications. Any concern about delivered goods or services should be
                raised promptly in writing so we can review and respond under the applicable
                contract.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">6. Returns and adjustments</h2>
              <p className="mt-3">
                Because fragrance concentrates, custom packaging, and made-to-order production are
                often project-specific, returns are handled case by case under the relevant
                commercial terms. Unauthorized returns cannot be assumed accepted.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">7. Regulatory materials</h2>
              <p className="mt-3">
                Where required for a confirmed supply relationship, supporting documents such as
                specifications or safety data are shared through the commercial process. Website
                copy does not replace product documentation issued for a specific order.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">8. Technology & Growth projects</h2>
              <p className="mt-3">
                ERP, website, marketing, and AI engagements follow a discovery-to-delivery sequence
                defined in the project proposal. Fees, milestones, and acceptance criteria are those
                stated in the signed statement of work.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">9. Contact</h2>
              <p className="mt-3">
                Commercial questions:{" "}
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
