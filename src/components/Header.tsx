"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { navigation } from "@/lib/navigation";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navigation.map((item) =>
            "children" in item && item.children ? (
              <div key={item.href} className="relative group">
                <button
                  type="button"
                  className={`text-sm tracking-wide transition-colors duration-soft ${
                    pathname.startsWith("/services")
                      ? "text-champagne-deep"
                      : "text-charcoal-muted hover:text-charcoal"
                  }`}
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  {item.label}
                </button>
                <div className="invisible absolute left-0 top-full min-w-[14rem] translate-y-2 opacity-0 transition-all duration-soft group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <ul className="mt-3 border border-charcoal/10 bg-white py-2 shadow-sm">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={`block px-4 py-2.5 text-sm transition-colors ${
                            isActive(child.href)
                              ? "bg-ivory text-charcoal"
                              : "text-charcoal-muted hover:bg-ivory hover:text-charcoal"
                          }`}
                        >
                          {child.label}
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
                className={`text-sm tracking-wide transition-colors duration-soft ${
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

        <div className="hidden lg:block">
          <Button href="/request-quote" variant="champagne" className="px-5 py-2.5 text-xs uppercase tracking-wideish">
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
            <span className={`h-px w-full bg-charcoal transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-px w-full bg-charcoal transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-full bg-charcoal transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        id={menuId}
        className={`border-t border-charcoal/10 bg-ivory lg:hidden ${open ? "block" : "hidden"}`}
      >
        <nav className="mx-auto flex max-w-content flex-col gap-1 px-5 py-4" aria-label="Mobile">
          {navigation.map((item) =>
            "children" in item && item.children ? (
              <div key={item.href}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-3 text-left text-base text-charcoal"
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen((v) => !v)}
                >
                  {item.label}
                  <span aria-hidden>{servicesOpen ? "−" : "+"}</span>
                </button>
                {servicesOpen && (
                  <ul className="mb-2 border-l border-champagne/40 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block py-2 text-sm text-charcoal-muted"
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
            href="/request-quote"
            onClick={closeMenu}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-champagne px-6 py-3 text-sm font-medium tracking-wide text-charcoal transition-colors duration-soft hover:bg-champagne-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
          >
            Request a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
