"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import {
  isNavChild,
  isNavDivider,
  isNavGroup,
  navigation,
  type NavChild,
  type NavItem,
  type NavMenuEntry,
} from "@/lib/navigation";

function childKey(entry: NavMenuEntry, index: number): string {
  if (isNavDivider(entry)) return `divider-${index}`;
  if (isNavGroup(entry)) return `group-${entry.label}`;
  return entry.href;
}

function blurActiveElement() {
  const active = document.activeElement;
  if (active instanceof HTMLElement) active.blur();
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  /** Desktop flyout — closed after a child link is chosen or route changes. */
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
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

  useEffect(() => {
    setOpen(false);
    setExpanded(null);
    setDesktopOpen(null);
    blurActiveElement();
  }, [pathname]);

  const closeMenu = () => {
    setOpen(false);
    setExpanded(null);
    setDesktopOpen(null);
    blurActiveElement();
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /** Exact match for Technology Overview so nested tech pages do not highlight it. */
  const isChildActive = (href: string) => {
    if (href === "/technology") return pathname === "/technology";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const parentActive = (item: NavItem) => {
    if (item.matchPrefix) {
      const prefixes = Array.isArray(item.matchPrefix)
        ? item.matchPrefix
        : [item.matchPrefix];
      return prefixes.some((prefix) => pathname.startsWith(prefix));
    }
    return isActive(item.href);
  };

  const renderDesktopChildLink = (child: NavChild, indented = false) => (
    <Link
      href={child.href}
      onClick={closeMenu}
      className={`block py-2.5 transition-colors ${
        indented ? "pl-8 pr-5" : "px-5"
      } ${
        isChildActive(child.href)
          ? "bg-ivory text-charcoal"
          : "text-charcoal-muted hover:bg-ivory hover:text-charcoal"
      }`}
    >
      <span className="block text-sm whitespace-nowrap">{child.label}</span>
      {child.hint && (
        <span className="mt-0.5 block text-xs text-charcoal-muted/80">
          {child.hint}
        </span>
      )}
    </Link>
  );

  const renderDesktopEntries = (entries: readonly NavMenuEntry[]) =>
    entries.map((entry, index) => {
      if (isNavDivider(entry)) {
        return (
          <li
            key={childKey(entry, index)}
            role="separator"
            className="my-2 border-t border-charcoal/10"
            aria-hidden
          />
        );
      }

      if (isNavGroup(entry)) {
        return (
          <li key={childKey(entry, index)} className="pt-1">
            <div
              className="px-5 pb-1 pt-2 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-charcoal/55"
              role="presentation"
            >
              {entry.label}
            </div>
            <ul>
              {entry.children.map((child) => (
                <li key={child.href}>{renderDesktopChildLink(child, true)}</li>
              ))}
            </ul>
          </li>
        );
      }

      return (
        <li key={childKey(entry, index)}>{renderDesktopChildLink(entry)}</li>
      );
    });

  const renderMobileEntries = (entries: readonly NavMenuEntry[]) =>
    entries.map((entry, index) => {
      if (isNavDivider(entry)) {
        return (
          <li
            key={childKey(entry, index)}
            role="separator"
            className="my-2 border-t border-champagne/30"
            aria-hidden
          />
        );
      }

      if (isNavGroup(entry)) {
        return (
          <li key={childKey(entry, index)} className="pt-1">
            <div className="py-2 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-charcoal/55">
              {entry.label}
            </div>
            <ul className="border-l border-champagne/40 pl-3">
              {entry.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className={`block py-2.5 text-sm ${
                      isChildActive(child.href)
                        ? "text-charcoal"
                        : "text-charcoal-muted"
                    }`}
                    onClick={closeMenu}
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        );
      }

      if (isNavChild(entry)) {
        return (
          <li key={childKey(entry, index)}>
            <Link
              href={entry.href}
              className={`block py-2.5 text-sm ${
                isChildActive(entry.href)
                  ? "text-charcoal"
                  : "text-charcoal-muted"
              }`}
              onClick={closeMenu}
            >
              {entry.label}
            </Link>
          </li>
        );
      }

      return null;
    });

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-ivory/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6" aria-label="Primary">
          {navigation.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDesktopOpen(item.label)}
                onMouseLeave={() => setDesktopOpen(null)}
              >
                <button
                  type="button"
                  className={`whitespace-nowrap text-sm tracking-wide transition-colors duration-soft ${
                    parentActive(item)
                      ? "text-champagne-deep"
                      : "text-charcoal-muted hover:text-charcoal"
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={desktopOpen === item.label}
                  onClick={() =>
                    setDesktopOpen((v) => (v === item.label ? null : item.label))
                  }
                  onFocus={() => setDesktopOpen(item.label)}
                >
                  {item.label}
                </button>
                <div
                  className={`absolute left-0 top-full z-50 min-w-[18rem] transition-all duration-soft ${
                    desktopOpen === item.label
                      ? "visible translate-y-0 opacity-100"
                      : "invisible pointer-events-none translate-y-1 opacity-0"
                  }`}
                >
                  <ul
                    role="menu"
                    className="mt-3 max-h-[70vh] overflow-y-auto border border-charcoal/10 bg-white py-3 shadow-sm"
                  >
                    {renderDesktopEntries(item.children)}
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
                    {renderMobileEntries(item.children)}
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
