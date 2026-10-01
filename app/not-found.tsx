import { EmptyState } from "@/components/EmptyState";
import { Reveal } from "@/components/Reveal";

export default function NotFound() {
  return (
    <main style={{ minHeight: "85vh", padding: "140px clamp(24px, 7vw, 110px) 90px" }}>
      <Reveal>
        <EmptyState
          eyebrow="PAGE NOT FOUND · 404"
          title="Looking for a distinctive space?"
          description="The address you are trying to reach may have moved or doesn't exist yet. Let us guide you back to our curated collection of opportunities."
          primaryAction={{
            label: "Explore opportunities",
            href: "/opportunities",
          }}
          secondaryAction={{
            label: "Return to home",
            href: "/",
          }}
        />
      </Reveal>
    </main>
  );
}
