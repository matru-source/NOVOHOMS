import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnquiryForm, PageHero } from "@/components/InnerPage";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/SiteShell";
import { properties } from "@/data/site";
import { ensureInitialOpportunities, getOpportunityBySlug } from "@/lib/opportunity-store";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function findProperty(slug: string, includeDrafts = false) {
  try {
    await ensureInitialOpportunities();
    return await getOpportunityBySlug(slug, includeDrafts);
  } catch {
    return properties.find((x) => x.slug === slug) ?? null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await findProperty(slug, true);
  if (!p) {
    return { title: "Property Not Found" };
  }

  const title = `${p.name} — ${p.config || "Luxury Residences"}`;
  const description =
    p.summary ||
    `${p.name} located in ${p.location}. Modern curated property presented by NOVOHOMS real estate advisory.`;
  const canonicalUrl = `https://novohoms.com/properties/${slug}`;
  const imageUrl = p.image?.startsWith("http")
    ? p.image
    : `https://novohoms.com${p.image}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${p.name} — ${p.location}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getAdminSession();
  const isAdmin = Boolean(session);
  const p = await findProperty(slug, isAdmin);
  if (!p) notFound();

  const wa = `https://wa.me/919777958275?text=${encodeURIComponent(
    `Hi NOVOHOMS, I'm interested in ${p.name} and would like to know more.`
  )}`;

  const propertyJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.name,
    description: p.summary,
    url: `https://novohoms.com/properties/${slug}`,
    image: p.image?.startsWith("http") ? p.image : `https://novohoms.com${p.image}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bhubaneswar",
      addressRegion: "Odisha",
      addressCountry: "IN",
      description: p.location,
    },
    containedInPlace: {
      "@type": "Place",
      name: p.location,
    },
    offers: {
      "@type": "Offer",
      businessFunction: "https://schema.org/SellAction",
      availability: p.status?.toLowerCase().includes("ready")
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      priceCurrency: "INR",
      seller: {
        "@type": "RealEstateAgent",
        name: "NOVOHOMS",
        url: "https://novohoms.com",
        telephone: "+919777958275",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />
      <PageHero
        className="property-hero"
        eyebrow={p.eyebrow}
        title={
          <>
            {p.name}
            <br />
            <em>{p.tagline}</em>
          </>
        }
        image={p.image}
      >
        <div className="page-hero-meta">
          <span>{p.config}</span>
          <span>{p.location}</span>
          <span>{p.status}</span>
          {"published" in p && !p.published && (
            <span style={{ color: "var(--gold)", borderLeft: "1px solid var(--gold)" }}>
              Draft (Admin Preview)
            </span>
          )}
        </div>
        <div className="hero-actions" style={{ marginTop: 35 }}>
          <ButtonLink href="#enquire">Check availability</ButtonLink>
          <ButtonLink href={wa} light>
            WhatsApp an advisor
          </ButtonLink>
        </div>
      </PageHero>

      <section className="content-section paper">
        <div className="property-story">
          <Reveal>
            <p className="eyebrow">About the property</p>
            <h2>
              A closer look at
              <br />
              <em>{p.name}.</em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="summary">{p.summary}</p>
          </Reveal>
        </div>
        {p.highlights?.length > 0 && (
          <div className="highlight-grid">
            {p.highlights.map((h, i) => (
              <Reveal delay={i * 70} key={h.title}>
                <article className="highlight">
                  <span>0{i + 1}</span>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {p.gallery?.length > 0 && (
        <>
          <section className="section-heading section">
            <Reveal>
              <p className="eyebrow">The property</p>
              <h2>
                Designed to be
                <br />
                <em>experienced.</em>
              </h2>
            </Reveal>
          </section>
          <section className="gallery">
            {p.gallery.map((g) => (
              <figure key={g.label}>
                <img src={g.image} alt={`${p.name} — ${g.label}`} />
                <figcaption>{g.label}</figcaption>
              </figure>
            ))}
          </section>
        </>
      )}

      <section className="content-section enquiry-section" id="enquire">
        <Reveal>
          <p className="eyebrow">Speak with an advisor</p>
          <h2>
            Is this the right
            <br />
            <em>move for you?</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)" }}>
            Get current pricing, availability, configurations and complete project information
            directly from NOVOHOMS.
          </p>
          <div style={{ marginTop: 30 }}>
            <ButtonLink href={wa} light>
              WhatsApp about this property
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <EnquiryForm propertyTitle={p.name} />
        </Reveal>
      </section>
    </>
  );
}

