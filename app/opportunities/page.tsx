import { PageHero, CTA } from "@/components/InnerPage";
import { OpportunitiesListing } from "@/components/OpportunitiesListing";
import { Reveal } from "@/components/Reveal";
import { properties } from "@/data/site";
import { ensureInitialOpportunities, listOpportunities, ManagedOpportunity } from "@/lib/opportunity-store";

export const metadata = { title: "Opportunities" };
export const dynamic = "force-dynamic";

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
        <div style={{ height: 55 }} />
        <div className="card-grid">
          {["Land & plots", "Commercial spaces", "Investment opportunities"].map((x, i) => (
            <article className="info-card" key={x}>
              <span>0{i + 1}</span>
              <div>
                <h3>{x}</h3>
                <p>
                  Tell us what you need and we&apos;ll curate relevant opportunities across
                  Bhubaneswar and beyond.
                </p>
              </div>
            </article>
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

