"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { nav, whatsapp } from "@/data/site";
import { MotionLayer } from "./MotionLayer";

export function WhatsAppIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.44 19.65L5.27 16.61L5.07 16.29C4.24 14.97 3.81 13.46 3.81 11.91C3.81 7.37 7.5 3.68 12.04 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.39C16.31 14.27 15.09 13.67 14.86 13.58C14.64 13.5 14.47 13.46 14.31 13.7C14.14 13.95 13.67 14.5 13.53 14.67C13.38 14.83 13.24 14.85 12.99 14.73C12.74 14.6 11.94 14.34 10.99 13.49C10.25 12.83 9.75 12.01 9.61 11.76C9.46 11.51 9.59 11.38 9.72 11.25C9.83 11.14 9.97 10.96 10.1 10.81C10.22 10.66 10.26 10.56 10.34 10.39C10.42 10.22 10.38 10.08 10.32 9.95C10.26 9.83 9.77 8.62 9.56 8.12C9.36 7.64 9.16 7.7 9.01 7.69C8.87 7.68 8.7 7.68 8.54 7.68C8.37 7.68 8.1 7.74 7.87 7.99C7.65 8.24 7.02 8.83 7.02 10.03C7.02 11.23 7.89 12.39 8.01 12.55C8.14 12.72 9.73 15.17 12.18 16.22C12.76 16.47 13.21 16.62 13.57 16.73C14.16 16.92 14.69 16.89 15.12 16.83C15.6 16.76 16.59 16.23 16.8 15.65C17 15.06 17 14.56 16.94 14.46C16.87 14.36 16.81 14.31 16.56 14.19V14.39Z" />
    </svg>
  );
}

export function BrandMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src="/brand-mark.png"
      alt="NOVOHOMS"
      width={Math.round(size * (56 / 46))}
      height={size}
      className={`brand-logo-mark ${className}`}
      style={{ height: size, width: "auto", display: "inline-block", verticalAlign: "middle" }}
    />
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function MotionLabel({ children }: { children: string }) {
  return (
    <span className="motion-label">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  const external = href.startsWith("http");
  const C = external ? "a" : Link;
  return (
    <C
      href={href}
      className={`button-link ${light ? "button-light" : ""}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span>{children}</span>
      <Arrow />
    </C>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? window.scrollY / height : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/admin")) return <>{children}</>;

  const allNavLinks = [
    ...nav,
    ["Contact", "/contact"] as const,
  ];

  const isNavActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/opportunities") {
      return pathname.startsWith("/opportunities") || pathname.startsWith("/properties");
    }
    if (href === "/insights") {
      return pathname.startsWith("/insights");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <MotionLayer />
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="brand" aria-label="NOVOHOMS home">
          <BrandMark size={34} />
          <span>NOVOHOMS</span>
        </Link>
        <nav className={open ? "open" : ""} aria-label="Main navigation">
          {allNavLinks.map(([label, href]) => {
            const active = isNavActive(href);
            return (
              <Link
                href={href}
                key={href}
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <MotionLabel>{label}</MotionLabel>
              </Link>
            );
          })}
        </nav>
        <div className="header-actions">
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="whatsapp"
            aria-label="Chat on WhatsApp"
            style={{ display: "grid", placeItems: "center" }}
          >
            <WhatsAppIcon size={18} />
          </a>
          <Link href="/contact" className="header-cta">
            Talk to an advisor
          </Link>
          <button
            className={`menu-button ${open ? "active" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <i />
            <i />
          </button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-lead">
          <p className="eyebrow">Your next move</p>
          <h2>
            Let&apos;s make it
            <br />
            <em>meaningful.</em>
          </h2>
          <ButtonLink href="/contact" light>
            Start a conversation
          </ButtonLink>
        </div>
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand footer-brand">
              <BrandMark size={30} />
              <span>NOVOHOMS</span>
            </Link>
            <p>Modern real estate advisory for the spaces and decisions that move you forward.</p>
          </div>
          <div>
            <span className="footer-label">Explore</span>
            {nav.map(([l, h]) => (
              <Link href={h} key={h}>
                {l}
              </Link>
            ))}
          </div>
          <div>
            <span className="footer-label">Connect</span>
            <a href="https://www.instagram.com/novohoms" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href="mailto:hello@novohoms.com">Email</a>
          </div>
          <div>
            <span className="footer-label">Visit</span>
            <p>
              Saheed Nagar
              <br />
              Bhubaneswar, Odisha
              <br />
              India 751007
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 NOVOHOMS</span>
          <div>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-of-use">Terms</Link>
          </div>
          <span>Spaces that move you forward.</span>
        </div>
      </footer>
      <a href={whatsapp} target="_blank" rel="noreferrer" className="floating-chat">
        <span>Chat with us</span>
        <b style={{ display: "grid", placeItems: "center" }}>
          <WhatsAppIcon size={20} />
        </b>
      </a>
    </>
  );
}
