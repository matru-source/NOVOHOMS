"use client";

import { whatsapp } from "@/data/site";

export function ContactQuickStrip() {
  return (
    <section className="contact-quick-strip-section">
      <div className="contact-quick-strip-container">
        <div className="contact-quick-strip-banner">
          <img
            src="/contact-strip.png"
            alt="NOVOHOMS Contact Channels: Call Us, WhatsApp, Email Us, Get Directions"
            width={2048}
            height={682}
            className="contact-quick-strip-img"
          />

          {/* Interactive clickable zones over the 4 sections */}
          <div className="contact-quick-strip-overlay" aria-label="Direct contact channels">
            <a
              href="tel:+919777958275"
              className="quick-strip-link"
              title="Call us: 9777958275"
              aria-label="Call Us: 9777958275"
            >
              <span className="sr-only">Call Us: 9777958275</span>
            </a>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="quick-strip-link"
              title="Chat on WhatsApp: 9777958275"
              aria-label="WhatsApp: 9777958275"
            >
              <span className="sr-only">WhatsApp: 9777958275</span>
            </a>

            <a
              href="mailto:hello@novohoms.com"
              className="quick-strip-link"
              title="Email: hello@novohoms.com"
              aria-label="Email Us: hello@novohoms.com"
            >
              <span className="sr-only">Email Us: hello@novohoms.com</span>
            </a>

            <a
              href="https://maps.google.com/?q=BMC+Bhawani+Mall+Saheed+Nagar+Bhubaneswar"
              target="_blank"
              rel="noreferrer"
              className="quick-strip-link"
              title="Get Directions: Saheed Nagar, Bhubaneswar"
              aria-label="Get Directions: Saheed Nagar, Bhubaneswar"
            >
              <span className="sr-only">Get Directions: Saheed Nagar, Bhubaneswar</span>
            </a>
          </div>
        </div>

        {/* Mobile accessible interactive cards */}
        <div className="contact-quick-strip-mobile">
          <a href="tel:+919777958275" className="quick-mobile-card">
            <div className="quick-mobile-icon">📞</div>
            <div className="quick-mobile-info">
              <b>Call Us</b>
              <small>9777958275</small>
            </div>
            <span className="quick-mobile-arrow">→</span>
          </a>

          <a href={whatsapp} target="_blank" rel="noreferrer" className="quick-mobile-card">
            <div className="quick-mobile-icon">💬</div>
            <div className="quick-mobile-info">
              <b>WhatsApp</b>
              <small>9777958275</small>
            </div>
            <span className="quick-mobile-arrow">→</span>
          </a>

          <a href="mailto:hello@novohoms.com" className="quick-mobile-card">
            <div className="quick-mobile-icon">✉️</div>
            <div className="quick-mobile-info">
              <b>Email Us</b>
              <small>hello@novohoms.com</small>
            </div>
            <span className="quick-mobile-arrow">→</span>
          </a>

          <a
            href="https://maps.google.com/?q=BMC+Bhawani+Mall+Saheed+Nagar+Bhubaneswar"
            target="_blank"
            rel="noreferrer"
            className="quick-mobile-card"
          >
            <div className="quick-mobile-icon">📍</div>
            <div className="quick-mobile-info">
              <b>Get Directions</b>
              <small>Saheed Nagar, Bhubaneswar</small>
            </div>
            <span className="quick-mobile-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
