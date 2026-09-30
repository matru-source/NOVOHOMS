"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";

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
  const [notes, setNotes] = useState("");

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
      notes ? `Additional Notes: ${notes.trim()}` : null,
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
        <Reveal>
          <div className="partner-intake-header">
            <p className="partner-intake-eyebrow">Submit your opportunity</p>
            <h2 className="partner-intake-title">Tell Us What You Have.</h2>
            <p className="partner-intake-lead">
              Share the details and we&apos;ll explore how NOVOHOMS can help bring it to the right
              audience.
            </p>
          </div>
        </Reveal>

        {submitted ? (
          <Reveal>
            <div className="partner-success-card">
              <div className="partner-success-icon">✓</div>
              <p className="partner-intake-eyebrow" style={{ textAlign: "center" }}>
                Opportunity Received
              </p>
              <h3 className="partner-success-title">Thank you, {fullName}.</h3>
              <p className="partner-success-text">
                We have received your submission for <strong>{projectName || marketType}</strong>. Our
                leadership team will review the details and reach out within 24 to 48 hours.
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
                    setNotes("");
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

              {/* Step 1 */}
              <div className="partner-step-block">
                <span className="partner-step-label">Step 1</span>
                <label htmlFor="partner-market-type" className="partner-field-label">
                  What would you like to bring to market?
                </label>
                <select
                  id="partner-market-type"
                  value={marketType}
                  onChange={(e) => setMarketType(e.target.value)}
                  className="partner-select"
                >
                  <option value="Residential Project">Residential Project</option>
                  <option value="Commercial Project">Commercial Project</option>
                  <option value="Plotted Development / Land">Plotted Development / Land</option>
                  <option value="Luxury Villa / Residence">Luxury Villa / Residence</option>
                  <option value="Mixed-Use Development">Mixed-Use Development</option>
                  <option value="Other Opportunity">Other Opportunity</option>
                </select>
              </div>

              {/* Step 2 */}
              <div className="partner-step-block">
                <span className="partner-step-label">Step 2 — Tell us about it</span>
                <div className="partner-field-grid">
                  <div>
                    <label htmlFor="partner-project-name" className="partner-field-label">
                      Property / Project Name
                    </label>
                    <input
                      id="partner-project-name"
                      type="text"
                      placeholder="Property / Project Name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="partner-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="partner-location" className="partner-field-label">
                      Location
                    </label>
                    <input
                      id="partner-location"
                      type="text"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="partner-input"
                    />
                  </div>
                </div>

                <div className="partner-field-grid" style={{ marginBottom: 0 }}>
                  <div>
                    <label htmlFor="partner-size" className="partner-field-label">
                      Approximate Size
                    </label>
                    <input
                      id="partner-size"
                      type="text"
                      placeholder="Approximate Size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="partner-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="partner-price" className="partner-field-label">
                      Expected Price
                    </label>
                    <input
                      id="partner-price"
                      type="text"
                      placeholder="Expected Price / Price Range (Optional)"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="partner-input"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="partner-step-block">
                <span className="partner-step-label">Step 3 — Current status</span>
                <label htmlFor="partner-status" className="partner-field-label">
                  Current Status
                </label>
                <select
                  id="partner-status"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="partner-select"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Pre-Launch">Pre-Launch</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Planning Stage">Planning Stage</option>
                </select>
              </div>

              {/* Step 4 */}
              <div className="partner-step-block">
                <span className="partner-step-label">Step 4 — What do you need?</span>
                <label htmlFor="partner-need" className="partner-field-label">
                  What do you need from NOVOHOMS?
                </label>
                <select
                  id="partner-need"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  className="partner-select"
                >
                  <option value="Marketing & Sales Support">Marketing & Sales Support</option>
                  <option value="Exclusive Mandate">Exclusive Mandate</option>
                  <option value="Strategic Advisory & Positioning">Strategic Advisory & Positioning</option>
                  <option value="Investor Outreach">Investor Outreach</option>
                  <option value="End-to-End Project Launch">End-to-End Project Launch</option>
                </select>
              </div>

              {/* Step 5 */}
              <div className="partner-step-block">
                <span className="partner-step-label">Step 5 — Your contact details</span>
                <div className="partner-field-grid">
                  <div>
                    <label htmlFor="partner-full-name" className="partner-field-label">
                      Full Name *
                    </label>
                    <input
                      id="partner-full-name"
                      type="text"
                      placeholder="Full Name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="partner-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="partner-company" className="partner-field-label">
                      Company Name
                    </label>
                    <input
                      id="partner-company"
                      type="text"
                      placeholder="Company Name (Optional)"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="partner-input"
                    />
                  </div>
                </div>

                <div className="partner-field-grid">
                  <div>
                    <label htmlFor="partner-phone" className="partner-field-label">
                      Phone Number *
                    </label>
                    <input
                      id="partner-phone"
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="partner-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="partner-email" className="partner-field-label">
                      Email Address
                    </label>
                    <input
                      id="partner-email"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="partner-input"
                    />
                  </div>
                </div>

                <div style={{ marginTop: 24 }}>
                  <label htmlFor="partner-notes" className="partner-field-label">
                    Anything else?
                  </label>
                  <input
                    id="partner-notes"
                    type="text"
                    placeholder="Anything else you'd like to share?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="partner-input"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={busy}
                className="partner-submit-btn"
              >
                {busy ? "Submitting Opportunity..." : "Explore a Partnership ↗"}
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
