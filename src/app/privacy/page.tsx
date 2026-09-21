import type { Metadata } from "next";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${company.name} website inquiries and communications.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Draft policy for website visitors and inquiry submitters. Requires legal review before public launch."
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-8 text-charcoal-muted leading-relaxed">
            <aside className="border border-champagne/40 bg-ivory px-4 py-3 text-sm text-charcoal">
              LEGAL REVIEW REQUIRED — This document is a working draft and must be reviewed by
              qualified counsel before launch. It is not legal advice.
            </aside>

            <section>
              <h2 className="font-display text-2xl text-charcoal">1. Who we are</h2>
              <p className="mt-3">
                This website is operated by {company.name} ({company.displayDescriptor}). Contact:{" "}
                {company.email}.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">2. Information we collect</h2>
              <p className="mt-3">
                When you submit an inquiry or contact form, we collect the business and contact
                details you provide (such as name, company, email, telephone, country, project
                requirements, and related optional fields). We may also store technical metadata
                such as a hashed network identifier, user agent, and source page for abuse
                prevention and operational troubleshooting.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">3. How we use information</h2>
              <p className="mt-3">
                Inquiry data is used to respond to your request, prepare commercial follow-up,
                prevent spam and abuse, and — when configured — notify internal sales channels or
                synchronize with an authorized ERP system.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">4. Sharing</h2>
              <p className="mt-3">
                We do not publish inquiry records to other website visitors. Data may be processed
                by infrastructure providers (hosting, email, database) under contractual
                arrangements, and by an ERP when integration is connected.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">5. Retention</h2>
              <p className="mt-3">
                Inquiry records are retained as needed for commercial follow-up and legitimate
                business records. Retention periods should be confirmed during legal review.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">6. Your choices</h2>
              <p className="mt-3">
                To update or inquire about personal data submitted through this site, contact{" "}
                {company.email}. Additional rights may apply depending on your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">7. Changes</h2>
              <p className="mt-3">
                This policy may be updated as operations and legal requirements evolve. The version
                published on this page is the current draft.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}
