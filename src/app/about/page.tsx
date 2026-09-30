import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { ArrowIcon } from "@/components/icons";
import { AboutContact } from "@/components/about-contact";
import { researchEmail } from "@/lib/contact";
import { publishing } from "@/data/publishing";
import "./about.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Tharros Canada is an undergraduate research showcase and searchable database, connecting student work with professional portfolios and authored-work profiles.",
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
        <p>{publishing.missionStatement}</p>
      </section>

      <section className="about-mission about-row" aria-labelledby="mission-title">
        <h2 id="mission-title">Mission</h2>
        <p>Give strong undergraduate work somewhere to go after the grade.</p>
      </section>

      <section className="about-platform about-row" aria-labelledby="platform-title">
        <h2 id="platform-title">Your work, connected</h2>
        <div className="about-platform-body">
          <dl className="about-platform-list">
            <div>
              <dt>A research repository</dt>
              <dd>
                A searchable public database brings papers, research projects, policy briefs, data
                work and other undergraduate academic work together. Readers can find the work,
                understand its evidence and reference it.
              </dd>
            </div>
            <div>
              <dt>A professional portfolio</dt>
              <dd>
                A publication page gives each piece of work a place to be read, cited and shared.
                Students can link their work from résumés, applications and professional portfolios.
              </dd>
            </div>
            <div>
              <dt>An authored-work profile</dt>
              <dd>
                Author profiles connect an author with their published work in a simple,
                LinkedIn-style reference page. Profiles for new student contributors will be
                optional and published with the author’s consent when submissions open.
              </dd>
            </div>
          </dl>
          <div className="about-platform-actions">
            <Link className="text-link" href="/research">
              Explore the research database <ArrowIcon />
            </Link>
            <Link className="text-link" href="/authors">
              Find authors and their work <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="about-standards about-row" aria-labelledby="standards-title">
        <h2 id="standards-title">Editorial standards</h2>
        <p>
          The planned process screens for academic quality, sourcing, originality, clear writing and
          suitability for publication. Submissions may be accepted, accepted with revisions or
          rejected. Authorship and sources stay visible so readers can assess the work for
          themselves. New student submissions are being prepared for launch.
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
            Have a question about the showcase, eligibility or an existing publication? Get in
            touch. Submissions are not open yet; please wait for the submission instructions before
            sending your work. Corrections and questions about published work are welcome.
          </p>
          <AboutContact email={researchEmail()} />
        </div>
      </section>
    </div>
  );
}
