import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { siteLinks } from "@/lib/site-config";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const siteUrl = "https://ai.divyanshraj.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Divyansh Raj | Java Full-Stack · AI Portfolio",
  description:
    "Java Full-Stack Developer (Spring Boot, Angular). 3+ years shipping SlantPOS & SaaS. Chat or voice — ask about projects, skills, and hiring.",
  openGraph: {
    title: "Divyansh Raj | Java Full-Stack · AI Portfolio",
    description:
      "Production POS & SaaS · Spring Boot & Angular. Ask about my work — chat or voice.",
    url: siteUrl,
    siteName: "Divyansh Raj",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: siteLinks.xHandle,
    creator: siteLinks.xHandle,
    title: "Divyansh Raj | Java Full-Stack · AI Portfolio",
    description:
      "SlantPOS, TechPlusNexus, TutorPe & more — chat with my AI portfolio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
