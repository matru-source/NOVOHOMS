"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

export function Reveal({ children, delay = 0, className = "", variant = "rise", tilt = false }: { children: ReactNode; delay?: number; className?: string; variant?: "rise" | "clip" | "slide"; tilt?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setVisible(true);
      observer.disconnect();
      window.removeEventListener("scroll", check);
    };
    const check = () => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.94) show();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) show();
    }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
    observer.observe(node);
    window.addEventListener("scroll", check, { passive: true });
    requestAnimationFrame(check);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", check);
    };
  }, []);

  return <div ref={ref} data-tilt={tilt ? "" : undefined} className={`reveal reveal-${variant} ${visible ? "is-visible" : ""} ${className}`} style={{ "--delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}

export function SplitText({ children }: { children: string }) {
  return <>{children.split(" ").map((word, i) => <span className="word" key={`${word}-${i}`} style={{ "--i": i } as CSSProperties}><span>{word}&nbsp;</span></span>)}</>;
}
