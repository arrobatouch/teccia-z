import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "🧠 ORUS Control Center",
  description: "Panel de control del ecosistema cognitivo distribuido ORUS",
  keywords: ["ORUS", "IA", "Modelscope", "AnythingLLM", "Control Center"],
  authors: [{ name: "ORUS Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ORUS Control Center",
    description: "Panel de control del ecosistema cognitivo distribuido",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
