import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="border-b border-charcoal/10 py-24">
      <Container className="text-center">
        <p className="text-xs uppercase tracking-wideish text-champagne-deep">404</p>
        <h1 className="mt-3 font-display text-4xl text-charcoal">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-charcoal-muted">
          The page you requested is unavailable. Continue from the homepage or request a quote.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Go home</Button>
          <Button href="/request-quote" variant="secondary">
            Request a Quote
          </Button>
        </div>
        <p className="mt-6 text-sm">
          <Link href="/contact" className="underline underline-offset-2">
            Contact us
          </Link>
        </p>
      </Container>
    </div>
  );
}
