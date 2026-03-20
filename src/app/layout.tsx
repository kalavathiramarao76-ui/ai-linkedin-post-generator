import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
  openGraph: {
    title: "PostCraft AI - LinkedIn Post Generator",
    description:
      "Generate high-engagement LinkedIn posts with AI. Free, no signup required.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostCraft AI - LinkedIn Post Generator",
    description:
      "Generate high-engagement LinkedIn posts with AI. Free, no signup required.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
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
