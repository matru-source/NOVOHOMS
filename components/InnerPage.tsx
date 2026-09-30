"use client";

import { CSSProperties, FormEvent, ReactNode, useState } from "react";
import { Reveal } from "./Reveal";
import { ButtonLink } from "./SiteShell";
import { whatsapp } from "@/data/site";

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  children,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  image?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`page-hero ${image ? "has-image" : ""} ${className}`}
      style={image ? ({ "--page-image": `url('${image}')` } as CSSProperties) : undefined}
    >
      <div className="page-hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function InfoCards({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="card-grid">
      {items.map((item, i) => (
        <Reveal delay={i * 60} key={item.title}>
          <article className="info-card">
            <span>0{i + 1}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function CTA({
  title,
  href = "/contact",
  label = "Talk to an advisor",
}: {
  title: ReactNode;
  href?: string;
  label?: string;
}) {
  return (
    <section className="cta-panel">
      <h2>{title}</h2>
      <ButtonLink href={href} light>
        {label}
      </ButtonLink>
    </section>
  );
}

export function EnquiryForm({
  partnership = false,
  propertyTitle = "",
}: {
  partnership?: boolean;
  propertyTitle?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(
    partnership ? "Project marketing" : propertyTitle || "Residential"
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Please provide your name and contact phone number.");
      return;
    }
    setBusy(true);
    setError(null);

    try {
      const sourcePage = propertyTitle
        ? `Property: ${propertyTitle}`
        : partnership
        ? "Partner Page"
        : "Contact Page";

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          category,
          message: message.trim(),
          sourcePage,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to submit enquiry.");

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const whatsappFollowup = `https://wa.me/919777958275?text=${encodeURIComponent(
    `Hi NOVOHOMS, my name is ${name || "a visitor"}. I just submitted an enquiry regarding ${category}.`
  )}`;

  if (submitted) {
    return (
      <div className="form-card" style={{ textAlign: "center", padding: "60px 40px" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--ink)",
            color: "var(--gold)",
            margin: "0 auto 24px",
            display: "grid",
            placeItems: "center",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          ✓
        </div>
        <p className="eyebrow" style={{ color: "var(--gold)", marginBottom: 8 }}>
          Enquiry Received
        </p>
        <h3
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 500,
            margin: "0 0 16px",
          }}
        >
          Thank you, {name}.
        </h3>
        <p style={{ color: "#526660", fontSize: 14, maxWidth: 460, margin: "0 auto 30px" }}>
          Your enquiry has been saved and shared with our advisory team. A dedicated advisor will
          reach out to you shortly.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={whatsappFollowup}
            target="_blank"
            rel="noreferrer"
            className="button-link"
            style={{ background: "#2e7d58" }}
          >
            <span>Chat on WhatsApp now</span>
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setName("");
              setPhone("");
              setEmail("");
              setMessage("");
            }}
            className="button-link"
            style={{ background: "transparent", color: "var(--ink)", border: "1px solid var(--line)" }}
          >
            <span>Send another enquiry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            background: "#fdf2f2",
            borderLeft: "3px solid #e02424",
            padding: "12px 16px",
            fontSize: 13,
            color: "#9b1c1c",
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="enquiry-name">Full name *</label>
          <input
            id="enquiry-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="field">
          <label htmlFor="enquiry-phone">Phone number *</label>
          <input
            id="enquiry-phone"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        <div className="field">
          <label htmlFor="enquiry-email">Email address</label>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div className="field">
          <label htmlFor="enquiry-category">
            {partnership ? "Opportunity type" : "I'm interested in"}
          </label>
          <select
            id="enquiry-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {propertyTitle && <option value={propertyTitle}>{propertyTitle}</option>}
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Land & plots">Land & plots</option>
            <option value="Investment">Investment</option>
            {partnership && <option value="Project marketing">Project marketing</option>}
          </select>
        </div>
        <div className="field full">
          <label htmlFor="enquiry-message">Tell us more</label>
          <textarea
            id="enquiry-message"
            name="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="A few details about your requirements, timing, or budget"
          />
        </div>
        <div className="field full">
          <button className="button-link" type="submit" disabled={busy} style={{ width: "100%" }}>
            <span>{busy ? "Submitting enquiry…" : "Send enquiry"}</span>
            <svg viewBox="0 0 24 24">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}

export { CallbackForm } from "./CallbackForm";


