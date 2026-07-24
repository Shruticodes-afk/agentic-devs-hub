import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ScrollToTop } from "@/components/scroll-to-top";

const inter = Inter({
  subsets: ["latin"],
  variable: "--next-font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--next-font-mono",
});

export const metadata: Metadata = {
  title: "Agentic Devs Collective Hub",
  description:
    "Connect with your local chapter, attend AI-powered events, and build the next generation of autonomous systems — together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ScrollToTop />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
