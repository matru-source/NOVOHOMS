import { Reveal } from "./Reveal";

interface PartnerType {
  id: string;
  title: string[];
  icon: React.ReactNode;
}

const partnerTypes: PartnerType[] = [
  {
    id: "developers",
    title: ["Real Estate", "Developers"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b88636"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="10" width="7" height="12" rx="1" />
        <rect x="12" y="3" width="9" height="19" rx="1" />
        <path d="M6 14h1M6 17h1M15 7h3M15 11h3M15 15h3M15 19h3" />
      </svg>
    ),
  },
  {
    id: "project-owners",
    title: ["Project", "Owners"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b88636"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 18h20" />
        <path d="M5 18a7 7 0 0 1 14 0" />
        <path d="M10 8.5V6a2 2 0 0 1 4 0v2.5" />
      </svg>
    ),
  },
  {
    id: "property-owners",
    title: ["Individual", "Property Owners"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b88636"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
        <path d="M9 21v-7h6v7" />
      </svg>
    ),
  },
  {
    id: "landowners",
    title: ["Landowners"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b88636"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 19c3-1 6-2 10-1s6 2 10 1" />
        <path d="M2 15c4-2 8-1 12-2s5 2 8 2" />
        <circle cx="8" cy="9" r="2.8" />
        <path d="M8 11.8v3" />
        <circle cx="16" cy="11" r="2.3" />
        <path d="M16 13.3v2.5" />
      </svg>
    ),
  },
  {
    id: "commercial-owners",
    title: ["Commercial", "Property Owners"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b88636"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="3" width="14" height="19" rx="1.5" />
        <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M11 22v-3h2v3" />
      </svg>
    ),
  },
  {
    id: "businesses",
    title: ["Businesses"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b88636"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18M11 12v2h2v-2" />
      </svg>
    ),
  },
  {
    id: "investors",
    title: ["Investors"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b88636"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20h16" />
        <path d="M6 16v-2" />
        <path d="M11 16v-6" />
        <path d="M16 16v-9" />
        <polyline points="13 7 19 3 19 9" />
        <line x1="7" y1="13" x2="19" y2="3" />
      </svg>
    ),
  },
];

export function WhoWeWorkWith() {
  return (
    <section className="who-we-work-section">
      <div className="who-we-work-container">
        {/* Header with Title and Decorative Golden Line */}
        <div className="who-we-work-header-row">
          <Reveal>
            <div className="who-we-work-eyebrow-wrap">
              <span className="who-we-work-eyebrow">OPEN TO ALL</span>
              <span className="who-we-work-dash" />
            </div>
            <h2 className="who-we-work-title">Who We Work With</h2>
            <p className="who-we-work-lead">
              We collaborate with everyone who shapes the real estate ecosystem — from developers to
              investors, and everyone in between.
            </p>
          </Reveal>

          {/* Decorative Right Golden Curve Line */}
          <div className="who-we-work-deco-line" aria-hidden="true">
            <svg viewBox="0 0 360 90" fill="none" preserveAspectRatio="none">
              <path
                d="M 360,20 L 50,20 Q 20,20 20,52 L 20,82"
                stroke="#c49854"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx="20" cy="82" r="4.5" fill="#c49854" />
            </svg>
          </div>
        </div>

        {/* 7 Horizontal Cards */}
        <div className="who-we-work-grid">
          {partnerTypes.map((item, idx) => (
            <Reveal delay={idx * 50} key={item.id}>
              <div className="who-we-work-card">
                <div className="who-we-work-icon-wrap">{item.icon}</div>
                <div className="who-we-work-divider" />
                <div className="who-we-work-card-text">
                  {item.title.map((line, i) => (
                    <span key={i} className="who-we-work-card-line">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
