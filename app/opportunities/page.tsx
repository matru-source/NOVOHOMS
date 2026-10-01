import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CTA } from "@/components/InnerPage";
import { OpportunitiesListing } from "@/components/OpportunitiesListing";
import { Reveal } from "@/components/Reveal";
import { properties } from "@/data/site";
import { ensureInitialOpportunities, listOpportunities, ManagedOpportunity } from "@/lib/opportunity-store";

export const metadata: Metadata = {
  title: "Curated Real Estate Opportunities in Bhubaneswar",
  description:
    "Explore vetted luxury residences, commercial office spaces, plots, and strategic real estate investments across prime corridors in Bhubaneswar.",
  alternates: {
    canonical: "/opportunities",
  },
  openGraph: {
    title: "Curated Real Estate Opportunities | NOVOHOMS",
    description:
      "Explore vetted luxury residences, commercial office spaces, plots, and strategic investments across prime corridors in Bhubaneswar.",
    url: "https://novohoms.com/opportunities",
    images: [
      {
        url: "/portfolio/commercial-spaces.webp",
        width: 1200,
        height: 630,
        alt: "NOVOHOMS Real Estate Opportunities",
      },
    ],
  },
};
export const dynamic = "force-dynamic";

const expandingCategories = [
  {
    title: "Land & plots",
    desc: "Curated parcels and residential layouts.",
    image: "/portfolio/land-plots.webp",
    blur: "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAACwBACdASogABIAPzmOu1WvKiYjMBgIAeAnCWYAvkgQ7Lv1NGcGf2z+0euExjsAAP7Tc2YDX3y8p+j/nrLxCyiEBrKTcrm4fKaMWV2aGPcV7LoJakABI0Xq613CBoQHZW+NNhN2Jn5/7kF/+eyZLEDTQTZcN7OxuBLTv6jeGGHo6zChDqRyAAAA",
    alt: "Master-planned land and residential plots in Bhubaneswar",
    href: "/opportunities?category=Land%20%26%20plots#opportunities-list",
    actionLabel: "Explore land & plots",
  },
  {
    title: "Commercial spaces",
    desc: "Prime corporate offices and retail destinations.",
    image: "/portfolio/commercial-spaces.webp",
    blur: "data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAADQBQCdASogABIAPzmEuFOvKCUisAgB4CcJagCsMoSCntxCEhGcUlXJXYIKs4PMed1EdGSMsSoAAP53oFPHIYm35/y6JPNeBG7GsakWjAlsmiti8uSp50FjL3QRDO0boqmSQRISuvdCWQg288JwE0kJn6Az89icVp448ns8q/j8xUWWAbHj/A+PnxZVNtHrNyOV/UX7kZ1dgvRa9cMk3VD1lYblgSlrtyOB/I0aX1GwMAAA",
    alt: "Modern premium commercial office and retail spaces in Bhubaneswar",
    href: "/opportunities?category=Commercial#opportunities-list",
    actionLabel: "Explore commercial",
  },
  {
    title: "Investment opportunities",
    desc: "Strategic capital growth and yield assets.",
    image: "/portfolio/investment-opportunities.webp",
    blur: "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAADQBACdASogABUAPzmKulOvKaWisAgB4CcJQBf9jSv2ee4YwSb/NXZ75PDMKGwIAAD+9+a9dqEV5V9yRVcDlo85jAWJQijGVR9PaL8v4RGfezxVc6WoFPsOX+Pb2yIml2Nygzod0cbjxj2w02nZdFLjWbd7GOh4u9wxu1VJ3XWdUAAA",
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
      {expandingCategories.map((item) => (
        <link
          key={item.image}
          rel="preload"
          as="image"
          href={item.image}
          fetchPriority="high"
        />
      ))}
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
            <Reveal delay={i * 40} key={item.title}>
              <Link
                href={item.href}
                className="portfolio-expansion-card"
                style={{
                  backgroundImage: `url('${item.blur}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="portfolio-expansion-bg"
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
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

