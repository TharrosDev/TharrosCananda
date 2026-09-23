import Link from "next/link";
import { organization } from "@/data/organization";
import { researchEmail } from "@/lib/contact";
import { researchLicence } from "@/lib/licence";

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
          <p>Independent Canada–Europe research.</p>
          <a className="footer-contact" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <div>
            <p className="footer-heading">Work</p>
            <Link href="/research-services">Services</Link>
            <Link href="/request-research">Commission research</Link>
            <Link href="/how-it-works">How it works</Link>
          </div>
          <div>
            <p className="footer-heading">Evidence</p>
            <Link href="/research">Research archive</Link>
            <Link href="/methodology">Sources & methodology</Link>
          </div>
          <div>
            <p className="footer-heading">Company</p>
            <Link href="/about">About</Link>
            <Link href="/about#contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/accessibility">Accessibility</Link>
            <Link href="/copyright">Copyright & licence</Link>
          </div>
        </nav>
      </div>
      <div className="footer-legal">
        <p>
          <span data-volatile>© {new Date().getFullYear()}</span>{" "}
          {organization.legal?.legalName ?? "Tharros Canada"}. Research licensed{" "}
          <Link href="/copyright">{researchLicence.short}</Link>.
        </p>
        <p>Not legal, tax, regulatory, lobbying or investment advice.</p>
      </div>
    </footer>
  );
}
