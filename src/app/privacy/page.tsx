import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${company.name} collects and uses information from website visitors, inquiries, and commercial guidance chat.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How we handle information shared through this website, our inquiry forms, and commercial guidance chat."
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-10 text-base leading-relaxed text-charcoal-muted">
            <p className="text-sm text-charcoal-muted/80">Last updated: 22 September 2026</p>

            <section>
              <h2 className="font-display text-2xl text-charcoal">1. Who we are</h2>
              <p className="mt-3">
                This website is operated by {company.name}
                {company.legalNameVerified ? ` (${company.legalName})` : ""}. For privacy questions,
                contact{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-charcoal underline underline-offset-2 hover:text-champagne-deep"
                >
                  {company.email}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">2. Information we collect</h2>
              <p className="mt-3">We may collect:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Business and contact details you submit through inquiry or quotation forms
                  (such as name, company, email, telephone, country, and project requirements).
                </li>
                <li>
                  Messages you send through the on-site commercial guidance chat, used to answer
                  published service questions and guide you to the appropriate quotation path.
                </li>
                <li>
                  Limited technical data for security and reliability (for example hashed network
                  identifiers, browser type, and the page from which a form was submitted).
                </li>
              </ul>
              <p className="mt-3">
                Please do not submit passwords, payment card details, or sensitive identity documents
                through website forms or chat.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">3. How we use information</h2>
              <p className="mt-3">We use the information you provide to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Respond to commercial inquiries and prepare quotations where appropriate</li>
                <li>Operate and improve website forms, chat guidance, and related services</li>
                <li>Protect the site against spam, abuse, and unauthorized activity</li>
                <li>
                  Notify our commercial team, and — when connected — synchronize records with
                  authorized operational systems
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">4. Cookies and similar technologies</h2>
              <p className="mt-3">
                Essential cookies and similar technologies may be used to keep the site secure and
                functional. Analytics or marketing cookies, if introduced later, will be described in
                our{" "}
                <Link href="/cookies" className="text-charcoal underline underline-offset-2">
                  Cookie Notice
                </Link>
                . See that page for current practice.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">5. Sharing</h2>
              <p className="mt-3">
                We do not sell personal information. Inquiry and chat details may be processed by
                trusted infrastructure providers (hosting, email delivery, databases) under
                appropriate arrangements, and by internal commercial systems when integrations are
                active. We do not publish your submissions to other website visitors.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">6. Retention</h2>
              <p className="mt-3">
                We retain inquiry and related records for as long as reasonably needed for commercial
                follow-up, service quality, and legitimate business records, then delete or
                anonymize them when no longer required.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">7. Your choices</h2>
              <p className="mt-3">
                To request access, correction, or deletion of personal data submitted through this
                site — or to ask about applicable rights in your jurisdiction — email{" "}
                {company.email}. We will respond within a reasonable period.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">8. International visitors</h2>
              <p className="mt-3">
                If you access this site from outside the country where our systems are hosted, your
                information may be processed in other locations subject to appropriate safeguards
                and applicable law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">9. Changes</h2>
              <p className="mt-3">
                We may update this Privacy Policy as our services and legal requirements evolve. The
                version published on this page is current as of the date above.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}
