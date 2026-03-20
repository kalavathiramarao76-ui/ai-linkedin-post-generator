import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared Post — PostCraft AI",
  description:
    "Check out this LinkedIn post created with PostCraft AI. Generate your own high-engagement posts for free.",
  openGraph: {
    title: "Shared Post — PostCraft AI",
    description:
      "Check out this LinkedIn post created with PostCraft AI. Generate your own high-engagement posts for free.",
    type: "article",
    siteName: "PostCraft AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shared Post — PostCraft AI",
    description:
      "Check out this LinkedIn post created with PostCraft AI. Generate your own high-engagement posts for free.",
  },
};

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
