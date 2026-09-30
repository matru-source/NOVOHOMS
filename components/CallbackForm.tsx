"use client";

import { FormEvent, useState } from "react";

export function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
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
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          category: "Callback Request",
          message: `Preferred Time: ${preferredTime.trim() || "Anytime / Flexible"}`,
          sourcePage: "Contact Page — Prefer a Call",
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to request callback.");

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="callback-card callback-card-success">
        <p className="eyebrow" style={{ color: "var(--gold)" }}>Request Received</p>
        <h3 style={{ font: "500 28px/1.2 var(--serif)", margin: "0 0 12px", color: "var(--ink)" }}>
          We&apos;ll be in touch.
        </h3>
        <p style={{ fontSize: 14, color: "#526660", lineHeight: 1.6, margin: "0 0 24px" }}>
          Thank you, <b>{name}</b>. A NOVOHOMS advisor will call you at <b>{phone}</b>
          {preferredTime ? ` around ${preferredTime}` : " shortly"}.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setName("");
            setPhone("");
            setPreferredTime("");
          }}
          className="callback-submit"
          style={{ background: "#2e7d58", width: "auto", padding: "0 28px" }}
        >
          Request Another Callback
        </button>
      </div>
    );
  }

  return (
    <div className="callback-card">
      <p className="eyebrow callback-eyebrow">Prefer a call?</p>
      <h3 className="callback-title">Prefer a Call?</h3>
      <p className="callback-lead">
        Leave your details and a NOVOHOMS advisor will get in touch.
      </p>

      {error && (
        <div style={{ color: "#a84d42", fontSize: 13, marginBottom: 18 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="callback-form">
        <div className="callback-field">
          <label htmlFor="cb-name">Your Name</label>
          <input
            id="cb-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
          />
        </div>

        <div className="callback-field">
          <label htmlFor="cb-phone">Phone Number</label>
          <input
            id="cb-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="callback-field">
          <label htmlFor="cb-time">Preferred Time</label>
          <input
            id="cb-time"
            type="text"
            list="cb-preferred-times"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            placeholder="e.g. Afternoon (2:00 PM – 4:00 PM)"
          />
          <datalist id="cb-preferred-times">
            <option value="Morning (10:00 AM – 1:00 PM)" />
            <option value="Afternoon (1:00 PM – 4:00 PM)" />
            <option value="Evening (4:00 PM – 7:00 PM)" />
            <option value="Anytime today" />
          </datalist>
        </div>

        <button type="submit" className="callback-submit" disabled={busy}>
          {busy ? "Submitting…" : "Request a Callback"}
        </button>
      </form>
    </div>
  );
}
