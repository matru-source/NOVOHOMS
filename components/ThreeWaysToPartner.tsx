import { Reveal } from "./Reveal";

interface PartnerWay {
  num: string;
  audience: string;
  title: string | string[];
  desc: string;
  icon: React.ReactNode;
  checklist: string[];
}

const partnerWays: PartnerWay[] = [
  {
    num: "01",
    audience: "FOR DEVELOPERS & BUILDERS",
    title: "I Have a Project",
    desc: "Residential, commercial, mixed-use developments, new launches, existing or unsold inventory — let NOVOHOMS bring it to the right buyers and investors.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b88636"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 21h16" />
        <path d="M9 21V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v16" />
        <path d="M9 9h4" />
        <path d="M9 13h4" />
        <path d="M9 17h4" />
        <path d="M3 5h18" />
        <path d="M11 2v2" />
        <path d="M18 5v4" />
        <path d="M17 9h2" />
      </svg>
    ),
    checklist: [
      "Residential Projects",
      "Commercial Projects",
      "Mixed-Use Developments",
      "New Launches",
      "Existing Inventory",
      "Unsold Inventory",
    ],
  },
  {
    num: "02",
    audience: "FOR OWNERS & INVESTORS",
    title: ["I Have a Property", "or Opportunity"],
    desc: "Own a residential property, commercial space, land, plot or investment opportunity? We help you connect with the right audience.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b88636"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
        <path d="M9 21v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" />
      </svg>
    ),
    checklist: [
      "Residential Properties",
      "Commercial Properties",
      "Land & Plots",
      "Investment Opportunities",
      "Other Real Estate Assets",
    ],
  },
  {
    num: "03",
    audience: "FOR BUSINESSES & ADVISORS",
    title: "I Have an Idea",
    desc: "We are open to collaborations, strategic partnerships and new ideas across the real estate ecosystem.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b88636"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 2a6.5 6.5 0 0 0-6.5 6.5c0 2.2 1.3 4.1 2.8 5.5h7.4c1.5-1.4 2.8-3.3 2.8-5.5A6.5 6.5 0 0 0 12 2z" />
      </svg>
    ),
    checklist: [
      "Product Collaborations",
      "Market Expansion",
      "Strategic Partnerships",
      "Research & Advisory",
      "Other Opportunities",
    ],
  },
];

export function ThreeWaysToPartner() {
  return (
    <section className="partner-ways-section">
      <div className="partner-ways-container">
        <Reveal>
          <div className="partner-ways-eyebrow-wrap">
            <span className="partner-ways-eyebrow">CHOOSE YOUR PATH</span>
            <span className="partner-ways-dash" />
          </div>
          <h2 className="partner-ways-title">
            Three ways
            <br />
            <em>to partner.</em>
          </h2>
          <p className="partner-ways-lead">
            Whether you want to develop, invest or explore new opportunities — we work with the right
            people to create lasting value in real estate.
          </p>
        </Reveal>

        <div className="partner-ways-grid">
          {partnerWays.map((item, idx) => (
            <Reveal delay={idx * 80} key={item.num}>
              <div className="partner-way-card">
                {/* Top header row with number and round icon badge */}
                <div className="partner-way-header">
                  <div className="partner-way-num-wrap">
                    <span className="partner-way-num">{item.num}</span>
                    <span className="partner-way-line" />
                  </div>
                  <div className="partner-way-badge" aria-hidden="true">
                    {item.icon}
                  </div>
                </div>

                {/* Audience label */}
                <span className="partner-way-audience">{item.audience}</span>

                {/* Card Title */}
                <h3 className="partner-way-card-title">
                  {Array.isArray(item.title) ? (
                    <>
                      {item.title[0]}
                      <br />
                      {item.title[1]}
                    </>
                  ) : (
                    item.title
                  )}
                </h3>

                {/* Description */}
                <p className="partner-way-desc">{item.desc}</p>

                {/* Checklist */}
                <ul className="partner-way-checklist">
                  {item.checklist.map((checkItem, cIdx) => (
                    <li key={cIdx} className="partner-way-check-item">
                      <svg
                        className="partner-way-check-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c49854"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{checkItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
