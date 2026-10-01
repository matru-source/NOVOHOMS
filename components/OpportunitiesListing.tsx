"use client";

import { useEffect, useMemo, useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { Reveal } from "./Reveal";
import { EmptyState } from "./EmptyState";
import { whatsapp } from "@/data/site";
import type { ManagedOpportunity } from "@/lib/opportunity-store";

const categories = ["All", "Residential", "Land & plots", "Commercial", "Investment"] as const;

const emptyStateTexts: Record<string, { title: string; desc: string }> = {
  "Land & plots": {
    title: "No Land & plots opportunities listed yet.",
    desc: "We are curating high-potential Land & plots opportunities in Bhubaneswar. Contact our advisors to hear about unlisted and upcoming projects.",
  },
  Commercial: {
    title: "No Commercial opportunities listed currently.",
    desc: "We are curating prime commercial, corporate offices, and retail spaces in Bhubaneswar. Speak with an advisor for upcoming opportunities and private mandates.",
  },
  Investment: {
    title: "No Investment opportunities listed currently.",
    desc: "High-yield and capital appreciation opportunities are actively being vetted. Connect with our advisory team to access private off-market assets.",
  },
  Residential: {
    title: "No Residential opportunities matching this filter.",
    desc: "We are curating distinctive residential enclaves, villas, and penthouses. Reach out to our advisors for upcoming and off-market residences.",
  },
  All: {
    title: "No opportunities available right now.",
    desc: "Our advisory team is currently preparing our next release of distinctive real estate opportunities. Contact our team to receive direct alerts.",
  },
};

export function OpportunitiesListing({
  properties,
}: {
  properties: ManagedOpportunity[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncCategory = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        const found = categories.find(
          (c) =>
            c.toLowerCase() === cat.toLowerCase() ||
            (c === "Land & plots" && cat.toLowerCase().includes("land"))
        );
        if (found) setSelectedCategory(found);
      } else {
        setSelectedCategory("All");
      }
    };

    syncCategory();
    window.addEventListener("popstate", syncCategory);
    return () => window.removeEventListener("popstate", syncCategory);
  }, []);

  const filtered = useMemo(() => {
    if (selectedCategory === "All") return properties;
    return properties.filter((p) => p.category === selectedCategory);
  }, [properties, selectedCategory]);

  const activeEmptyText = emptyStateTexts[selectedCategory] || {
    title: `No ${selectedCategory} opportunities listed yet.`,
    desc: `We are curating high-potential ${selectedCategory} opportunities in Bhubaneswar. Contact our advisors to hear about unlisted and upcoming projects.`,
  };

  return (
    <section className="section" id="opportunities-list" style={{ paddingTop: 40 }}>
      <div className="section-heading row" style={{ marginBottom: 40 }}>
        <Reveal>
          <p className="eyebrow">Curated collection</p>
          <h2>
            Places designed
            <br />
            for <em>what&apos;s next.</em>
          </h2>
        </Reveal>
        <div className="filter-pills">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={selectedCategory === c ? "is-active" : ""}
            >
              {c === "Land & plots" ? "Land" : c}
            </button>
          ))}
        </div>
      </div>

      <div className="property-grid listing-grid">
        {filtered.map((p, i) => (
          <Reveal delay={i * 80} key={p.slug}>
            <PropertyCard property={p} index={i} />
          </Reveal>
        ))}
      </div>

      {!filtered.length && (
        <Reveal>
          <EmptyState
            eyebrow="EXPANDING PORTFOLIO"
            title={activeEmptyText.title}
            description={activeEmptyText.desc}
            primaryAction={{
              label: "View all opportunities",
              onClick: () => setSelectedCategory("All"),
            }}
            secondaryAction={{
              label: "Talk to an advisor",
              href: `https://wa.me/919777958275?text=${encodeURIComponent(
                `Hi NOVOHOMS, I am inquiring about upcoming ${selectedCategory} opportunities.`
              )}`,
              isWhatsApp: true,
            }}
          />
        </Reveal>
      )}
    </section>
  );
}
