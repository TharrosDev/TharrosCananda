"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "@/components/icons";
import { publishing } from "@/data/publishing";

const links: { href: string; label: string; description: string; prefetch?: boolean }[] = [
  { href: "/research", label: "Publications", description: "Explore the publication archive" },
  {
    href: "/how-it-works",
    label: "How it works",
    description: "From undergraduate work to publication",
  },
  { href: "/about", label: "About", description: "Our mission and how to get in touch" },
  {
    href: "/submit",
    label: "Submission guidelines",
    description: "Prepare your work; submissions are forthcoming",
  },
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
    const desktop = window.matchMedia("(min-width: 1021px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onResize);
    // Locks page scroll behind the mobile sheet (CSS: html[data-menu-open]).
    document.documentElement.setAttribute("data-menu-open", "");
    const background = [...document.querySelectorAll<HTMLElement>("main, .site-footer")];
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
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
      document.documentElement.removeAttribute("data-menu-open");
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
    };
  }, [open]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-shell">
        <Link
          className="wordmark wordmark-publishing"
          href="/"
          aria-label={`${publishing.name} home`}
        >
          <span>THARROS</span>
          <span className="wordmark-slash" aria-hidden="true">
            /
          </span>
          <span className="wordmark-subtitle">
            <span>Undergraduate</span>
            <span>Publishing</span>
          </span>
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
                className={link.href === "/submit" ? "nav-submit" : undefined}
                prefetch={link.prefetch}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>{link.label}</span>
                <small className="nav-description" aria-hidden="true">
                  {link.description}
                </small>
              </Link>
            ))}
          </div>
          <p className="nav-project-note">Professional publishing for undergraduate work.</p>
        </nav>
      </div>
    </header>
  );
}
