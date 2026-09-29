import Link from "next/link";
import { Property, whatsapp } from "@/data/site";
import { WhatsAppIcon } from "./SiteShell";

export function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  const message = `https://wa.me/919777958275?text=${encodeURIComponent(
    `Hi NOVOHOMS, I'm interested in ${property.name} and would like to know more.`
  )}`;
  return (
    <article className="property-card">
      <Link
        href={`/properties/${property.slug}`}
        className="property-image"
        aria-label={`Check details for ${property.name}`}
      >
        <img src={property.image} alt={`${property.name} in ${property.location}`} />
        <span className="property-number">0{index + 1}</span>
        <span className="property-status">{property.status}</span>
      </Link>
      <div className="property-copy">
        <p className="eyebrow">{property.eyebrow}</p>
        <h3>
          <Link href={`/properties/${property.slug}`}>{property.name}</Link>
        </h3>
        <p>
          {property.config} <span>·</span> {property.location}
        </p>
        <div className="property-actions">
          <Link href={`/properties/${property.slug}`} className="text-link">
            Check details <b>↗</b>
          </Link>
          <a
            href={message || whatsapp}
            target="_blank"
            rel="noreferrer"
            className="whatsapp-link"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <b style={{ display: "grid", placeItems: "center" }}>
              <WhatsAppIcon size={12} />
            </b>
            WhatsApp enquiry
          </a>
        </div>
      </div>
    </article>
  );
}

