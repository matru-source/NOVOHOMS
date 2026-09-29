import { MetadataRoute } from "next";
import { listOpportunities } from "@/lib/opportunity-store";
import { properties } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://novohoms.com";

  const staticRoutes = [
    "",
    "/about",
    "/opportunities",
    "/how-we-help",
    "/partner",
    "/insights",
    "/insights/the-novohoms-view-price-isnt-the-same-as-value",
    "/contact",
    "/privacy-policy",
    "/terms-of-use",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let propertySlugs: string[] = properties.map((p) => p.slug);
  try {
    const live = await listOpportunities(false);
    if (live && live.length > 0) {
      propertySlugs = live.map((p) => p.slug);
    }
  } catch {
    // fallback to static properties list
  }

  const dynamicRoutes = propertySlugs.map((slug) => ({
    url: `${baseUrl}/properties/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
