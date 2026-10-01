"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { whatsapp } from "@/data/site";

const MAX_PAGE_ARRIVALS = 3;

export function AssistantPeek() {
  const pathname = usePathname();
  // stage: 'idle' | 'monkey' | 'message' | 'retreating'
  const [stage, setStage] = useState<"idle" | "monkey" | "message" | "retreating">("idle");
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const appearanceCountRef = useRef(0);

  // Clear all pending timers
  const clearTimers = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
  };

  // Schedule the monkey appearance after idle duration without scrolling
  const scheduleAppearance = (delayMs: number) => {
    if (appearanceCountRef.current >= MAX_PAGE_ARRIVALS) return;
    clearTimers();

    idleTimerRef.current = setTimeout(() => {
      if (appearanceCountRef.current >= MAX_PAGE_ARRIVALS) return;
      appearanceCountRef.current += 1;

      // 1. Monkey appears from the right
      setStage("monkey");

      // 2. Exactly 1 second later: deliver speech bubble message
      messageTimerRef.current = setTimeout(() => {
        setStage("message");

        // 3. Auto-retreat after 4.5 seconds if no click or scroll
        dismissTimerRef.current = setTimeout(() => {
          retreat(appearanceCountRef.current < MAX_PAGE_ARRIVALS);
        }, 4500);
      }, 1000);
    }, delayMs);
  };

  const retreat = (scheduleNext = true) => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);

    setStage("retreating");
    setTimeout(() => {
      setStage("idle");
      // If user remains idle without scrolling, schedule next appearance in 10s (max 3 per page)
      if (scheduleNext && appearanceCountRef.current < MAX_PAGE_ARRIVALS) {
        scheduleAppearance(10000);
      }
    }, 550);
  };

  // Reset count and start timer whenever user navigates to a new page
  useEffect(() => {
    appearanceCountRef.current = 0;
    setStage("idle");
    clearTimers();
    scheduleAppearance(5000);

    return () => {
      clearTimers();
    };
  }, [pathname]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // If monkey or message is currently shown, dismiss it immediately
      setStage((prev) => {
        if (prev === "monkey" || prev === "message") {
          retreat(false);
        }
        return prev;
      });

      // If under maximum arrivals on this page, wait for 10 seconds of idle
      if (appearanceCountRef.current < MAX_PAGE_ARRIVALS) {
        scheduleAppearance(10000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimers();
    };
  }, []);

  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    retreat(false);
    const assistantWa =
      "https://wa.me/919777958275?text=" +
      encodeURIComponent("Hi NOVOHOMS, I'd like to speak with an assistant.");
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
      {/* Speech Bubble (Delivered 1 second after monkey appears) */}
      <div
        className={`assistant-bubble-frame ${stage === "message" ? "is-visible" : ""}`}
        onClick={handleClick}
      >
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
      <div className="assistant-monkey-frame" onClick={handleClick}>
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
