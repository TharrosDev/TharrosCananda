import Link from "next/link";
import { organization } from "@/data/organization";
import { publishing } from "@/data/publishing";
import { researchEmail } from "@/lib/contact";
import { researchLicence } from "@/lib/licence";
import { ArrowIcon } from "@/components/icons";
import "./footer.css";

export function Footer() {
  const contactEmail = researchEmail();
  return (
    <footer className="site-footer journal-footer">
      <div className="footer-masthead">
        <Link
          className="wordmark wordmark-publishing footer-signature"
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
        <a className="footer-top" href="#main-content">
          Back to top <ArrowIcon />
        </a>
      </div>
      <div className="footer-shell">
        <div className="footer-lead">
          <p>{publishing.slogan}</p>
          <p className="footer-launch-note">Submissions and pricing are forthcoming.</p>
          <a className="footer-contact" href={`mailto:${contactEmail}`}>
            {contactEmail} <ArrowIcon />
          </a>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <div>
            <p className="footer-heading">Publishing</p>
            <Link href="/research">Publications</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/submit">Submission guidelines</Link>
            <Link href="/methodology">Sources &amp; methodology</Link>
            <Link href="/about#contact">Questions &amp; corrections</Link>
          </div>
          <div>
            <p className="footer-heading">Tharros</p>
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
          {organization.legal?.legalName ?? publishing.name}. Existing research licensed{" "}
          <Link href="/copyright">{researchLicence.short}</Link>.
        </p>
        <p>Professional publishing for undergraduate work. Starting with Canadian students.</p>
      </div>
    </footer>
  );
}
