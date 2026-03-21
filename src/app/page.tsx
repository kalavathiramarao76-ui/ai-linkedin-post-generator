"use client";

import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";
import { ArrowRight, Zap } from "lucide-react";

/* ── Style showcase data ── */
const styles = [
  {
    num: "01",
    name: "Thought Leader",
    example:
      "I've hired 200+ engineers. Here's the #1 mistake I see in interviews.",
  },
  {
    num: "02",
    name: "Story",
    example:
      "Last Tuesday I almost quit. Then a stranger on LinkedIn changed everything.",
  },
  {
    num: "03",
    name: "How-To",
    example:
      "5 steps to mass-produce LinkedIn hooks that get 10x more impressions.",
  },
  {
    num: "04",
    name: "Contrarian",
    example:
      "Unpopular opinion: your morning routine doesn't matter. Here's what does.",
  },
  {
    num: "05",
    name: "Listicle",
    example:
      "8 tools I use daily that nobody talks about. Number 4 saved me 6 hours a week.",
  },
  {
    num: "06",
    name: "Inspirational",
    example:
      "You don't need a big audience. You need the right 50 people reading your work.",
  },
];

/* ── IntersectionObserver hook for fade-up ── */
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-up-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  return setRef;
}

export default function LandingPage() {
  const containerRef = useFadeUp();

  return (
    <div ref={containerRef} className="landing-root">
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Single subtle blue gradient wash */}
      <div className="gradient-wash" aria-hidden="true" />

      {/* Nav */}
      <nav
        className="fixed top-0 z-50 w-full border-b border-white/[0.04] bg-[#0a0a0c]/80 backdrop-blur-2xl"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white"
              aria-hidden="true"
            >
              <Zap className="h-3.5 w-3.5 text-[#0a0a0c]" />
            </div>
            <span className="text-sm font-semibold text-white/90 tracking-tight">
              PostCraft
            </span>
          </div>
          <Link
            href="/app"
            className="text-sm text-white/60 hover:text-white transition-colors duration-300"
            aria-label="Open PostCraft application"
          >
            Open App
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative z-10 pt-44 pb-32 px-6"
        aria-label="Hero section"
      >
        <div className="mx-auto max-w-4xl">
          <h1 className="fade-up text-6xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-white leading-[1.05]">
            Write posts
            <br />
            that get noticed.
          </h1>
          <p className="fade-up mt-8 text-lg sm:text-xl text-white/40 max-w-xl leading-relaxed font-light">
            AI-powered LinkedIn content. Six styles. Ten languages.
            <br className="hidden sm:block" />
            No signup. Just write.
          </p>
          <div className="fade-up mt-12">
            <Link
              href="/app"
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-medium text-[#0a0a0c] transition-all duration-300 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Start creating LinkedIn posts"
            >
              Start Creating
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ribbon ── */}
      <section className="relative z-10 py-16 px-6" aria-label="Stats">
        <div className="mx-auto max-w-4xl">
          <div className="fade-up flex flex-wrap items-center gap-x-10 gap-y-4 text-sm font-mono text-white/30 tracking-wider uppercase">
            <span>6 Styles</span>
            <span className="text-white/10" aria-hidden="true">
              /
            </span>
            <span>10 Languages</span>
            <span className="text-white/10" aria-hidden="true">
              /
            </span>
            <span>8 Templates</span>
            <span className="text-white/10" aria-hidden="true">
              /
            </span>
            <span>Free</span>
          </div>
        </div>
      </section>

      {/* ── 6 Style showcase — editorial rows ── */}
      <section
        className="relative z-10 py-32 px-6"
        aria-label="Writing styles"
      >
        <div className="mx-auto max-w-4xl">
          <p className="fade-up text-xs font-mono text-white/20 uppercase tracking-[0.2em] mb-16">
            Six writing styles
          </p>

          <div className="space-y-0">
            {styles.map((style) => (
              <div
                key={style.num}
                className="fade-up style-row group"
              >
                <div className="flex items-baseline gap-6 sm:gap-10">
                  <span className="font-mono text-sm text-white/15 tabular-nums shrink-0">
                    {style.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white/90 tracking-tight group-hover:text-white transition-colors duration-300">
                      {style.name}
                    </h3>
                    <p className="mt-3 text-base text-white/25 leading-relaxed group-hover:text-white/40 transition-colors duration-300 max-w-2xl">
                      {style.example}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="relative z-10 py-40 px-6"
        aria-label="Call to action"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="fade-up text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
            Your next post
            <br />
            starts here.
          </h2>
          <div className="fade-up mt-12">
            <Link
              href="/app"
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-medium text-[#0a0a0c] transition-all duration-300 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Start creating LinkedIn posts now"
            >
              Start Creating
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 border-t border-white/[0.04] py-10 px-6"
        role="contentinfo"
      >
        <div className="mx-auto max-w-5xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-5 w-5 items-center justify-center rounded bg-white/10"
              aria-hidden="true"
            >
              <Zap className="h-2.5 w-2.5 text-white/40" />
            </div>
            <span className="text-xs text-white/20">PostCraft AI</span>
          </div>
          <p className="text-xs text-white/15">
            Free & open source. Built with Next.js.
          </p>
        </div>
      </footer>
    </div>
  );
}
