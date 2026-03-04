"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type HeroProps = {
  heroRef: React.RefObject<HTMLElement>;
};

const LINE1 = "WELCOME";
const LINE2_ACCENT = "ITZFIZZ";
const stats = [
  { value: "250%", label: "Growth" },
  { value: "120K", label: "Users" },
  { value: "98%", label: "Satisfaction" },
];

const Hero: React.FC<HeroProps> = ({ heroRef }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement[]>([]);
  const line2Ref = useRef<HTMLSpanElement[]>([]);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement[]>([]);

  // Build line2 flat character array with accent/italic metadata
  const line2Flat = [
    ...LINE2_ACCENT.split("").map((c) => ({ c, accent: true, italic: false })),
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
          };

          if (isDesktop) {
            const all = [...line1Ref.current, ...line2Ref.current];
            gsap.set(carRef.current, { xPercent: -125 });
            gsap.set(all, { opacity: 0.06 });
            gsap.set(overlayRef.current, { opacity: 1 });
            gsap.set(statsRef.current, { opacity: 0, y: 28 });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top", // keep hero pinned until its bottom hits the top of the viewport
                scrub: 1.2,
                pin: containerRef.current,
                anticipatePin: 1,
              },
            });

            // Car sweeps left to center
            tl.to(carRef.current, { xPercent: 0, ease: "none", duration: 0.52 }, 0);

            // WELCOME letters reveal as car passes
            line1Ref.current.forEach((l, i) => {
              tl.to(l, { opacity: 1, ease: "power2.out", duration: 0.06 }, 0.18 + i * 0.042);
            });

            // "It's FIZZ" reveals just after
            line2Ref.current.forEach((l, i) => {
              tl.to(l, { opacity: 1, ease: "power2.out", duration: 0.055 }, 0.34 + i * 0.036);
            });

            // Veil fades out
            tl.to(overlayRef.current, { opacity: 0, ease: "power1.out", duration: 0.22 }, 0.18);

            // Car exits right
            tl.to(carRef.current, { xPercent: 128, ease: "none", duration: 0.14 }, 0.58);

            // Stats appear after car exits
            statsRef.current.forEach((s, i) => {
              tl.to(s, { opacity: 1, y: 0, ease: "power3.out", duration: 0.07 }, 0.76 + i * 0.06);
            });

            return () => {
              tl.scrollTrigger?.kill();
              tl.kill();
            };
          } else {
            // Mobile fallback
            const all = [...line1Ref.current, ...line2Ref.current];
            gsap.set(carRef.current, { xPercent: -100, opacity: 0 });
            gsap.set(all, { opacity: 0.1 });
            gsap.set(statsRef.current, { opacity: 0, y: 20 });

            const mobileTl = gsap.timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });

            mobileTl
              .to(carRef.current, { xPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out" })
              .to(all, { opacity: 1, stagger: 0.055, duration: 0.45, ease: "power2.out" }, "-=0.4")
              .to(statsRef.current, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power3.out" }, "-=0.1");

            return () => {
              mobileTl.scrollTrigger?.kill();
              mobileTl.kill();
            };
          }

          return undefined;
        }
      );

      return () => mm.revert();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (heroRef && typeof heroRef === "object") {
          (heroRef as React.MutableRefObject<HTMLElement | null>).current = el;
        }
      }}
      className="relative bg-black overflow-hidden min-h-screen"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_55%,rgba(56,189,248,0.10),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(244,114,182,0.08),transparent_50%)]" />

      {/* Sticky full-screen viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* Eyebrow */}
        <p className="relative z-20 mb-5 text-[10px] uppercase tracking-[0.45em] text-neutral-500">
          Scroll to explore
        </p>

        {/* Single-line heading: WELCOME  It's FIZZ */}
        <div className="relative z-10 w-full flex items-center justify-center pointer-events-none">
          <h1
            className="select-none font-black tracking-[0.10em] leading-none uppercase whitespace-nowrap"
            style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: "clamp(1.6rem, 6.5vw, 7rem)", WebkitTextStroke: "1.5px rgba(255,255,255,0.12)" }}
          >
            {LINE1.split("").map((char, i) => (
              <span key={`l1-${i}`} ref={(el) => { if (el) line1Ref.current[i] = el; }} className="inline-block" style={{ opacity: 0.06 }}>
                {char}
              </span>
            ))}
            <span className="inline-block" style={{ width: "0.5em" }} />
            {line2Flat.map((item, i) => (
              <span key={`l2-${i}`} ref={(el) => { if (el) line2Ref.current[i] = el; }} className="inline-block"
                style={{ opacity: 0.06, color: item.accent ? "#38bdf8" : "#ffffff", fontStyle: item.italic ? "italic" : "normal" }}>
                {item.c}
              </span>
            ))}
          </h1>
        </div>

        {/* Dark veil overlay — fades out on scroll */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-20"
          style={{ background: "radial-gradient(ellipse 75% 50% at 50% 48%, rgba(0,0,0,0.65) 0%, transparent 100%)" }}
        />

        {/* Car — drives across full viewport */}
        <div
          ref={carRef}
          className="absolute z-30 will-change-transform"
          style={{ top: "43%", left: 0, width: "100%", transform: "translateY(-50%)" }}
        >
          <div
            className="absolute blur-3xl"
            style={{ bottom: "-4%", left: "50%", transform: "translateX(-50%)", width: "50%", height: "40px", background: "rgba(56,189,248,0.28)", borderRadius: "50%" }}
          />
          <div className="relative mx-auto" style={{ width: "min(75vw, 950px)", aspectRatio: "2.6 / 1" }}>
            <Image src="/camaro.png" alt="Chevy Camaro" fill priority className="object-contain"
              style={{ filter: "drop-shadow(0 24px 90px rgba(56,189,248,0.55))" }}
            />
          </div>
        </div>

        {/* Ground line */}
        <div
          className="absolute z-10 h-px w-4/5"
          style={{ bottom: "19%", left: "10%", background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.22) 25%, rgba(56,189,248,0.22) 75%, transparent)" }}
        />

        {/* Stats — scroll-animated in after car exits */}
        <div className="relative z-25 w-full max-w-3xl px-6 mt-8">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label} ref={(el) => { if (el) statsRef.current[i] = el; }}
                className="flex flex-col items-center gap-2" style={{ opacity: 0 }}>
                <div className="h-px w-10 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                <div className="text-4xl md:text-5xl font-black tabular-nums" style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}>{stat.value}</div>
                <div className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">{stat.label}</div>
                <div className="h-px w-10 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;