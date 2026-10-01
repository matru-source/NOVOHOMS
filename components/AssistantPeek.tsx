"use client";

import { useEffect, useRef, useState } from "react";
import { whatsapp } from "@/data/site";

export function AssistantPeek() {
  // stage: 'idle' | 'monkey' | 'message' | 'retreating'
  const [stage, setStage] = useState<"idle" | "monkey" | "message" | "retreating">("idle");
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredRef = useRef(false);

  const startIdleTimer = () => {
    if (hasTriggeredRef.current) return;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      // User has stayed 5s without scrolling
      setStage("monkey");
      hasTriggeredRef.current = true;

      // After 2 seconds, deliver the message (image 2)
      messageTimerRef.current = setTimeout(() => {
        setStage("message");

        // After 3 seconds of showing the message, slightly retreat/go away
        dismissTimerRef.current = setTimeout(() => {
          retreat();
        }, 3000);
      }, 2000);
    }, 5000);
  };

  const retreat = () => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);

    setStage("retreating");
    setTimeout(() => {
      setStage("idle");
      // Allow re-triggering after a graceful cooldown (45s of fresh browsing)
      setTimeout(() => {
        hasTriggeredRef.current = false;
      }, 45000);
    }, 600);
  };

  useEffect(() => {
    // Start initial 5-second countdown
    startIdleTimer();

    const handleScroll = () => {
      // If currently peeking or message delivered, dismiss on scroll
      if (stage === "monkey" || stage === "message") {
        retreat();
      } else if (stage === "idle" && !hasTriggeredRef.current) {
        // Reset 5s countdown on scroll
        startIdleTimer();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [stage]);

  const handleClick = () => {
    retreat();
    const assistantWa = "https://wa.me/919777958275?text=" + encodeURIComponent("Hi NOVOHOMS, I'd like to speak with an assistant.");
    window.open(assistantWa, "_blank");
  };

  if (stage === "idle") return null;

  return (
    <div
      className={`assistant-peek-container ${stage}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Want to talk to an assistant? Click to chat on WhatsApp"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      {/* Speech Bubble (Delivered 2 seconds after monkey appears) */}
      <div className={`assistant-bubble-frame ${stage === "message" ? "is-visible" : ""}`}>
        <img
          src="/assistant-bubble.webp"
          alt="Want to talk to an assistant?"
          width={440}
          height={195}
          className="assistant-bubble-img"
          loading="eager"
        />
      </div>

      {/* Peeking Monkey */}
      <div className="assistant-monkey-frame">
        <img
          src="/assistant-monkey.webp"
          alt="Assistant Monkey"
          width={217}
          height={432}
          className="assistant-monkey-img"
          loading="eager"
        />
      </div>
    </div>
  );
}
