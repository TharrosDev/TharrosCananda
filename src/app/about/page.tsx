import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { ArrowIcon } from "@/components/icons";
import { AboutContact } from "@/components/about-contact";
import { researchEmail } from "@/lib/contact";
import { publishing } from "@/data/publishing";
import "./about.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Tharros Undergraduate Publishing helps strong undergraduate work become professional publications students can share beyond the classroom. Preparing for launch.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="about-portrait">
      <header className="about-masthead">
        <h1>About {publishing.name}</h1>
        <p className="about-deck">
          Strong undergraduate work deserves a life beyond the classroom.
        </p>
        <a className="button-primary" href="#contact">
          Contact <ArrowIcon />
        </a>
      </header>

      <section className="about-introduction about-row" aria-labelledby="about-title">
        <h2 id="about-title">The idea</h2>
        <p>
          Tharros Undergraduate Publishing is preparing to launch a professional publishing platform
          for undergraduate students. We will turn accepted research papers, essays, policy briefs,
          data projects and other original academic work into polished, publicly accessible
          publications. Our initial audience is Canadian university students, across disciplines.
        </p>
      </section>

      <section className="about-mission about-row" aria-labelledby="mission-title">
        <h2 id="mission-title">Mission</h2>
        <p>Give strong undergraduate work somewhere to go after the grade.</p>
      </section>

      <section className="about-why about-row" aria-labelledby="why-title">
        <h2 id="why-title">Beyond the classroom</h2>
        <p>
          You have already done the research and written the paper. A carefully prepared publication
          gives you a piece of work to share in your portfolio, link on your résumé or LinkedIn
          profile, and discuss in internship, scholarship or graduate-school applications. Readers
          get access to the work itself, its sources and its author.
        </p>
      </section>

      <section className="about-standards about-row" aria-labelledby="standards-title">
        <h2 id="standards-title">Editorial standards</h2>
        <p>
          The planned process screens for academic quality, sourcing, originality, clear writing and
          suitability for publication. Submissions may be accepted, accepted with revisions or
          rejected. Professional presentation begins with legitimate student work and a clear
          editorial decision. Submissions and publication pricing are forthcoming.
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
            Have a question about the publishing platform, eligibility or an existing publication?
            Get in touch. Submissions are not open yet; please wait for the submission instructions
            before sending a paper. Corrections and questions about published work are welcome.
          </p>
          <AboutContact email={researchEmail()} />
        </div>
      </section>
    </div>
  );
}
