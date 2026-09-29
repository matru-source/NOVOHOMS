import Link from "next/link";
import { CTA, PageHero } from "@/components/InnerPage";
import { WhatsAppIcon } from "@/components/SiteShell";

export const metadata = { title: "Why Price Isn't the Same as Value" };

export default function ArticlePage() {
  const articleUrl = "https://novohoms.com/insights/the-novohoms-view-price-isnt-the-same-as-value";
  const articleTitle = "Why price isn't the same as value — NOVOHOMS Journal";
  const waShare = `https://wa.me/?text=${encodeURIComponent(`${articleTitle} ${articleUrl}`)}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;

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
        image="https://novohoms.com/airo-assets/images/insights/article-price-vs-value-hero"
      >
        <div className="page-hero-meta">
          <span>Jigyasha Singh</span>
          <span>16 September 2026</span>
          <span>8 min read</span>
        </div>
      </PageHero>
      <article className="content-section article-body">
        <p>
          In real estate, one of the easiest things to discuss is price. What is the asking price?
          What is the price per square foot? What is the value of the land?
        </p>
        <blockquote>
          Price is only one part of the conversation. The more important question is: what creates
          the value behind the number?
        </blockquote>
        <h2>A property is not just a location</h2>
        <p>
          A location can look attractive on a map and still have limited investment logic. To
          understand an opportunity, we need to understand what creates demand around it:
          employment, education, healthcare, connectivity, infrastructure, lifestyle, commercial
          activity—or a combination of several factors.
        </p>
        <h2>Development potential matters</h2>
        <p>
          The same piece of land can have very different value depending on what can actually be
          done with it. Land use, access, road width, development regulations, permissible
          construction and the intended product all influence the economics.
        </p>
        <blockquote>Don&apos;t only ask what this land costs. Ask what this land can become.</blockquote>
        <h2>Infrastructure can change the equation</h2>
        <p>
          A new road, transport connection or major development can alter the accessibility and
          economic activity of an area. But announcements alone do not create an investment
          thesis. The whole chain—from infrastructure to demand to development—has to hold.
        </p>
        <h2>The investor&apos;s perspective</h2>
        <p>
          An opportunity can be attractive and still not suit every investor. Capital appreciation,
          development participation, income, strategic land holding and defined exits each require
          a different lens.
        </p>
        <h2>Why we&apos;re building NOVOHOMS</h2>
        <p>
          Bhubaneswar is developing rapidly. Understanding the city means looking beyond individual
          properties to its micro-markets, infrastructure, development patterns, land economics,
          buyers, developers and investors.
        </p>
        <blockquote>Better questions lead to better decisions.</blockquote>

        <div
          style={{
            marginTop: 60,
            paddingTop: 30,
            borderTop: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".15em",
                fontWeight: 700,
                color: "var(--gold)",
              }}
            >
              Share perspective:
            </span>
            <a
              href={waShare}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 600,
                background: "#2e7d58",
                color: "white",
                padding: "6px 12px",
                borderRadius: 2,
              }}
            >
              <WhatsAppIcon size={14} /> WhatsApp
            </a>
            <a
              href={linkedinShare}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 600,
                background: "#0a66c2",
                color: "white",
                padding: "6px 12px",
                borderRadius: 2,
              }}
            >
              LinkedIn
            </a>
          </div>
          <Link href="/insights" className="text-link">
            ← Back to Journal
          </Link>
        </div>
      </article>
      <CTA title={<>Have a property<br /><em>question?</em></>} />
    </>
  );
}

