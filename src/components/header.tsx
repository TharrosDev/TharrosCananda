"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "@/components/icons";

const links: { href: string; label: string; prefetch?: boolean }[] = [
  { href: "/research-services", label: "Services" },
  { href: "/research", label: "Research" },
  { href: "/live-monitor", label: "Live Monitor", prefetch: false },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [openedAt, setOpenedAt] = useState(pathname);
  // Any navigation (logo, back/forward) closes the menu.
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...(headerRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ??
          []),
      ].filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-shell">
        <Link className="wordmark" href="/" aria-label="Tharros Canada home">
          <span>THARROS</span>
          <span className="wordmark-slash">/</span>
          <span>CANADA</span>
        </Link>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="menu-toggle-label">{open ? "Close" : "Menu"}</span>
          <MenuIcon open={open} />
        </button>
        <nav
          id="primary-navigation"
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Primary"
        >
          <div className="nav-links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={link.prefetch}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link className="nav-action" href="/request-research" onClick={() => setOpen(false)}>
            Commission research
          </Link>
        </nav>
      </div>
    </header>
  );
}
