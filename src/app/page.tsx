"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sparkles,
  PenLine,
  Lightbulb,
  Hash,
  LayoutTemplate,
  RefreshCw,
  ArrowRight,
  Zap,
  Eye,
  Globe,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: PenLine,
    title: "Post Generator",
    description:
      "Enter any topic and get a polished LinkedIn post in your chosen style — thought leadership, storytelling, how-to, and more.",
  },
  {
    icon: Sparkles,
    title: "Post Optimizer",
    description:
      "Paste an existing post and AI rewrites it with better hooks, formatting, CTAs, and hashtags for maximum engagement.",
  },
  {
    icon: Lightbulb,
    title: "Hook Generator",
    description:
      "Generate 10 attention-grabbing opening lines for any topic. The first line decides if people click 'see more'.",
  },
  {
    icon: Hash,
    title: "Hashtag Suggester",
    description:
      "AI suggests relevant hashtags based on your content — a perfect mix of high-reach and niche tags.",
  },
  {
    icon: LayoutTemplate,
    title: "Post Templates",
    description:
      "Pre-built templates for career updates, achievements, insights, questions, and more. Ready to customize.",
  },
  {
    icon: RefreshCw,
    title: "Tone Adjuster",
    description:
      "Rewrite posts in different tones — professional, casual, inspirational, humorous — to match your brand voice.",
  },
  {
    icon: Globe,
    title: "Multilingual",
    description:
      "Generate posts in 10 languages — English, Spanish, French, German, Portuguese, Hindi, Japanese, Chinese, Arabic, and Korean.",
    badge: "New",
  },
];

const stats = [
  { value: "6", label: "Writing Styles" },
  { value: "10", label: "Languages" },
  { value: "8+", label: "Post Templates" },
  { value: "Free", label: "No Signup" },
];

const examplePost = `I've hired 200+ engineers in 10 years.

Here's the #1 mistake I see in interviews:

Candidates try to prove they're smart.

Instead of showing they can solve problems.

There's a huge difference.

Smart people talk about what they KNOW.
Problem solvers talk about what they've DONE.

Next time you interview, try this:

\u2192 Start with the problem, not the tech stack
\u2192 Explain your decision-making process
\u2192 Share what you'd do differently
\u2192 Ask questions that show you think in systems

The best hire I ever made couldn't solve the algorithm question.

But she asked 3 questions that completely reframed the problem.

That's the difference.

#Hiring #Engineering #CareerAdvice #Interviews`;

function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
    </div>
  );
}

function StaggeredCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100 + index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <AnimatedBackground />

      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-zinc-950/60 backdrop-blur-2xl" role="navigation" aria-label="Main navigation">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600" aria-hidden="true">
              <Zap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              PostCraft
            </span>
          </div>
          <Link href="/app" className="btn-primary !text-sm" aria-label="Open PostCraft application">
            Open App
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden z-10" aria-label="Hero section">
        <div
          className={`relative mx-auto max-w-4xl text-center transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-indigo-300 mb-8">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            AI-Powered LinkedIn Content Creation
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Write LinkedIn posts
            <br />
            <span className="text-gradient-hero">that go viral</span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Generate high-engagement LinkedIn posts in seconds. Choose your style,
            optimize for engagement, and preview before publishing.
            Free, no signup required. Now in 10 languages.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/app" className="btn-primary !px-8 !py-3 !text-base glow" aria-label="Start creating LinkedIn posts">
              Start Creating
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/app/templates"
              className="btn-secondary !px-6 !py-3 !text-base"
              aria-label="View post templates"
            >
              View Templates
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StaggeredCard key={stat.label} index={i}>
                <div className="text-center glass-card !p-4">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
                </div>
              </StaggeredCard>
            ))}
          </div>
        </div>
      </section>

      {/* Example Post Preview */}
      <section className="py-16 px-6 relative z-10" aria-label="Example post">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              See what AI can create
            </h2>
            <p className="text-zinc-400 mt-2">
              Generated in under 10 seconds. Ready to copy-paste.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="glass-card !p-0 overflow-hidden">
              {/* LinkedIn Card Header */}
              <div className="flex items-start gap-3 p-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg" aria-hidden="true">
                  J
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-zinc-100">
                    Jane Smith
                  </p>
                  <p className="text-xs text-zinc-400">VP of Engineering | Tech Leader</p>
                  <p className="text-xs text-zinc-500 mt-0.5">2h ago</p>
                </div>
              </div>

              <div className="px-4 pb-4">
                <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                  {examplePost}
                </p>
              </div>

              <div className="px-4 py-2 flex items-center justify-between border-t border-white/5 text-xs text-zinc-500">
                <span>2,847 reactions</span>
                <span>198 comments</span>
              </div>
            </div>

            <p className="text-center text-xs text-zinc-600 mt-4">
              Generated with PostCraft AI in the &quot;Thought Leader&quot; style
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 relative z-10" id="features" aria-label="Features">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              Everything you need to dominate LinkedIn
            </h2>
            <p className="text-zinc-400 mt-3 max-w-xl mx-auto">
              A complete toolkit for creating, optimizing, and managing your
              LinkedIn content strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <StaggeredCard key={feature.title} index={index}>
                <div className="glass-card group transition-all h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600/20 transition-colors">
                      <feature.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    {"badge" in feature && feature.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </StaggeredCard>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-white/5 relative z-10" aria-label="How it works">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              Three steps to viral content
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: PenLine,
                title: "Enter your topic",
                desc: "Type any topic, idea, or paste an existing post you want to improve.",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "Choose your style",
                desc: "Pick from 6 writing styles, 6 tones, and 10 languages. AI crafts the perfect post.",
              },
              {
                step: "03",
                icon: Eye,
                title: "Preview & publish",
                desc: "Preview how it looks on LinkedIn, tweak if needed, copy and publish.",
              },
            ].map((item, index) => (
              <StaggeredCard key={item.step} index={index}>
                <div className="text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-indigo-400 mb-4" aria-hidden="true">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-indigo-500 mb-2">
                    STEP {item.step}
                  </p>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">{item.desc}</p>
                </div>
              </StaggeredCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative z-10" aria-label="Call to action">
        <div className="mx-auto max-w-3xl text-center">
          <div className="glass-card !p-12 glow-lg">
            <h2 className="text-3xl font-bold text-white">
              Ready to level up your LinkedIn game?
            </h2>
            <p className="mt-3 text-zinc-400">
              Start creating viral-worthy posts in seconds. No signup, no credit
              card, completely free.
            </p>
            <Link
              href="/app"
              className="btn-primary !px-10 !py-3.5 !text-base mt-8 inline-flex glow"
              aria-label="Start creating LinkedIn posts now"
            >
              Start Creating Now
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 relative z-10" role="contentinfo">
        <div className="mx-auto max-w-6xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600" aria-hidden="true">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-400">PostCraft AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
              WCAG 2.1 AA
            </span>
            <p className="text-xs text-zinc-600">
              Free & open source. Built with Next.js & AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
