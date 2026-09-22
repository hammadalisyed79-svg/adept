import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  company,
  getWhatsAppUrl,
  isTelephonePlaceholder,
  isWhatsAppPlaceholder,
} from "@/lib/company";
import { divisions } from "@/lib/navigation";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-charcoal text-ivory">
      <div className="mx-auto grid max-w-content gap-12 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <Logo inverted />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">
            {company.positioning}
          </p>
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-wideish text-champagne-soft">
            Divisions
          </h2>
          <ul className="mt-4 space-y-2.5">
            {divisions.map((d) => (
              <li key={d.href}>
                <Link href={d.href} className="text-sm text-ivory/75 transition hover:text-ivory">
                  {d.title}
                </Link>
              </li>
            ))}
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
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-wideish text-champagne-soft">
            Company
          </h2>
          <ul className="mt-4 space-y-2.5">
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
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-wideish text-champagne-soft">
            Contact
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/75">
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
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-content flex-col gap-2 px-5 py-6 text-xs text-ivory/45 md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            © {year} {company.name}. {company.tagline}
          </p>
          <p>B2B fragrance, packaging, and manufacturing solutions.</p>
        </div>
      </div>
    </footer>
  );
}
