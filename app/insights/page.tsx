import Link from "next/link";
import { CTA, PageHero } from "@/components/InnerPage";
import { Reveal } from "@/components/Reveal";

export const metadata = { title: "Journal" };

const perspectiveGuides = [
  {
    num: "01",
    title: ["Market", "intelligence"],
    desc: "Clear, practical thinking for understanding Bhubaneswar's changing real estate landscape.",
    image: "/insights-market-intelligence.png",
    alt: "Market intelligence - Bhubaneswar urban landscape",
  },
  {
    num: "02",
    title: ["Investment", "thinking"],
    desc: "Clear, practical thinking for understanding Bhubaneswar's changing real estate landscape.",
    image: "/insights-investment-thinking.png",
    alt: "Investment thinking - property investment and financial growth",
  },
  {
    num: "03",
    title: ["Location", "guides"],
    desc: "Clear, practical thinking for understanding Bhubaneswar's changing real estate landscape.",
    image: "/insights-location-guides.png",
    alt: "Location guides - prime corridors and masterplans",
  },
  {
    num: "04",
    title: ["Buying", "guides"],
    desc: "Clear, practical thinking for understanding Bhubaneswar's changing real estate landscape.",
    image: "/insights-buying-guides.png",
    alt: "Buying guides - residential and commercial properties",
  },
];

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={
          <>
            The NOVOHOMS
            <br />
            <em>Journal.</em>
          </>
        }
        lead="Real estate perspectives, market insights and ideas for making better property decisions."
      />

      <section className="content-section">
        <Reveal>
          <p className="eyebrow">Latest · The NOVOHOMS View</p>
        </Reveal>
        <Link
          className="article-feature"
          href="/insights/the-novohoms-view-price-isnt-the-same-as-value"
        >
          <div className="article-feature-image" />
          <div>
            <span>Market insights · 8 min read</span>
            <h2>
              Why price isn&apos;t
              <br />
              the same as <em>value.</em>
            </h2>
            <p>
              A deeper look at what creates value in real estate—and why it matters.
            </p>
            <b>Read article ↗</b>
          </div>
        </Link>
      </section>

      <section className="content-section paper">
        <Reveal>
          <p className="eyebrow">What to expect</p>
          <h2>
            Perspectives
            <br />
            <em>worth reading.</em>
          </h2>
        </Reveal>
        <div style={{ height: 55 }} />
        <div className="insights-perspective-grid">
          {perspectiveGuides.map((item, idx) => (
            <Reveal delay={idx * 70} key={item.num}>
              <article className="perspective-card">
                {/* Background photograph extending under the curve */}
                <div className="perspective-card-img-wrap">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className="perspective-card-img"
                  />
                </div>

                {/* Architectural Ivory panel with curved gold divider */}
                <div className="perspective-curve-wrap" aria-hidden="true">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="perspective-curve-svg"
                  >
                    <path
                      d="M -1,-1 L 43,-1 L 43,54 C 43,76 31,96 22,100 L -1,100 Z"
                      fill="#faf7f0"
                    />
                    <path
                      d="M 43,0 L 43,54 C 43,76 31,96 22,100"
                      fill="none"
                      stroke="#c49854"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>

                {/* Left text content panel */}
                <div className="perspective-card-content">
                  <div className="perspective-card-header">
                    <span className="perspective-card-num">{item.num}</span>
                    <span className="perspective-card-line" />
                  </div>
                  <h3 className="perspective-card-title">
                    {item.title[0]}
                    <br />
                    {item.title[1]}
                  </h3>
                  <p className="perspective-card-desc">{item.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA
        title={
          <>
            A property question
            <br />
            <em>right now?</em>
          </>
        }
      />
    </>
  );
}
