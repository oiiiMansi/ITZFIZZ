"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollAnimationProps = {
  heroRef: React.RefObject<HTMLElement>;
};

const stats = [
  { value: "250%", label: "Growth" },
  { value: "120K", label: "Users" },
  { value: "98%", label: "Satisfaction" },
];

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ heroRef }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement[]>([]);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const els = [
        headingRef.current,
        taglineRef.current,
        ...statsRef.current,
      ].filter(Boolean);

      gsap.from(els, {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [heroRef]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-black via-slate-950 to-black flex flex-col items-center justify-center px-6 py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(56,189,248,0.12),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(244,114,182,0.12),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center gap-16">
        <div className="flex flex-col items-center gap-5">
          <p className="text-[10px] uppercase tracking-[0.45em] text-cyan-400/60">
            By the numbers
          </p>
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.2em] leading-tight"
            style={{ fontFamily: "Arial Black, Impact, sans-serif" }}
          >
            ItzFizz Brand
          </h2>
          <p
            ref={taglineRef}
            className="max-w-lg text-sm md:text-base text-neutral-400 leading-relaxed"
          >
            A scroll-driven, premium-grade experience for the ItzFizz brand.
            Built with speed, precision, and unapologetic style.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-10">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              ref={(el) => { if (el) statsRef.current[index] = el; }}
              className="flex flex-col items-center justify-center gap-3 group"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div
                className="text-5xl md:text-6xl font-black tabular-nums"
                style={{ fontFamily: "Arial Black, Impact, sans-serif" }}
              >
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-neutral-400">
                {stat.label}
              </div>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollAnimation;