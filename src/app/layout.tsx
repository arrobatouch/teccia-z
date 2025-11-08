import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TECCIA-Z - ORUS Control Center",
  description: "Advanced control center for ORUS cognitive ecosystem. Monitor and interact with AI agents in real-time.",
  keywords: ["TECCIA-Z", "ORUS", "AI", "Cognitive Computing", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "TECCIA Team" }],
  icons: {
    icon: "/teccia-logo.png",
  },
  openGraph: {
    title: "TECCIA-Z - ORUS Control Center",
    description: "Advanced control center for ORUS cognitive ecosystem",
    siteName: "TECCIA-Z",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TECCIA-Z - ORUS Control Center",
    description: "Advanced control center for ORUS cognitive ecosystem",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
