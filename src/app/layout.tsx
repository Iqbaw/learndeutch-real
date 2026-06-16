import type { Metadata, Viewport } from "next";
import { Manrope, Atkinson_Hyperlegible, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SoundProvider } from "@/components/sound-provider";

const heading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deutsch Lernen in 30 Tagen — Belajar Bahasa Jerman 30 Hari per Level",
  description:
    "Kurikulum terstruktur, AI tutor, latihan speaking, grammar visual, dan statistik CEFR untuk orang Indonesia yang belajar bahasa Jerman dari nol sampai percaya diri.",
  applicationName: "Deutsch Lernen in 30 Tagen",
  keywords: [
    "belajar bahasa Jerman",
    "kursus Jerman online",
    "Goethe A1",
    "telc",
    "CEFR",
    "Deutsch lernen",
  ],
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${heading.variable} ${body.variable} ${mono.variable} font-body antialiased`}
      >
        <ThemeProvider>
          <SoundProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
