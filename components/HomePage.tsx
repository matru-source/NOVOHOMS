"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "./SiteShell";
import { Reveal, SplitText } from "./Reveal";
import { PropertyCard } from "./PropertyCard";
import { properties, whatsapp } from "@/data/site";

export default function HomePage() {
  const hero = useRef<HTMLElement>(null);
  const [liveProperties, setLiveProperties] = useState(properties);
  useEffect(() => {
    const node = hero.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const r = node.getBoundingClientRect();
      node.style.setProperty("--mx", `${((e.clientX-r.left)/r.width)*100}%`);
      node.style.setProperty("--my", `${((e.clientY-r.top)/r.height)*100}%`);
    };
    node.addEventListener("pointermove", move);
    return () => node.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    fetch("/api/opportunities").then((response) => response.ok ? response.json() as Promise<{ opportunities?: typeof properties }> : null).then((data) => {
      if (data?.opportunities?.length) setLiveProperties(data.opportunities);
    }).catch(() => undefined);
  }, []);

  return <>
    <section className="hero" ref={hero}>
      <div className="hero-media" data-parallax="0.045" />
      <div className="hero-noise" />
      <div className="hero-spotlight" />
      <div className="hero-marquee" aria-hidden="true"><div>SPACES THAT MOVE YOU FORWARD · SPACES THAT MOVE YOU FORWARD ·&nbsp;</div><div>SPACES THAT MOVE YOU FORWARD · SPACES THAT MOVE YOU FORWARD ·&nbsp;</div></div>
      <div className="hero-content">
        <p className="eyebrow hero-kicker">Bhubaneswar · Real estate advisory</p>
        <h1><SplitText>Spaces that</SplitText><br /><em><SplitText>move you forward.</SplitText></em></h1>
        <div className="hero-bottom">
          <p>Discover the right property, space or investment opportunity—guided by what truly matters to you.</p>
          <div className="hero-actions"><ButtonLink href="/opportunities">Explore opportunities</ButtonLink><ButtonLink href={whatsapp} light>WhatsApp an advisor</ButtonLink></div>
        </div>
      </div>
      <div className="hero-index"><span>01</span><i /><span>06</span></div>
      <a href="#journey" className="scroll-cue"><span>Scroll to explore</span><i /></a>
    </section>

    <section className="intro section" id="journey">
      <span className="section-coordinate" aria-hidden="true">20.2961° N<br />85.8245° E</span>
      <div className="section-heading">
        <Reveal><p className="eyebrow">Your journey, considered</p></Reveal>
        <Reveal delay={70}><h2>Real estate should feel<br />less like a search and<br /><em>more like a direction.</em></h2></Reveal>
      </div>
      <Reveal delay={140} className="intro-copy"><p>We begin with the person, not the property. Your ambitions, timing and idea of what comes next shape every opportunity we bring to the table.</p><Link href="/how-we-help" className="text-link">Discover our approach <b>↗</b></Link></Reveal>
    </section>

    <section className="paths">
      <Reveal variant="clip" tilt className="path-card path-find"><span className="path-no">01</span><div><p className="eyebrow">I&apos;m looking</p><h2>Find a place<br />that fits your future.</h2><p>Homes, workspaces, land and investments—carefully considered around the life you want to build.</p><ButtonLink href="/opportunities" light>Explore opportunities</ButtonLink></div></Reveal>
      <Reveal variant="clip" delay={100} className="path-card path-bring"><span className="path-no">02</span><div><p className="eyebrow">I&apos;m bringing</p><h2>Place your opportunity<br />with purpose.</h2><p>For developers, owners and partners ready to meet the right buyers, investors and conversations.</p><ButtonLink href="/partner" light>Partner with us</ButtonLink></div></Reveal>
    </section>

    <section className="properties-section section">
      <div className="kinetic-title" aria-hidden="true"><span>CURATED OPPORTUNITIES · CURATED OPPORTUNITIES ·&nbsp;</span><span>CURATED OPPORTUNITIES · CURATED OPPORTUNITIES ·&nbsp;</span></div>
      <div className="section-heading row">
        <Reveal><p className="eyebrow">Selected opportunities</p><h2>Distinctive places.<br /><em>Considered potential.</em></h2></Reveal>
        <Reveal delay={100}><Link href="/opportunities" className="text-link">View all opportunities <b>↗</b></Link></Reveal>
      </div>
      <div className="property-grid">{liveProperties.slice(0, 3).map((p, i) => <Reveal variant="clip" delay={i * 90} key={p.slug}><PropertyCard property={p} index={i} /></Reveal>)}</div>
    </section>

    <section className="manifesto section">
      <div className="manifesto-image"><div data-parallax="0.07" /></div>
      <div className="manifesto-copy">
        <Reveal><p className="eyebrow">The NOVOHOMS difference</p><h2>More than options.<br /><em>A clearer way forward.</em></h2></Reveal>
        {[['01','Personal, always','Advice shaped around you—not a generic shortlist.'],['02','Curated with intent','Fewer, stronger opportunities with real context behind them.'],['03','Honest by design','Clear conversations, transparent information and no unnecessary pressure.'],['04','Built for what’s next','Thinking beyond today’s transaction to tomorrow’s value.']].map(([n,t,d],i)=><Reveal delay={i*50} key={n}><div className="principle"><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></div></Reveal>)}
      </div>
    </section>

    <section className="process section">
      <div className="process-watermark" aria-hidden="true">UNDERSTAND · CURATE · EVALUATE · MOVE FORWARD ·</div>
      <Reveal><p className="eyebrow">A thoughtful process</p><h2>From first question<br />to <em>confident decision.</em></h2></Reveal>
      <div className="process-line">
        {[['Understand','We listen before we recommend.'],['Curate','Only relevant opportunities make the cut.'],['Evaluate','Context turns listings into decisions.'],['Move forward','Support that stays with you.']].map(([title,text],i)=><Reveal delay={i*80} key={title}><div className="process-step"><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></div></Reveal>)}
      </div>
    </section>

    <section className="journal-tease">
      <div className="journal-image" data-parallax="0.045" />
      <Reveal className="journal-card"><p className="eyebrow">The NOVOHOMS Journal · Market insight</p><h2>Why price isn&apos;t<br />the same as <em>value.</em></h2><p>A deeper look at what creates value in real estate—and why better questions lead to better decisions.</p><ButtonLink href="/insights/the-novohoms-view-price-isnt-the-same-as-value">Read the perspective</ButtonLink></Reveal>
    </section>
  </>;
}
