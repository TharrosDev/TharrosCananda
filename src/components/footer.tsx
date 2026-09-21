import Link from "next/link";
import { researchEmail } from "@/lib/contact";

export function Footer() {
  const contactEmail = researchEmail();

  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-lead">
          <Link className="wordmark wordmark-light" href="/">
            <span>THARROS</span>
            <span className="wordmark-slash">/</span>
            <span>CANADA</span>
          </Link>
          <p>Commercial research and intelligence connecting Canada and Europe.</p>
          {contactEmail && <a className="footer-contact" href={`mailto:${contactEmail}`}>{contactEmail}</a>}
        </div>
        <nav className="footer-links" aria-label="Footer">
          <div>
            <p className="footer-heading">Work</p>
            <Link href="/research-services">Services</Link>
            <Link href="/research-areas">Expertise</Link>
            <Link href="/request-research">Commission research</Link>
            <Link href="/how-it-works">How it works</Link>
          </div>
          <div>
            <p className="footer-heading">Evidence</p>
            <Link href="/research">Research archive</Link>
            <Link href="/market-explorer">Market data</Link>
            <Link href="/methodology">Sources & methodology</Link>
          </div>
          <div>
            <p className="footer-heading">Company</p>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/accessibility">Accessibility</Link>
          </div>
        </nav>
      </div>
      <div className="footer-legal">
        <p>© {new Date().getFullYear()} Tharros Canada. Independent commercial research.</p>
        <p>Not legal, tax, regulatory, lobbying or investment advice.</p>
      </div>
    </footer>
  );
}
