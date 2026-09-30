"use client";

import { useEffect, useRef, useState } from "react";

export type DifferenceItem = {
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export const differences: DifferenceItem[] = [
  {
    number: "01",
    title: "Personal, always",
    description: "Advice shaped around you—not a generic shortlist.",
    image: "/difference-personal-always.png",
    alt: "Personal, always - personalized property consultation at NOVOHOMS",
  },
  {
    number: "02",
    title: "Curated with intent",
    description: "Fewer, stronger opportunities with real context behind them.",
    image: "/difference-curated-intent.png",
    alt: "Curated with intent - verified properties with real context",
  },
  {
    number: "03",
    title: "Honest by design",
    description: "Clear conversations, transparent information and no unnecessary pressure.",
    image: "/difference-honest-design.png",
    alt: "Honest by design - transparent pricing and clear communication",
  },
  {
    number: "04",
    title: "Built for what’s next",
    description: "Thinking beyond today’s transaction to tomorrow’s value.",
    image: "/difference-built-next.png",
    alt: "Built for what's next - long-term value and wealth building",
  },
];

export function NovohomsDifference() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const calculateStep = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalDistance = sectionRef.current.offsetHeight - window.innerHeight;

      if (totalDistance <= 0) return;

      // Distance from top of section to top of viewport
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalDistance));

      // Calculate step index (0, 1, 2, 3)
      const exactStep = progress * 4;
      const index = Math.min(3, Math.floor(exactStep));

      setActiveIndex(index);
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        calculateStep();
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    calculateStep();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToStep = (index: number) => {
    if (!sectionRef.current) return;
    const totalDistance = sectionRef.current.offsetHeight - window.innerHeight;
    const containerTop = window.scrollY + sectionRef.current.getBoundingClientRect().top;
    // Scroll to the midpoint of the selected step zone
    const targetY = containerTop + ((index + 0.5) / 4) * totalDistance;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <section className="difference-scroll-section" ref={sectionRef} id="difference">
      <div className="difference-sticky-wrapper">
        <div className="difference-inner">
          {/* Left Column: 4 Progressive Images */}
          <div className="difference-visual-col">
            <div className="difference-image-frame">
              {differences.map((diff, i) => (
                <img
                  key={diff.number}
                  src={diff.image}
                  alt={diff.alt}
                  className={`difference-image ${i === activeIndex ? "is-active" : ""}`}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}
              <div className="difference-image-badge">
                <span className="difference-badge-num">0{activeIndex + 1}</span>
                <span className="difference-badge-slash">/</span>
                <span className="difference-badge-total">04</span>
                <span className="difference-badge-dot">·</span>
                <span className="difference-badge-title">{differences[activeIndex].title}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Progressive Details */}
          <div className="difference-content-col">
            <div className="difference-heading">
              <p className="eyebrow">The NOVOHOMS difference</p>
              <h2>
                More than options.
                <br />
                <em>A clearer way forward.</em>
              </h2>
            </div>

            <div className="difference-principles-list">
              {differences.map((item, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    type="button"
                    key={item.number}
                    className={`difference-principle-item ${isActive ? "is-active" : ""}`}
                    onClick={() => scrollToStep(i)}
                    aria-label={`Show step ${item.number}: ${item.title}`}
                  >
                    <div className="difference-item-indicator">
                      <span className="difference-item-number">{item.number}</span>
                      <span className="difference-item-bar-track">
                        <span
                          className="difference-item-bar-fill"
                          style={{
                            transform: isActive
                              ? "scaleY(1)"
                              : i < activeIndex
                              ? "scaleY(1)"
                              : "scaleY(0)",
                          }}
                        />
                      </span>
                    </div>
                    <div className="difference-item-text">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
