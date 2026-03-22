import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://postcraft-ai.vercel.app";

export const metadata: Metadata = {
  title: "PostCraft AI - LinkedIn Post Generator | Create Viral Posts in Seconds",
  description:
    "Generate high-engagement LinkedIn posts with AI. Choose from 6 writing styles, optimize existing posts, generate hooks, and preview before publishing. Free, no signup required.",
  keywords: [
    "LinkedIn post generator",
    "AI LinkedIn writer",
    "LinkedIn content creator",
    "social media AI",
    "LinkedIn engagement",
    "post optimizer",
    "hook generator",
  ],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "PostCraft AI - LinkedIn Post Generator | Create Viral Posts in Seconds",
    description:
      "Generate high-engagement LinkedIn posts with AI. Choose from 6 writing styles, optimize existing posts, generate hooks, and preview before publishing. Free, no signup required.",
    type: "website",
    url: siteUrl,
    siteName: "PostCraft AI",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PostCraft AI - LinkedIn Post Generator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostCraft AI - LinkedIn Post Generator | Create Viral Posts in Seconds",
    description:
      "Generate high-engagement LinkedIn posts with AI. Choose from 6 writing styles, optimize existing posts, generate hooks, and preview before publishing. Free, no signup required.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@postcraft_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PostCraft AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Generate high-engagement LinkedIn posts with AI. Choose from 6 writing styles, optimize existing posts, generate hooks, and preview before publishing.",
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "120",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {/* Skip to content — visible only on focus */}
        <a
          href="#main-content"
          className="skip-to-content"
        >
          Skip to main content
        </a>
        <div id="main-content">
          {children}
        </div>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid #3f3f46",
              color: "#f4f4f5",
            },
          }}
        />
      </body>
    </html>
  );
}
