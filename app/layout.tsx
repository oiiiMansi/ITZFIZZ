import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ItzFizz Scroll Hero",
  description: "Scroll-driven animated hero built with Next.js, Tailwind, and GSAP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}

