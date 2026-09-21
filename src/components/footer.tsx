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
          <p>Canadian market intelligence for European businesses.</p>
        </div>
        <div className="footer-links" aria-label="Footer">
          <div>
            <p className="footer-heading">Explore</p>
            <Link href="/market-explorer">Market Explorer</Link>
            <Link href="/ecommerce-readiness">E-commerce readiness</Link>
            <Link href="/research-services">Research services</Link>
          </div>
          <div>
            <p className="footer-heading">Organization</p>
            <Link href="/methodology">Sources & methodology</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/about">About</Link>
          </div>
          <div>
            <p className="footer-heading">Start</p>
            <Link href="/request-research">Request research</Link>
            <Link href="/about#privacy">Privacy</Link>
            <Link href="/about#accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
      <div className="footer-legal">
        <p>© {new Date().getFullYear()} Tharros Canada. Independent market-intelligence venture.</p>
        <p>
          Commercial information only. Not legal, tax, customs, financial, immigration, or regulatory advice.
        </p>
      </div>
    </footer>
  );
}
