import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { ArrowIcon } from "@/components/icons";
import { AboutContact } from "@/components/about-contact";
import { researchEmail } from "@/lib/contact";
import "./about.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Tharros Canada: independent student research on the policies, industries and public evidence connecting Canada and Europe.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="about-portrait">
      <header className="about-masthead">
        <h1>About Tharros Canada</h1>
        <p className="about-deck">
          Independent student research on the policies and industries connecting Canada and Europe.
        </p>
        <a className="button-primary" href="#contact">
          Contact <ArrowIcon />
        </a>
      </header>

      <section className="about-introduction about-row" aria-labelledby="about-title">
        <h2 id="about-title">About</h2>
        <p>
          Tharros Canada brings together a curiosity about international affairs and a close reading
          of public evidence. Its reports explore Canada–Europe questions, while data notes examine
          what the available information can tell us.
        </p>
      </section>

      <section className="about-mission about-row" aria-labelledby="mission-title">
        <h2 id="mission-title">Mission</h2>
        <p>
          Make complex questions easier to understand through clear research, transparent sources
          and room for uncertainty.
        </p>
      </section>

      <section className="about-why about-row" aria-labelledby="why-title">
        <h2 id="why-title">Why</h2>
        <p>
          Canada and Europe share connections across trade, security, industry and technology.
          Looking closely at those connections is a way to understand how policy decisions take
          shape, where evidence is useful and which questions deserve another look.
        </p>
      </section>

      <section
        className="about-contact-section about-row"
        id="contact"
        aria-labelledby="contact-title"
      >
        <h2 id="contact-title">Contact</h2>
        <div className="about-contact-body">
          <p>
            Have a question about the research, spotted something that needs a correction, or have
            an idea for a future topic? Get in touch. Questions and fresh perspectives are welcome.
          </p>
          <AboutContact email={researchEmail()} />
        </div>
      </section>
    </div>
  );
}
