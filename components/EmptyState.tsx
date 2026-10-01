"use client";

import Link from "next/link";
import { WhatsAppIcon } from "./SiteShell";
import { whatsapp } from "@/data/site";

export interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    isWhatsApp?: boolean;
  };
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export function EmptyState({
  eyebrow = "Expanding Portfolio",
  title,
  description,
  primaryAction = { label: "View all opportunities" },
  secondaryAction = {
    label: "Talk to an advisor",
    href: whatsapp,
    isWhatsApp: true,
  },
  imageSrc = "/empty-state-advisor-transparent.webp",
  imageAlt = "NOVOHOMS Real Estate Advisor",
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`empty-state-container ${className}`}>
      <div className="empty-state-content">
        {eyebrow && (
          <div className="empty-state-eyebrow">
            <span>{eyebrow}</span>
          </div>
        )}

        <h2 className="empty-state-title">{title}</h2>

        <p className="empty-state-desc">{description}</p>

        <div className="empty-state-actions">
          {primaryAction &&
            (primaryAction.href ? (
              <Link href={primaryAction.href} className="empty-state-btn">
                <span>{primaryAction.label}</span>
                <span className="empty-state-arrow">→</span>
              </Link>
            ) : (
              <button
                type="button"
                className="empty-state-btn"
                onClick={primaryAction.onClick}
              >
                <span>{primaryAction.label}</span>
                <span className="empty-state-arrow">→</span>
              </button>
            ))}

          {secondaryAction &&
            (secondaryAction.isWhatsApp ? (
              <a
                href={secondaryAction.href || whatsapp}
                target="_blank"
                rel="noreferrer"
                className="empty-state-secondary-btn"
              >
                <WhatsAppIcon size={14} />
                <span>{secondaryAction.label}</span>
              </a>
            ) : secondaryAction.href ? (
              <Link href={secondaryAction.href} className="empty-state-secondary-btn">
                <span>{secondaryAction.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                className="empty-state-secondary-btn"
                onClick={secondaryAction.onClick}
              >
                <span>{secondaryAction.label}</span>
              </button>
            ))}
        </div>
      </div>

      <div className="empty-state-visual">
        <div className="empty-state-visual-aura" aria-hidden="true" />
        <img
          src={imageSrc}
          alt={imageAlt}
          className="empty-state-advisor-img"
          decoding="async"
        />
      </div>
    </div>
  );
}
