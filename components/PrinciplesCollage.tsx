import { Reveal } from "./Reveal";

export interface PrincipleItem {
  num: string;
  tag: string;
  title: string;
  text: string;
  image: string;
  layout: "wide-left" | "portrait" | "wide-right";
}

const defaultPrinciples: PrincipleItem[] = [
  {
    num: "01",
    tag: "Radical Transparency",
    title: "Honesty over convenience",
    text: "If an opportunity is not right for you, we will say so without hesitation. Our loyalty is to your long-term outcome, not the speed of closing.",
    image: "/principles/honesty.webp",
    layout: "wide-left",
  },
  {
    num: "02",
    tag: "Curated Attention",
    title: "Depth over volume",
    text: "A curated set of clients and opportunities lets us give each engagement proper attention, financial diligence, and bespoke care.",
    image: "/principles/depth.webp",
    layout: "portrait",
  },
  {
    num: "03",
    tag: "Market Intelligence",
    title: "Context over listings",
    text: "Market intelligence and location insight make a listing meaningful. We evaluate the macro patterns, micro-pockets, and hidden nuances behind every valuation.",
    image: "/principles/context.webp",
    layout: "portrait",
  },
  {
    num: "04",
    tag: "Forward Outlook",
    title: "Long-term thinking",
    text: "We consider capital appreciation, resale liquidity, rental yield, infrastructure evolution, and the broader goals behind every decision.",
    image: "/principles/longterm.webp",
    layout: "wide-right",
  },
];

export function PrinciplesCollage({ items = defaultPrinciples }: { items?: PrincipleItem[] }) {
  return (
    <div className="principles-collage">
      {items.map((item, i) => (
        <Reveal
          key={item.num}
          delay={i * 80}
          className={`principle-box-wrap ${item.layout}`}
        >
          <article className={`principle-box ${item.layout}`}>
            {item.layout === "wide-right" ? (
              <>
                <div className="principle-box-media">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="principle-box-content">
                  <div className="principle-box-header">
                    <span className="principle-box-num">{item.num}</span>
                    <span className="principle-box-tag">{item.tag}</span>
                  </div>
                  <div className="principle-box-body">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              </>
            ) : item.layout === "wide-left" ? (
              <>
                <div className="principle-box-content">
                  <div className="principle-box-header">
                    <span className="principle-box-num">{item.num}</span>
                    <span className="principle-box-tag">{item.tag}</span>
                  </div>
                  <div className="principle-box-body">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
                <div className="principle-box-media">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="principle-box-media">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="principle-box-content">
                  <div className="principle-box-header">
                    <span className="principle-box-num">{item.num}</span>
                    <span className="principle-box-tag">{item.tag}</span>
                  </div>
                  <div className="principle-box-body">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              </>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  );
}
