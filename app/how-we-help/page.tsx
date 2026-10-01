import { CTA, InfoCards, PageHero } from "@/components/InnerPage";
import { Reveal } from "@/components/Reveal";

export const metadata = { title: "How We Help" };
const process = [
  {
    title: "Understand your goals",
    text: "Every engagement begins with a real conversation about your ambitions, budget, timeline and priorities.",
    image: "/process/1-understand-goals.webp",
  },
  {
    title: "Curate relevant options",
    text: "We identify opportunities that genuinely fit—then present them with the context you need.",
    image: "/process/2-curate-options.webp",
  },
  {
    title: "Evaluate together",
    text: "Location, pricing, track record, legal standing and growth potential are considered carefully.",
    image: "/process/3-evaluate-together.webp",
  },
  {
    title: "Support the decision",
    text: "From negotiation to documentation, we stay close and keep the process transparent.",
    image: "/process/4-support-decision.webp",
  },
  {
    title: "Stay connected",
    text: "Our relationship continues after the transaction, through questions and future decisions.",
    image: "/process/5-stay-connected.webp",
  },
];
export default function HelpPage(){return <><PageHero eyebrow="Our advisory approach" title={<>Clarity for every<br /><em>move forward.</em></>} lead="Significant property decisions deserve context, care and genuine guidance."/><section className="content-section"><div className="content-grid"><Reveal><p className="eyebrow">What we do</p><h2>Your goals<br /><em>come first.</em></h2></Reveal><Reveal delay={100} className="content-copy"><p>We don&apos;t just show properties. We help you understand what you&apos;re really looking for, how the market behaves and what your next move could mean.</p></Reveal></div></section><section className="content-section paper"><Reveal><p className="eyebrow">The process</p><h2>A clear path from<br /><em>question to decision.</em></h2></Reveal><div style={{height:60}}/><InfoCards items={process}/></section><section className="content-section"><Reveal><p className="eyebrow">The principles</p><h2>Honesty. Depth.<br /><em>Context. Time.</em></h2></Reveal><div style={{height:55}}/><InfoCards items={[{title:'Honesty over convenience',text:'If an opportunity is not right for you, we will say so.'},{title:'Depth over volume',text:'A curated set of clients and opportunities lets us give each engagement proper attention.'},{title:'Context over listings',text:'Market intelligence and location insight make a listing meaningful.'},{title:'Long-term thinking',text:'We consider resale, rental yield, infrastructure and the broader goals behind a decision.'}]}/></section><CTA title={<>Begin with a<br /><em>conversation.</em></>}/></>}
