import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/layout/LenisProvider";
import Header from "@/components/layout/Header";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MakerlyAI | We Build, You Grow",
  description: "Award-winning full-service digital agency. Explore our premium designs, glassmorphism UI, and 3D experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <LenisProvider>
          <Header />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
