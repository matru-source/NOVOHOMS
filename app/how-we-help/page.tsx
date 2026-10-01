import type { Metadata } from "next";
import { CTA, InfoCards, PageHero } from "@/components/InnerPage";
import { PrinciplesCollage } from "@/components/PrinciplesCollage";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "How We Help Buyers, Investors & Landowners",
  description:
    "Discover the 4-stage NOVOHOMS advisory framework: goal discovery, curated property options, joint evaluation, and transparent transaction support in Bhubaneswar.",
  alternates: {
    canonical: "/how-we-help",
  },
  openGraph: {
    title: "How We Help | NOVOHOMS Advisory Process",
    description:
      "Discover the 4-stage NOVOHOMS advisory framework: goal discovery, curated property options, joint evaluation, and transparent transaction support in Bhubaneswar.",
    url: "https://novohoms.com/how-we-help",
    images: [
      {
        url: "/difference-built-next.webp",
        width: 1200,
        height: 630,
        alt: "How NOVOHOMS Helps Buyers and Investors",
      },
    ],
  },
};

const process = [
  {
    title: "Understand your goals",
    text: "Every engagement begins with a real conversation about your ambitions, budget, timeline and priorities.",
    image: "/process/1-understand-goals.webp",
  },
  {
    title: "Curate relevant options",
    text: "We identify opportunities that genuinely fit—then present them with the context you need.",
    image: "/process/2-curate-options.webp",
  },
  {
    title: "Evaluate together",
    text: "Location, pricing, track record, legal standing and growth potential are considered carefully.",
    image: "/process/3-evaluate-together.webp",
  },
  {
    title: "Support the decision",
    text: "From negotiation to documentation, we stay close and keep the process transparent.",
    image: "/process/4-support-decision.webp",
  },
  {
    title: "Stay connected",
    text: "Our relationship continues after the transaction, through questions and future decisions.",
    image: "/process/5-stay-connected.webp",
  },
];

export default function HelpPage() {
  return (
    <>
      <PageHero
        eyebrow="Our advisory approach"
        title={
          <>
            Clarity for every
            <br />
            <em>move forward.</em>
          </>
        }
        lead="Significant property decisions deserve context, care and genuine guidance."
      />

      <section className="content-section">
        <div className="content-grid">
          <Reveal>
            <p className="eyebrow">What we do</p>
            <h2>
              Your goals
              <br />
              <em>come first.</em>
            </h2>
          </Reveal>
          <Reveal delay={100} className="content-copy">
            <p>
              We don&apos;t just show properties. We help you understand what you&apos;re really looking for, how the market behaves and what your next move could mean.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="content-section paper">
        <Reveal>
          <p className="eyebrow">The process</p>
          <h2>
            A clear path from
            <br />
            <em>question to decision.</em>
          </h2>
        </Reveal>
        <div style={{ height: 60 }} />
        <InfoCards items={process} />
      </section>

      <section className="content-section">
        <Reveal>
          <p className="eyebrow">The principles</p>
          <h2>
            Honesty. Depth.
            <br />
            <em>Context. Time.</em>
          </h2>
        </Reveal>
        <div style={{ height: 55 }} />
        <PrinciplesCollage />
      </section>

      <CTA
        title={
          <>
            Begin with a
            <br />
            <em>conversation.</em>
          </>
        }
      />
    </>
  );
}

