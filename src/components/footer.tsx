import Link from "next/link";
import { organization } from "@/data/organization";
import { researchEmail } from "@/lib/contact";
import { researchLicence } from "@/lib/licence";
import { ArrowIcon } from "@/components/icons";
import "./footer.css";

export function Footer() {
  const contactEmail = researchEmail();
  return (
    <footer className="site-footer journal-footer">
      <div className="footer-masthead">
        <Link className="wordmark footer-signature" href="/" aria-label="Tharros Canada home">
          <span>THARROS</span>
          <span className="wordmark-slash">/</span>
          <span>CANADA</span>
        </Link>
        <a className="footer-top" href="#main-content">
          Back to top <ArrowIcon />
        </a>
      </div>
      <div className="footer-shell">
        <div className="footer-lead">
          <p>An independent student research project across Canada and Europe.</p>
          <a className="footer-contact" href={`mailto:${contactEmail}`}>
            {contactEmail} <ArrowIcon />
          </a>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <div>
            <p className="footer-heading">Research</p>
            <Link href="/research">Research archive</Link>
            <Link href="/methodology">Sources &amp; methodology</Link>
            <Link href="/about#contact">Questions &amp; corrections</Link>
          </div>
          <div>
            <p className="footer-heading">Project</p>
            <Link href="/about">About</Link>
            <Link href="/about#contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/accessibility">Accessibility</Link>
            <Link href="/copyright">Copyright &amp; licence</Link>
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
