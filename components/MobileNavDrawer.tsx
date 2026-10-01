"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BrandMark } from "./SiteShell";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isNavActive: (href: string) => boolean;
}

function NavIconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5z" />
      <polyline points="9 21 9 13 15 13 15 21" />
    </svg>
  );
}

function NavIconAbout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function NavIconOpportunities() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V10h6v12M12 22V4h6v18M2 22h20" />
      <line x1="8" y1="13" x2="10" y2="13" />
      <line x1="8" y1="16" x2="10" y2="16" />
      <line x1="14" y1="7" x2="16" y2="7" />
      <line x1="14" y1="10" x2="16" y2="10" />
      <line x1="14" y1="13" x2="16" y2="13" />
      <line x1="14" y1="16" x2="16" y2="16" />
    </svg>
  );
}

function NavIconHelp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-1.4 1.4" />
      <path d="m18 10 1.3-1.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0L12 8" />
      <path d="m3 7 3-3a2 2 0 0 1 2.8 0L12 7l-3 3-4.2-4.2a1 1 0 0 0-1.4 0l-.4.4" />
      <path d="m7 17-2.3 2.3a1 1 0 0 1-1.4 0L2 18l5-5" />
    </svg>
  );
}

function NavIconPartner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function NavIconJournal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <rect x="6" y="8" width="4" height="4" />
      <line x1="13" y1="8" x2="17" y2="8" />
      <line x1="13" y1="12" x2="17" y2="12" />
      <line x1="6" y1="16" x2="17" y2="16" />
    </svg>
  );
}

function NavIconContact() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <polyline points="3 7 12 13 21 7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const navItems = [
  { label: "Home", href: "/", icon: NavIconHome },
  { label: "About", href: "/about", icon: NavIconAbout },
  { label: "Opportunities", href: "/opportunities", icon: NavIconOpportunities },
  { label: "How we help", href: "/how-we-help", icon: NavIconHelp },
  { label: "Partner", href: "/partner", icon: NavIconPartner },
  { label: "Journal", href: "/insights", icon: NavIconJournal },
  { label: "Contact", href: "/contact", icon: NavIconContact },
];

export function MobileNavDrawer({ isOpen, onClose, isNavActive }: MobileNavDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <aside
      className={`mobile-nav-wrapper ${isOpen ? "is-open" : ""}`}
      aria-hidden={!isOpen}
    >
      <div
        className="mobile-nav-backdrop"
        onClick={onClose}
        aria-label="Close navigation overlay"
      />
      <div className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        {/* Top Header */}
        <div className="mobile-nav-header">
          <Link href="/" className="brand mobile-nav-brand" onClick={onClose} aria-label="NOVOHOMS home">
            <BrandMark size={28} />
            <span>NOVOHOMS</span>
          </Link>
          <button
            type="button"
            className="mobile-nav-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Links List */}
        <nav className="mobile-nav-list" aria-label="Mobile menu links">
          {navItems.map((item) => {
            const active = isNavActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`mobile-nav-link ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {active && <span className="mobile-nav-active-indicator" />}
                <span className="mobile-nav-link-left">
                  <span className="mobile-nav-link-icon">
                    <Icon />
                  </span>
                  <span className="mobile-nav-link-title">{item.label}</span>
                </span>
                <span className="mobile-nav-link-chevron">
                  <ChevronRight />
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Footer */}
        <div className="mobile-nav-footer">
          <div className="mobile-nav-gold-rule" />
          <p className="mobile-nav-tagline">
            Better decisions.
            <br />
            Brighter tomorrows.
          </p>
          <div className="mobile-nav-socials">
            <a
              href="https://www.linkedin.com/company/novohoms"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="mobile-nav-social-btn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/novohoms"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="mobile-nav-social-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@novohoms"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="mobile-nav-social-btn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.19 26.3 26.3 0 0 0 2 12a26.3 26.3 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77 26.3 26.3 0 0 0 .42-4.81 26.3 26.3 0 0 0-.42-4.81zM10 15V9l5.2 3L10 15z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
