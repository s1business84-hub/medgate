import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Electivio - Medical Training Platform",
  description: "Find clinical observerships and electives in the UAE — requirements, availability, and applications in one place.",
  keywords: ["medical", "training", "observership", "electives", "UAE", "healthcare"],
  authors: [{ name: "Electivio Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
