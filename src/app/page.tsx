"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, Zap } from "lucide-react";

/* -- Style showcase data -- */
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

/* -- IntersectionObserver hook for fade-up -- */
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

/* ---------- Letter Reveal Animation ---------- */
function LetterReveal({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="letter-reveal-char"
          style={{
            animationDelay: visible ? `${i * 30}ms` : '0ms',
            animationPlayState: visible ? 'running' : 'paused',
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

/* ---------- Typewriter Effect ---------- */
function Typewriter({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span ref={ref} className="typewriter-text">
      {displayed}
      <span className={`typewriter-cursor ${done ? 'typewriter-cursor-blink' : ''}`}>|</span>
    </span>
  );
}

/* ---------- Scroll Counter Animation ---------- */
function ScrollCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 800;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [started, end]);

  return (
    <span ref={ref} className="counter-animate">
      {count}{suffix}
    </span>
  );
}

/* ---------- 3D Tilt Card ---------- */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ---------- Parallax Section ---------- */
function ParallaxSection({ children, speed = 0.15, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    function onScroll() {
      const rect = el!.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      const offset = scrolled * speed;
      el!.style.transform = `translateY(${offset}px)`;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`parallax-layer ${className}`} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const containerRef = useFadeUp();

  return (
    <div ref={containerRef} className="landing-root scroll-snap-container">
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

      {/* -- Hero -- */}
      <section
        className="relative z-10 pt-44 pb-32 px-6 scroll-snap-section"
        aria-label="Hero section"
      >
        <ParallaxSection speed={-0.08}>
          <div className="mx-auto max-w-4xl">
            <h1 className="fade-up text-6xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-white leading-[1.05]">
              <LetterReveal text="Write posts" />
              <br />
              <LetterReveal text="that get noticed." />
            </h1>
            <p className="fade-up mt-8 text-lg sm:text-xl text-white/40 max-w-xl leading-relaxed font-light">
              <Typewriter text="AI-powered LinkedIn content. Six styles. Ten languages. No signup. Just write." speed={35} />
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
        </ParallaxSection>
      </section>

      {/* -- Stats ribbon -- */}
      <section className="relative z-10 py-16 px-6 scroll-snap-section" aria-label="Stats">
        <div className="mx-auto max-w-4xl">
          <div className="fade-up flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white font-mono">
                <ScrollCounter end={6} />
              </div>
              <div className="text-xs text-white/30 uppercase tracking-widest mt-1">Styles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white font-mono">
                <ScrollCounter end={10} />
              </div>
              <div className="text-xs text-white/30 uppercase tracking-widest mt-1">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white font-mono">
                <ScrollCounter end={8} />
              </div>
              <div className="text-xs text-white/30 uppercase tracking-widest mt-1">Templates</div>
            </div>
          </div>
        </div>
      </section>

      {/* -- 6 Style showcase -- editorial rows -- */}
      <section
        className="relative z-10 py-32 px-6 scroll-snap-section"
        aria-label="Writing styles"
      >
        <ParallaxSection speed={0.04}>
          <div className="mx-auto max-w-4xl">
            <p className="fade-up text-xs font-mono text-white/20 uppercase tracking-[0.2em] mb-16">
              Six writing styles
            </p>

            <div className="space-y-0">
              {styles.map((style) => (
                <TiltCard key={style.num}>
                  <div
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
                </TiltCard>
              ))}
            </div>
          </div>
        </ParallaxSection>
      </section>

      {/* -- Bottom CTA -- */}
      <section
        className="relative z-10 py-40 px-6 scroll-snap-section"
        aria-label="Call to action"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="fade-up text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
            <LetterReveal text="Your next post" />
            <br />
            <LetterReveal text="starts here." />
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

      {/* -- Footer -- */}
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
