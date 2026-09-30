"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Reveal } from "./Reveal";

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  ariaLabel,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={`partner-custom-select-wrap ${className}`} ref={containerRef}>
      <button
        type="button"
        className={`partner-custom-select-trigger ${open ? "is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className={value ? "select-val" : "select-placeholder"}>
          {value || placeholder || "Select option"}
        </span>
        <svg
          className={`select-chevron ${open ? "is-flipped" : ""}`}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#102d27"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul className="partner-custom-select-menu" role="listbox">
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <li
                key={opt}
                role="option"
                aria-selected={isSelected}
                className={`partner-select-option ${isSelected ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const MARKET_OPTIONS = [
  "Residential Project",
  "Commercial Project",
  "Mixed-Use Project",
  "Residential Property",
  "Commercial Property",
  "Land",
  "Plot",
  "Investment Opportunity",
  "Other",
];

const STATUS_OPTIONS = [
  "Upcoming",
  "Under Development",
  "Ready to Move",
  "Existing Property",
  "Unsold Inventory",
];

const NEED_OPTIONS = [
  "Marketing & Sales Support",
  "Lead Generation",
  "Property Listing",
  "Project Promotion",
  "Buyer / Investor Connections",
  "Strategic Advisory",
  "Partnership & Collaborations",
];

export function PartnerIntakeForm() {
  const [marketType, setMarketType] = useState("Residential Project");
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Upcoming");
  const [need, setNeed] = useState("Marketing & Sales Support");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError("Please provide your full name and contact phone number.");
      return;
    }
    setBusy(true);
    setError(null);

    const formattedMessage = [
      `Opportunity Type: ${marketType}`,
      projectName ? `Property / Project Name: ${projectName.trim()}` : null,
      location ? `Location: ${location.trim()}` : null,
      size ? `Approximate Size: ${size.trim()}` : null,
      price ? `Expected Price: ${price.trim()}` : null,
      `Current Status: ${currentStatus}`,
      `Need from NOVOHOMS: ${need}`,
      companyName ? `Company: ${companyName.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          category: `Partner: ${marketType}`,
          message: formattedMessage,
          sourcePage: "Partner Page - Opportunity Intake",
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to submit opportunity.");

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const whatsappLink = `https://wa.me/919777958275?text=${encodeURIComponent(
    `Hi NOVOHOMS, my name is ${fullName || "a partner"}. I submitted an opportunity regarding ${marketType}${
      projectName ? ` - ${projectName}` : ""
    }.`
  )}`;

  return (
    <section className="partner-intake-section">
      <div className="partner-intake-container">
        {/* Centered Editorial Header */}
        <Reveal>
          <div className="partner-intake-header">
            <div className="partner-intake-eyebrow-wrap">
              <span className="partner-intake-eyebrow">SUBMIT YOUR OPPORTUNITY</span>
              <span className="partner-intake-dash" />
            </div>
            <h2 className="partner-intake-title">
              Tell Us What You <em>Have.</em>
            </h2>
            <p className="partner-intake-lead">
              Share a few details and we&apos;ll explore how NOVOHOMS can help
              <br />
              bring it to the right audience.
            </p>
          </div>
        </Reveal>

        {submitted ? (
          <Reveal>
            <div className="partner-success-card">
              <div className="partner-success-icon">✓</div>
              <p className="partner-intake-eyebrow" style={{ textAlign: "center", marginBottom: 8 }}>
                Opportunity Received
              </p>
              <h3 className="partner-success-title">Thank you, {fullName}.</h3>
              <p className="partner-success-text">
                We have received your submission for <strong>{projectName || marketType}</strong>. Our
                team will review the details and reach out within 24 to 48 hours.
              </p>
              <div className="partner-success-actions">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="partner-whatsapp-btn"
                >
                  Direct WhatsApp Follow-up ↗
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setProjectName("");
                    setLocation("");
                    setSize("");
                    setPrice("");
                    setCompanyName("");
                  }}
                  className="partner-reset-btn"
                >
                  Submit Another Opportunity
                </button>
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={80}>
            <form onSubmit={handleSubmit} className="partner-intake-form" noValidate>
              {error && (
                <div className="partner-form-error" role="alert">
                  {error}
                </div>
              )}

              {/* Step 01 */}
              <div className="partner-step-card">
                <div className="partner-step-split-row">
                  <div className="partner-step-info-group">
                    <span className="partner-step-badge">01</span>
                    <span className="partner-step-vdivider" />
                    <div className="partner-step-titles">
                      <h3 className="partner-step-heading">
                        What would you like to bring to market?
                      </h3>
                      <p className="partner-step-sub">
                        Select the option that best describes your opportunity.
                      </p>
                    </div>
                  </div>
                  <CustomSelect
                    value={marketType}
                    onChange={setMarketType}
                    options={MARKET_OPTIONS}
                    ariaLabel="What would you like to bring to market?"
                  />
                </div>
              </div>

              {/* Step 02 */}
              <div className="partner-step-card">
                <div className="partner-step-info-group">
                  <span className="partner-step-badge">02</span>
                  <span className="partner-step-vdivider" />
                  <div className="partner-step-titles">
                    <h3 className="partner-step-heading">Tell us about it</h3>
                    <p className="partner-step-sub">Help us understand the key details.</p>
                  </div>
                </div>

                <div className="partner-step-inner-grid">
                  <div className="partner-inner-field">
                    <label htmlFor="partner-project-name" className="partner-inner-label">
                      Property / Project Name
                    </label>
                    <input
                      id="partner-project-name"
                      type="text"
                      placeholder="Enter property or project name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="partner-inner-input"
                    />
                  </div>
                  <div className="partner-inner-field">
                    <label htmlFor="partner-location" className="partner-inner-label">
                      Location
                    </label>
                    <input
                      id="partner-location"
                      type="text"
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="partner-inner-input"
                    />
                  </div>
                  <div className="partner-inner-field">
                    <label htmlFor="partner-size" className="partner-inner-label">
                      Approximate Size
                    </label>
                    <input
                      id="partner-size"
                      type="text"
                      placeholder="Enter size (sq ft / acres etc.)"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="partner-inner-input"
                    />
                  </div>
                  <div className="partner-inner-field">
                    <label htmlFor="partner-price" className="partner-inner-label">
                      Expected Price
                    </label>
                    <input
                      id="partner-price"
                      type="text"
                      placeholder="Enter expected price or range (Optional)"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="partner-inner-input"
                    />
                  </div>
                </div>
              </div>

              {/* Step 03 */}
              <div className="partner-step-card">
                <div className="partner-step-split-row">
                  <div className="partner-step-info-group">
                    <span className="partner-step-badge">03</span>
                    <span className="partner-step-vdivider" />
                    <div className="partner-step-titles">
                      <h3 className="partner-step-heading">Current status</h3>
                      <p className="partner-step-sub">Where are you in the process?</p>
                    </div>
                  </div>
                  <CustomSelect
                    value={currentStatus}
                    onChange={setCurrentStatus}
                    options={STATUS_OPTIONS}
                    placeholder="Select current status"
                    className="wide"
                    ariaLabel="Current status"
                  />
                </div>
              </div>

              {/* Step 04 */}
              <div className="partner-step-card">
                <div className="partner-step-split-row">
                  <div className="partner-step-info-group">
                    <span className="partner-step-badge">04</span>
                    <span className="partner-step-vdivider" />
                    <div className="partner-step-titles">
                      <h3 className="partner-step-heading">
                        What do you need from NOVOHOMS?
                      </h3>
                      <p className="partner-step-sub">Select the support you&apos;re looking for.</p>
                    </div>
                  </div>
                  <CustomSelect
                    value={need}
                    onChange={setNeed}
                    options={NEED_OPTIONS}
                    className="wide"
                    ariaLabel="What do you need from NOVOHOMS?"
                  />
                </div>
              </div>

              {/* Step 05 */}
              <div className="partner-step-card">
                <div className="partner-step-info-group">
                  <span className="partner-step-badge">05</span>
                  <span className="partner-step-vdivider" />
                  <div className="partner-step-titles">
                    <h3 className="partner-step-heading">Your contact details</h3>
                    <p className="partner-step-sub">Let&apos;s stay in touch.</p>
                  </div>
                </div>

                <div className="partner-step-inner-grid">
                  <div className="partner-inner-field">
                    <label htmlFor="partner-full-name" className="partner-inner-label">
                      Full Name *
                    </label>
                    <input
                      id="partner-full-name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="partner-inner-input"
                    />
                  </div>
                  <div className="partner-inner-field">
                    <label htmlFor="partner-company" className="partner-inner-label">
                      Company Name
                    </label>
                    <input
                      id="partner-company"
                      type="text"
                      placeholder="Enter company name (Optional)"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="partner-inner-input"
                    />
                  </div>
                  <div className="partner-inner-field">
                    <label htmlFor="partner-phone" className="partner-inner-label">
                      Phone Number *
                    </label>
                    <input
                      id="partner-phone"
                      type="tel"
                      placeholder="Enter phone number"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="partner-inner-input"
                    />
                  </div>
                  <div className="partner-inner-field">
                    <label htmlFor="partner-email" className="partner-inner-label">
                      Email Address *
                    </label>
                    <input
                      id="partner-email"
                      type="email"
                      placeholder="Enter email address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="partner-inner-input"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="partner-submit-row">
                <button
                  type="submit"
                  disabled={busy}
                  className="partner-main-submit-btn"
                >
                  {busy ? "Submitting Opportunity..." : "Explore a Partnership →"}
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
