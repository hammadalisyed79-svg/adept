import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Cookie Notice",
  description: `How ${company.name} uses cookies and similar technologies on this website.`,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Cookie Notice"
        description="A clear summary of how this website uses cookies and similar technologies."
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-10 text-base leading-relaxed text-charcoal-muted">
            <p className="text-sm text-charcoal-muted/80">Last updated: 22 September 2026</p>

            <section>
              <h2 className="font-display text-2xl text-charcoal">1. What we use today</h2>
              <p className="mt-3">
                This site primarily relies on technologies that are necessary for security,
                performance, and core functionality — for example session integrity for forms and
                reliable delivery of pages. We do not presently operate advertising cookie networks
                on this website.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">2. Forms and chat</h2>
              <p className="mt-3">
                Inquiry forms and the commercial guidance chat process the information you choose to
                send. That activity is described in our{" "}
                <Link href="/privacy" className="text-charcoal underline underline-offset-2">
                  Privacy Policy
                </Link>
                . Chat conversations are for guidance against published service information and are
                not a substitute for a written quotation.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">3. Hosting and security</h2>
              <p className="mt-3">
                Our hosting and security providers may set strictly necessary cookies or similar
                identifiers to operate the site reliably, manage traffic, and protect against abuse.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">4. Future analytics</h2>
              <p className="mt-3">
                If we introduce optional analytics or marketing measurement tools, we will update
                this notice and, where required, provide appropriate choices before non-essential
                cookies are set.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">5. Managing cookies</h2>
              <p className="mt-3">
                You can control cookies through your browser settings. Blocking essential cookies may
                affect form submission or other site features.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-charcoal">6. Contact</h2>
              <p className="mt-3">
                Questions:{" "}
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
