"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "./SiteShell";
import { Reveal, SplitText } from "./Reveal";
import { PropertyCard } from "./PropertyCard";
import { properties, whatsapp } from "@/data/site";

export default function HomePage() {
  const [liveProperties, setLiveProperties] = useState(properties);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/opportunities")
      .then((response) =>
        response.ok ? (response.json() as Promise<{ opportunities?: typeof properties }>) : null
      )
      .then((data) => {
        if (data?.opportunities?.length) setLiveProperties(data.opportunities);
      })
      .catch(() => undefined);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-media" data-parallax="0.045" />
        <div className="hero-noise" />
        <div className="hero-content">
          <p className="eyebrow hero-kicker">Bhubaneswar · Real estate advisory</p>
          <h1>
            <SplitText>Spaces that</SplitText>
            <br />
            <em>
              <SplitText>move you forward.</SplitText>
            </em>
          </h1>
          <div className="hero-bottom">
            <p>
              Discover the right property, space or investment opportunity—guided by what truly
              matters to you.
            </p>
            <div className="hero-actions">
              <ButtonLink href="/opportunities">Explore opportunities</ButtonLink>
              <ButtonLink href={whatsapp} light>
                WhatsApp an advisor
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="hero-index">
          <span>01</span>
          <i />
          <span>06</span>
        </div>
        <a
          href="#journey"
          className={`scroll-cue ${scrolled ? "is-hidden" : ""}`}
          aria-label="Scroll to explore"
        >
          <span>Scroll to explore</span>
          <i />
        </a>
      </section>

    <section className="intro section" id="journey">
      <div className="section-heading">
        <Reveal><p className="eyebrow">Your journey, considered</p></Reveal>
        <Reveal delay={70}><h2>Real estate should feel<br />less like a search and<br /><em>more like a direction.</em></h2></Reveal>
      </div>
      <Reveal delay={140} className="intro-copy"><p>We begin with the person, not the property. Your ambitions, timing and idea of what comes next shape every opportunity we bring to the table.</p><Link href="/how-we-help" className="text-link">Discover our approach <b>↗</b></Link></Reveal>
    </section>

    <section className="category-photo-section section" id="categories">
      <div className="section-heading row">
        <Reveal>
          <p className="eyebrow">Explore opportunities</p>
          <h2>
            Find what moves<br />
            <em>you forward.</em>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <Link href="/opportunities" className="text-link">
            Browse all opportunities <b>↗</b>
          </Link>
        </Reveal>
      </div>

      <div className="category-bento-grid">
        <Reveal variant="clip" className="bento-residential">
          <Link
            href="/opportunities?category=Residential"
            className="category-photo-card"
          >
            <img
              src="/category-residential.png"
              alt="Residential real estate opportunity"
              loading="lazy"
            />
            <div className="category-photo-content">
              <p className="category-tag">Opportunity</p>
              <h3>Residential</h3>
              <p>Spaces designed for living, growing and building your future.</p>
              <span className="category-photo-link">
                Explore residential <b>↗</b>
              </span>
            </div>
          </Link>
        </Reveal>

        <Reveal variant="clip" delay={60} className="bento-commercial">
          <Link
            href="/opportunities?category=Commercial"
            className="category-photo-card"
          >
            <img
              src="/category-commercial.png"
              alt="Commercial real estate opportunity"
              loading="lazy"
            />
            <div className="category-photo-content">
              <p className="category-tag">Opportunity</p>
              <h3>Commercial</h3>
              <p>Spaces that support businesses, ambition and growth.</p>
              <span className="category-photo-link">
                Explore commercial <b>↗</b>
              </span>
            </div>
          </Link>
        </Reveal>

        <Reveal variant="clip" delay={100} className="bento-investments">
          <Link
            href="/opportunities?category=Investment"
            className="category-photo-card"
          >
            <img
              src="/category-investments.png"
              alt="Investments real estate opportunity"
              loading="lazy"
            />
            <div className="category-photo-content">
              <p className="category-tag">Opportunity</p>
              <h3>Investments</h3>
              <p>Real estate opportunities designed with the future in mind.</p>
              <span className="category-photo-link">
                Explore investments <b>↗</b>
              </span>
            </div>
          </Link>
        </Reveal>

        <Reveal variant="clip" delay={140} className="bento-land">
          <Link
            href="/opportunities?category=Land%20%26%20plots"
            className="category-photo-card"
          >
            <img
              src="/category-land.png"
              alt="Land & Plots real estate opportunity"
              loading="lazy"
            />
            <div className="category-photo-content">
              <p className="category-tag">Opportunity</p>
              <h3>Land &amp; Plots</h3>
              <p>Opportunities with the potential to shape what comes next.</p>
              <span className="category-photo-link">
                Explore land &amp; plots <b>↗</b>
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>

    <section className="properties-section section">
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
  </>
  );
}
