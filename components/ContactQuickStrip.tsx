"use client";

import { Reveal } from "./Reveal";
import { whatsapp } from "@/data/site";

const contactCards = [
  {
    title: "Call Us",
    detail: "9777958275",
    href: "tel:+919777958275",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: "WhatsApp",
    detail: "9777958275",
    href: whatsapp,
    target: "_blank",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    title: "Email Us",
    detail: "hello@novohoms.com",
    href: "mailto:hello@novohoms.com",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    title: "Get Directions",
    detail: "Saheed Nagar, Bhubaneswar",
    href: "https://maps.google.com/?q=BMC+Bhawani+Mall+Saheed+Nagar+Bhubaneswar",
    target: "_blank",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export function ContactQuickStrip() {
  return (
    <section className="contact-quick-strip-section">
      <div className="contact-quick-strip-container">
        <div className="contact-cards-grid">
          {contactCards.map((item, index) => (
            <Reveal delay={index * 70} key={item.title}>
              <a
                href={item.href}
                target={item.target}
                rel={item.target ? "noreferrer" : undefined}
                className="contact-channel-box"
                aria-label={`${item.title}: ${item.detail}`}
              >
                <div className="channel-icon-bubble">
                  {item.icon}
                </div>
                <div className="channel-text-group">
                  <h3 className="channel-title">{item.title}</h3>
                  <p className="channel-detail">{item.detail}</p>
                </div>
                <div className="channel-action-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
