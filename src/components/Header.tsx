"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { navigation, type NavItem } from "@/lib/navigation";

const childHints: Record<string, string> = {
  "/services/fragrance-trading": "Concentrates & sampling",
  "/services/toll-manufacturing": "Blending to filling",
  "/services/private-label": "Brief to finished goods",
  "/packaging": "Full component range",
  "/packaging/perfume-bottles": "Glass & stock formats",
  "/packaging/caps": "Closures & finishes",
  "/packaging/pumps-and-collars": "Dispensing systems",
  "/packaging/labels-and-stickers": "Print & materials",
  "/packaging/folding-cartons": "Secondary cartons",
  "/packaging/rigid-boxes": "Presentation packaging",
  "/packaging/accessories": "Finishing details",
  "/packaging/complete-packaging-sets": "Coordinated systems",
  "/technology": "Software, web & marketing",
  "/technology/erp": "Custom & third-party ERP",
  "/technology/website-development": "Sites & catalogues",
  "/technology/digital-marketing": "Brand & campaigns",
  "/technology/ai-support": "Chatbots & AI support",
};

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const menuId = useId();
  const quoteHref = pathname.startsWith("/technology")
    ? "/technology/request-quote"
    : "/request-quote";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setExpanded(null);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const parentActive = (item: NavItem) => {
    if (item.matchPrefix) {
      const prefixes = Array.isArray(item.matchPrefix)
        ? item.matchPrefix
        : [item.matchPrefix];
      return prefixes.some((prefix) => pathname.startsWith(prefix));
    }
    return isActive(item.href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-ivory/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6" aria-label="Primary">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <button
                  type="button"
                  className={`whitespace-nowrap text-sm tracking-wide transition-colors duration-soft ${
                    parentActive(item)
                      ? "text-champagne-deep"
                      : "text-charcoal-muted hover:text-charcoal"
                  }`}
                  aria-haspopup="true"
                >
                  {item.label}
                </button>
                <div className="invisible absolute left-0 top-full z-50 min-w-[18rem] translate-y-1 opacity-0 transition-all duration-soft group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <ul className="mt-3 max-h-[70vh] overflow-y-auto border border-charcoal/10 bg-white py-3 shadow-sm">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={`block px-5 py-2.5 transition-colors ${
                            isActive(child.href)
                              ? "bg-ivory text-charcoal"
                              : "text-charcoal-muted hover:bg-ivory hover:text-charcoal"
                          }`}
                        >
                          <span className="block text-sm whitespace-nowrap">{child.label}</span>
                          {childHints[child.href] && (
                            <span className="mt-0.5 block text-xs text-charcoal-muted/80">
                              {childHints[child.href]}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-sm tracking-wide transition-colors duration-soft ${
                  isActive(item.href)
                    ? "text-champagne-deep"
                    : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Button
            href={quoteHref}
            variant="champagne"
            className="px-4 py-2.5 text-xs uppercase tracking-wideish xl:px-5"
          >
            Request a Quote
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-charcoal/15 text-charcoal lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-1.5" aria-hidden>
            <span
              className={`h-px w-full bg-charcoal transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`h-px w-full bg-charcoal transition ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-px w-full bg-charcoal transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        id={menuId}
        className={`border-t border-charcoal/10 bg-ivory lg:hidden ${open ? "block" : "hidden"}`}
      >
        <nav className="mx-auto flex max-w-content flex-col gap-1 px-5 py-4" aria-label="Mobile">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-3 text-left text-base text-charcoal"
                  aria-expanded={expanded === item.label}
                  onClick={() =>
                    setExpanded((v) => (v === item.label ? null : item.label))
                  }
                >
                  {item.label}
                  <span aria-hidden>{expanded === item.label ? "−" : "+"}</span>
                </button>
                {expanded === item.label && (
                  <ul className="mb-2 border-l border-champagne/40 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block py-2.5 text-sm text-charcoal-muted"
                          onClick={closeMenu}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-base text-charcoal"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            href={quoteHref}
            onClick={closeMenu}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 bg-champagne px-6 py-3 text-sm font-medium tracking-wide text-charcoal transition-colors duration-soft hover:bg-champagne-soft"
          >
            Request a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
