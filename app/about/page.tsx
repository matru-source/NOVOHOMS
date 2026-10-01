import type { Metadata } from "next";
import { CTA, PageHero } from "@/components/InnerPage";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About Us — Architectural & Strategic Real Estate Advisory",
  description:
    "Learn about NOVOHOMS: founded by Sheikh Obed Ali & Jigyasha Singh on deliberate advisory, deep market diligence, and curating exceptional properties in Bhubaneswar.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | NOVOHOMS Real Estate Advisory",
    description:
      "Founded on deliberate advisory, deep market diligence, and curating exceptional residential and commercial spaces in Bhubaneswar.",
    url: "https://novohoms.com/about",
    images: [
      {
        url: "/founders.webp",
        width: 1200,
        height: 630,
        alt: "Sheikh Obed Ali & Jigyasha Singh — Co-Founders, NOVOHOMS",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About NOVOHOMS"
        title={
          <>
            Two perspectives.
            <br />
            <em>One clear vision.</em>
          </>
        }
        lead="Born from a shared belief that real estate should be about better decisions—not simply more properties."
      />

      <section className="content-section">
        <div className="content-grid">
          <Reveal>
            <p className="eyebrow">Why we began</p>
            <h2>
              Local depth meets
              <br />
              <em>a wider view.</em>
            </h2>
          </Reveal>
          <Reveal delay={100} className="content-copy">
            <p>
              We&apos;re building a trusted advisory platform where personalised guidance,
              transparent thinking and meaningful opportunities come together.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14 }}>
              Starting in Bhubaneswar, our ambition is to make every property conversation
              simpler, clearer and more purposeful—whether the next move is a home, a business,
              land or an investment.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="founders-showcase-section">
        <div className="founders-container">
          <Reveal>
            <div className="founders-hero-frame">
              <img
                src="/founders.webp"
                alt="Sheikh Obed Ali & Jigyasha Singh — Co-Founders, NOVOHOMS"
                width={1665}
                height={944}
                className="founders-hero-image"
                decoding="async"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="founders-bios-grid">
              <div className="founder-bio-card">
                <h3>Jigyasha Singh</h3>
                <p className="founder-role">Co-Founder | Strategy &amp; Global Perspective</p>
                <p className="founder-desc">
                  Bringing an international perspective and a modern, client-focused approach to real estate.
                </p>
              </div>

              <div className="founder-bio-card">
                <h3>Sheikh Obed Ali</h3>
                <p className="founder-role">Co-Founder | Real Estate &amp; Development</p>
                <p className="founder-desc">
                  With nearly 15 years in Bhubaneswar real estate, bringing deep local understanding across residential, commercial, land, investment, construction and development.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="came-together-section">
        <div className="came-together-grid">
          <Reveal className="came-together-heading">
            <p className="eyebrow" style={{ color: "var(--gold)", marginBottom: 20 }}>
              Why We Came Together
            </p>
            <h2>
              Different Perspectives.<br />One Direction.
            </h2>
          </Reveal>

          <Reveal delay={120} className="came-together-copy">
            <p>
              We saw an opportunity to combine international perspective with deep local understanding.
            </p>
            <p className="highlight-p">
              Jigyasha brings the wider perspective. Obed brings the local insight.
            </p>
            <p>
              Together, we&apos;re building NOVOHOMS to make real estate simpler, more transparent and more purposeful.
            </p>
          </Reveal>
        </div>
      </section>

      <CTA
        title={
          <>
            Find the space that
            <br />
            <em>moves you forward.</em>
          </>
        }
        href="/opportunities"
        label="Explore opportunities"
      />
    </>
  );
}
