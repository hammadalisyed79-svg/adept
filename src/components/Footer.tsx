"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import {
  company,
  getWhatsAppUrl,
  isTelephonePlaceholder,
  isWhatsAppPlaceholder,
} from "@/lib/company";
import { divisions } from "@/lib/navigation";

function FooterGroup({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `footer-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left md:hidden"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-xs font-medium uppercase tracking-wideish text-champagne-soft">
          {title}
        </span>
        <span className="text-ivory/60" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      <h2 className="hidden text-xs font-medium uppercase tracking-wideish text-champagne-soft md:block md:py-0">
        {title}
      </h2>
      <div id={id} className={`${open ? "block pb-4" : "hidden"} md:block md:pb-0`}>
        {children}
      </div>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-charcoal text-ivory">
      <div className="mx-auto grid max-w-content gap-8 px-5 py-12 md:grid-cols-4 md:gap-12 md:px-8 md:py-16">
        <div className="md:col-span-1">
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70 md:mt-5">
            {company.positioning}
          </p>
        </div>

        <FooterGroup title="Divisions">
          <ul className="space-y-2.5">
            {divisions.map((d) => (
              <li key={d.href}>
                <Link href={d.href} className="text-sm text-ivory/75 transition hover:text-ivory">
                  {d.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/technology" className="text-sm text-ivory/75 transition hover:text-ivory">
                Technology & Growth
              </Link>
            </li>
            <li>
              <Link href="/catalogue" className="text-sm text-ivory/75 transition hover:text-ivory">
                Catalogue
              </Link>
            </li>
            <li>
              <Link href="/industries" className="text-sm text-ivory/75 transition hover:text-ivory">
                Industries
              </Link>
            </li>
            <li>
              <Link href="/process" className="text-sm text-ivory/75 transition hover:text-ivory">
                Our Process
              </Link>
            </li>
          </ul>
        </FooterGroup>

        <FooterGroup title="Company">
          <ul className="space-y-2.5">
            <li>
              <Link href="/about" className="text-sm text-ivory/75 transition hover:text-ivory">
                About
              </Link>
            </li>
            <li>
              <Link href="/insights" className="text-sm text-ivory/75 transition hover:text-ivory">
                Insights
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-ivory/75 transition hover:text-ivory">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/request-quote" className="text-sm text-ivory/75 transition hover:text-ivory">
                Request a Quote
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-sm text-ivory/75 transition hover:text-ivory">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-sm text-ivory/75 transition hover:text-ivory">
                Terms of Use
              </Link>
            </li>
          </ul>
        </FooterGroup>

        <FooterGroup title="Contact" defaultOpen>
          <ul className="space-y-2.5 text-sm text-ivory/75">
            <li>
              <a href={`mailto:${company.email}`} className="transition hover:text-ivory">
                {company.email}
              </a>
            </li>
            {!isTelephonePlaceholder() && (
              <li>
                <a
                  href={`tel:${company.telephone.replace(/\s/g, "")}`}
                  className="transition hover:text-ivory"
                >
                  {company.telephone}
                </a>
              </li>
            )}
            {!isWhatsAppPlaceholder() && (
              <li>
                <a
                  href={getWhatsAppUrl(
                    "Hello ADEPT Fragrances — I would like to discuss a fragrance project.",
                  )}
                  className="transition hover:text-ivory"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            )}
            {company.addressVerified && company.address ? (
              <li className="pt-2 leading-relaxed">{company.address}</li>
            ) : (
              <li className="pt-2 text-ivory/45">Location details available upon request.</li>
            )}
          </ul>
        </FooterGroup>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-content flex-col gap-2 px-5 py-5 text-xs text-ivory/45 md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
          <p>© {year} {company.name}</p>
          <p>B2B fragrance, packaging, and manufacturing solutions.</p>
        </div>
      </div>
    </footer>
  );
}
