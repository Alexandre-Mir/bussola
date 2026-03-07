import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { StudyProvider } from "@/contexts/StudyContext";

export const metadata: Metadata = {
  title: "Bússola - Gestão de Estudos de Alta Performance",
  description: "Gerenciador de estudos sistêmicos com foco no método Cebraspe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-300 text-base-content`}
      >
        <StudyProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
          </div>
        </StudyProvider>
      </body>
    </html>
  );
}
