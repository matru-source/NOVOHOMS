import { CTA, InfoCards, PageHero } from "@/components/InnerPage";
import { Reveal } from "@/components/Reveal";

export const metadata = { title: "About" };
export default function AboutPage() { return <>
  <PageHero eyebrow="About NOVOHOMS" title={<>Two perspectives.<br /><em>One clear vision.</em></>} lead="Born from a shared belief that real estate should be about better decisions—not simply more properties." />
  <section className="content-section"><div className="content-grid"><Reveal><p className="eyebrow">Why we began</p><h2>Local depth meets<br /><em>a wider view.</em></h2></Reveal><Reveal delay={100} className="content-copy"><p>We&apos;re building a trusted advisory platform where personalised guidance, transparent thinking and meaningful opportunities come together.</p><p style={{fontFamily:'var(--sans)',fontSize:14}}>Starting in Bhubaneswar, our ambition is to make every property conversation simpler, clearer and more purposeful—whether the next move is a home, a business, land or an investment.</p></Reveal></div></section>
  <section className="content-section paper"><Reveal><p className="eyebrow">The founders</p><h2>Different experience.<br /><em>Shared direction.</em></h2></Reveal><div style={{height:60}} /><InfoCards items={[{title:'Jigyasha Singh',text:'Co-Founder · Strategy & Global Perspective. A modern, international and deeply client-focused approach to real estate.'},{title:'Sheikh Obed Ali',text:'Co-Founder · Real Estate & Development. Nearly 15 years of local understanding across property, land and development.'},{title:'NOVOHOMS',text:'Their shared platform for making real estate more transparent, thoughtful and genuinely useful.'}]} /></section>
  <CTA title={<>Find the space that<br /><em>moves you forward.</em></>} href="/opportunities" label="Explore opportunities" />
  </>; }
