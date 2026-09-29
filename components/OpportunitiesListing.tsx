"use client";

import { useMemo, useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { Reveal } from "./Reveal";
import type { ManagedOpportunity } from "@/lib/opportunity-store";

const categories = ["All", "Residential", "Land & plots", "Commercial", "Investment"] as const;

export function OpportunitiesListing({
  properties,
}: {
  properties: ManagedOpportunity[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    if (selectedCategory === "All") return properties;
    return properties.filter((p) => {
      const cat = (p.category || "Residential").toLowerCase();
      const eyebrow = (p.eyebrow || "").toLowerCase();
      const sel = selectedCategory.toLowerCase();
      if (sel === "land & plots" || sel === "land") {
        return cat.includes("land") || eyebrow.includes("land");
      }
      return cat.includes(sel) || eyebrow.includes(sel);
    });
  }, [properties, selectedCategory]);

  return (
    <section className="properties-section section">
      <div className="section-heading row">
        <Reveal>
          <p className="eyebrow">
            {selectedCategory === "All" ? "Selected opportunities" : selectedCategory} · Available now
          </p>
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
              style={
                selectedCategory === c
                  ? { background: "var(--ink)", color: "white", borderColor: "var(--ink)" }
                  : undefined
              }
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
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p className="eyebrow" style={{ color: "var(--gold)" }}>
            Expanding Portfolio
          </p>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 500, margin: "10px 0" }}>
            No {selectedCategory} opportunities listed yet.
          </h3>
          <p style={{ color: "#667771", maxWidth: 480, margin: "0 auto 25px" }}>
            We are curating high-potential {selectedCategory} opportunities in Bhubaneswar. Contact our
            advisors to hear about unlisted and upcoming projects.
          </p>
          <button
            type="button"
            className="button-link"
            onClick={() => setSelectedCategory("All")}
            style={{ display: "inline-flex" }}
          >
            <span>View all opportunities</span>
          </button>
        </div>
      )}
    </section>
  );
}
