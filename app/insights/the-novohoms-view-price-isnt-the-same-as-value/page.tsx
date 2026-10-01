import Link from "next/link";
import { CTA, PageHero } from "@/components/InnerPage";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/SiteShell";

export const metadata = { title: "Why Price Isn't the Same as Value" };

export default function ArticlePage() {
  const articleUrl =
    "https://novohoms.com/insights/the-novohoms-view-price-isnt-the-same-as-value";
  const articleTitle =
    "Why price isn't the same as value — NOVOHOMS Journal";
  const waShare = `https://wa.me/?text=${encodeURIComponent(
    `${articleTitle} ${articleUrl}`
  )}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    articleUrl
  )}`;

  return (
    <>
      <PageHero
        eyebrow="The NOVOHOMS View · Market insights"
        title={
          <>
            Why price isn&apos;t
            <br />
            <em>the same as value.</em>
          </>
        }
        lead="A deeper look at what really creates value in real estate—and why it matters."
        image="/why-price.webp"
      >
        <div className="page-hero-meta">
          <span>Jigyasha Singh</span>
          <span>16 September 2026</span>
          <span>8 min read</span>
        </div>
      </PageHero>

      <section className="article-showcase-section">
        <div className="article-showcase-container">
          {/* 01 */}
          <Reveal>
            <div className="article-showcase-item has-quote">
              <div className="article-step-col">
                <div className="article-step-marker">
                  <div className="article-step-num-row">
                    <span className="article-step-num">01</span>
                    <span className="article-step-dash" />
                  </div>
                  <div className="article-step-stem" />
                </div>
                <div className="article-step-content">
                  <p className="article-step-text">
                    In real estate, one of the easiest things to discuss is price.
                    What is the asking price? What is the price per square foot?
                    What is the value of the land?
                  </p>
                </div>
              </div>
              <div className="article-quote-card">
                <p className="article-quote-text">
                  Price is only one part of the conversation. The more important
                  question is:{" "}
                  <span className="article-quote-highlight">
                    what creates the value behind the number?
                  </span>
                </p>
              </div>
            </div>
          </Reveal>

          {/* 02 */}
          <Reveal delay={60}>
            <div className="article-showcase-item">
              <div className="article-step-col">
                <div className="article-step-marker">
                  <div className="article-step-num-row">
                    <span className="article-step-num">02</span>
                    <span className="article-step-dash" />
                  </div>
                  <div className="article-step-stem" />
                </div>
                <div className="article-step-content" style={{ maxWidth: 660 }}>
                  <h2 className="article-step-title">
                    A property is not just a location
                  </h2>
                  <p className="article-step-text">
                    A location can look attractive on a map and still have limited
                    investment logic. To understand an opportunity, we need to
                    understand what creates demand around it: employment,
                    education, healthcare, connectivity, infrastructure,
                    lifestyle, commercial activity—or a combination of several
                    factors.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 03 */}
          <Reveal delay={60}>
            <div className="article-showcase-item has-quote">
              <div className="article-step-col">
                <div className="article-step-marker">
                  <div className="article-step-num-row">
                    <span className="article-step-num">03</span>
                    <span className="article-step-dash" />
                  </div>
                  <div className="article-step-stem" />
                </div>
                <div className="article-step-content">
                  <h2 className="article-step-title">
                    Development potential matters
                  </h2>
                  <p className="article-step-text">
                    The same piece of land can have very different value
                    depending on what can actually be done with it. Land use,
                    access, road width, development regulations, permissible
                    construction and the intended product all influence the
                    economics.
                  </p>
                </div>
              </div>
              <div className="article-quote-card">
                <p className="article-quote-text">
                  Don&apos;t only ask what this land costs.
                  <br />
                  <span className="article-quote-highlight">
                    Ask what this land can become.
                  </span>
                </p>
              </div>
            </div>
          </Reveal>

          {/* 04 (Indented) */}
          <Reveal delay={60}>
            <div className="article-showcase-item is-indented">
              <div className="article-step-col">
                <div className="article-step-marker">
                  <div className="article-step-num-row">
                    <span className="article-step-num">04</span>
                    <span className="article-step-dash" />
                  </div>
                  <div className="article-step-stem" />
                </div>
                <div className="article-step-content" style={{ maxWidth: 640 }}>
                  <h2 className="article-step-title">
                    Infrastructure can change the equation
                  </h2>
                  <p className="article-step-text">
                    A new road, transport connection or major development can
                    alter the accessibility and economic activity of an area.
                    But announcements alone do not create an investment thesis.
                    The whole chain—from infrastructure to demand to
                    development—has to hold.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 05 */}
          <Reveal delay={60}>
            <div className="article-showcase-item">
              <div className="article-step-col">
                <div className="article-step-marker">
                  <div className="article-step-num-row">
                    <span className="article-step-num">05</span>
                    <span className="article-step-dash" />
                  </div>
                  <div className="article-step-stem" />
                </div>
                <div className="article-step-content" style={{ maxWidth: 660 }}>
                  <h2 className="article-step-title">
                    The investor&apos;s perspective
                  </h2>
                  <p className="article-step-text">
                    An opportunity can be attractive and still not suit every
                    investor. Capital appreciation, development participation,
                    income, strategic land holding and defined exits each
                    require a different lens.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 06 */}
          <Reveal delay={60}>
            <div className="article-showcase-item has-quote">
              <div className="article-step-col">
                <div className="article-step-marker">
                  <div className="article-step-num-row">
                    <span className="article-step-num">06</span>
                    <span className="article-step-dash" />
                  </div>
                  <div className="article-step-stem" />
                </div>
                <div className="article-step-content">
                  <h2 className="article-step-title">
                    Why we&apos;re building NOVOHOMS
                  </h2>
                  <p className="article-step-text">
                    Bhubaneswar is developing rapidly. Understanding the city
                    means looking beyond individual properties to its
                    micro-markets, infrastructure, development patterns, land
                    economics, buyers, developers and investors.
                  </p>
                </div>
              </div>
              <div className="article-quote-card">
                <p className="article-quote-text">
                  Better questions lead to{" "}
                  <span className="article-quote-highlight">
                    better decisions.
                  </span>
                </p>
              </div>
            </div>
          </Reveal>

          {/* Footer Navigation & Share */}
          <div className="article-footer-nav">
            <div className="article-share-group">
              <span className="article-share-label">Share perspective:</span>
              <a
                href={waShare}
                target="_blank"
                rel="noreferrer"
                className="share-button share-whatsapp"
              >
                <WhatsAppIcon size={14} /> WhatsApp
              </a>
              <a
                href={linkedinShare}
                target="_blank"
                rel="noreferrer"
                className="share-button share-linkedin"
              >
                LinkedIn
              </a>
            </div>
            <Link href="/insights" className="text-link">
              ← Back to Journal
            </Link>
          </div>
        </div>
      </section>

      <CTA
        title={
          <>
            Have a property
            <br />
            <em>question?</em>
          </>
        }
      />
    </>
  );
}
