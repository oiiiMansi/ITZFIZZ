"use client";

import React, { useRef } from "react";
import Hero from "@/components/Hero";

export default function Page() {
  const heroRef = useRef<HTMLElement | null>(null);

  return (
    <main className="min-h-screen bg-black text-white">
      <Hero heroRef={heroRef} />
    </main>
  );
}

