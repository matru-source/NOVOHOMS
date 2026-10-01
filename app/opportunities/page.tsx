import Link from "next/link";
import { PageHero, CTA } from "@/components/InnerPage";
import { OpportunitiesListing } from "@/components/OpportunitiesListing";
import { Reveal } from "@/components/Reveal";
import { properties } from "@/data/site";
import { ensureInitialOpportunities, listOpportunities, ManagedOpportunity } from "@/lib/opportunity-store";

export const metadata = { title: "Opportunities" };
export const dynamic = "force-dynamic";

const expandingCategories = [
  {
    title: "Land & plots",
    desc: "Curated parcels and residential layouts.",
    image: "/portfolio/land-plots.webp",
    alt: "Master-planned land and residential plots in Bhubaneswar",
    href: "/opportunities?category=Land%20%26%20plots#opportunities-list",
    actionLabel: "Explore land & plots",
  },
  {
    title: "Commercial spaces",
    desc: "Prime corporate offices and retail destinations.",
    image: "/portfolio/commercial-spaces.webp",
    alt: "Modern premium commercial office and retail spaces in Bhubaneswar",
    href: "/opportunities?category=Commercial#opportunities-list",
    actionLabel: "Explore commercial",
  },
  {
    title: "Investment opportunities",
    desc: "Strategic capital growth and yield assets.",
    image: "/portfolio/investment-opportunities.webp",
    alt: "High-potential real estate and development investments in Bhubaneswar",
    href: "/opportunities?category=Investment#opportunities-list",
    actionLabel: "Explore investments",
  },
];

export default async function OpportunitiesPage() {
  let available: ManagedOpportunity[] = properties.map((p, i) => ({
    ...p,
    id: i + 1,
    category: "Residential",
    published: true,
    featured: i === 0,
    sortOrder: i,
    updatedAt: new Date().toISOString(),
  }));

  try {
    await ensureInitialOpportunities();
    available = await listOpportunities(false);
  } catch (error) {
    console.error("Using bundled opportunities", error);
  }

  return (
    <>
      <PageHero
        eyebrow="Bhubaneswar · Odisha"
        title={
          <>
            Opportunities
            <br />
            <em>worth exploring.</em>
          </>
        }
        lead="A curated selection of residential, land, commercial and investment opportunities—chosen for quality, location and long-term potential."
      />
      <OpportunitiesListing properties={available} />
      <section className="content-section paper">
        <Reveal>
          <p className="eyebrow">Expanding portfolio</p>
          <h2>
            Land. Commercial.
            <br />
            <em>Investment.</em>
          </h2>
        </Reveal>
        <div className="portfolio-expansion-grid">
          {expandingCategories.map((item, i) => (
            <Reveal delay={i * 90} key={item.title} variant="clip">
              <Link href={item.href} className="portfolio-expansion-card">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="portfolio-expansion-bg"
                  loading="lazy"
                  decoding="async"
                />
                <div className="portfolio-expansion-overlay" />
                <div className="portfolio-expansion-bottom">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span className="portfolio-expansion-cta">
                    {item.actionLabel}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <CTA
        title={
          <>
            Something specific
            <br />
            <em>in mind?</em>
          </>
        }
      />
    </>
  );
}

