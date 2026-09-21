import Link from "next/link";

export function Footer() {
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
        </div>
        <nav className="footer-links" aria-label="Footer">
          <div>
            <p className="footer-heading">Research</p>
            <Link href="/research">Publications</Link>
            <Link href="/research-areas">Research areas</Link>
            <Link href="/market-explorer">Data</Link>
          </div>
          <div>
            <p className="footer-heading">Commission</p>
            <Link href="/research-services">Services</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/ecommerce-readiness">Cross-border route questions</Link>
            <Link href="/request-research">Commission research</Link>
          </div>
          <div>
            <p className="footer-heading">Company</p>
            <Link href="/about">About</Link>
            <Link href="/methodology">Methodology</Link>
            <Link href="/about#privacy">Privacy</Link>
            <Link href="/about#accessibility">Accessibility</Link>
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
