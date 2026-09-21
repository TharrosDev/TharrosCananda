"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "@/components/icons";

const links = [
  { href: "/market-explorer", label: "Market Explorer" },
  { href: "/research-services", label: "Research Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape closes the open menu and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
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
          <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
          <MenuIcon open={open} />
        </button>
        <nav id="primary-navigation" className={open ? "main-nav is-open" : "main-nav"} aria-label="Primary">
          <div className="nav-links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link className="nav-action" href="/request-research" onClick={() => setOpen(false)}>
            Request research
          </Link>
        </nav>
      </div>
    </header>
  );
}
