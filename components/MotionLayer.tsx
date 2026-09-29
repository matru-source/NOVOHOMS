"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function MotionLayer() {
  const [finished, setFinished] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setFinished(true);
      return;
    }

    let frame = 0;
    let lastY = window.scrollY;
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const tilts = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));

    const render = () => {
      const y = window.scrollY;
      const velocity = Math.max(-18, Math.min(18, y - lastY));
      document.documentElement.style.setProperty("--scroll-velocity", `${velocity}`);
      parallax.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom > -120 && rect.top < window.innerHeight + 120) {
          const speed = Number(node.dataset.parallax || 0.08);
          const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
          node.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
        }
      });
      lastY = y;
      frame = requestAnimationFrame(render);
    };

    const cleanups = tilts.map((node) => {
      const move = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        node.style.setProperty("--tilt-x", `${(-y * 2.2).toFixed(2)}deg`);
        node.style.setProperty("--tilt-y", `${(x * 2.2).toFixed(2)}deg`);
      };
      const leave = () => {
        node.style.setProperty("--tilt-x", "0deg");
        node.style.setProperty("--tilt-y", "0deg");
      };
      node.addEventListener("pointermove", move);
      node.addEventListener("pointerleave", leave);
      return () => {
        node.removeEventListener("pointermove", move);
        node.removeEventListener("pointerleave", leave);
      };
    });

    frame = requestAnimationFrame(render);
    const timer = window.setTimeout(() => setFinished(true), 2100);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  if (finished) return null;
  return (
    <div className="site-loader" aria-hidden="true">
      <div className="loader-panel loader-panel-a" />
      <div className="loader-panel loader-panel-b" />
      <div className="loader-panel loader-panel-c" />
      <div className="loader-brand">
        <div className="loader-monogram" style={{ border: "none", background: "none", width: "auto", height: "auto" }}>
          <img src="/brand-mark.png" alt="NOVOHOMS" style={{ height: 54, width: "auto", display: "block" }} />
        </div>
        <span className="loader-name">NOVOHOMS</span>
        <i><b /></i>
      </div>
    </div>
  );
}
