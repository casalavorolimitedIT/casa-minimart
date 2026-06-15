// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { DevToolbarWrapper } from "./DevToolbarWrapper";
import { QueryProvider } from "@/components/providers/query-provider";
import ReduxProvider from "@/components/providers/redux-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casalavoro MiniMart",
  description: "A mini supermarket built for quest by Casalavoro",
  icons: {
    icon: [
      {
        url: "/casalogo2.png",
        href: "/casalogo2.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/png" href="/casalogo2.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <TooltipProvider>
            <QueryProvider>{children}</QueryProvider>
            <Toaster position="top-right" closeButton />
          </TooltipProvider>
        </ReduxProvider>
        <DevToolbarWrapper />
      </body>
    </html>
  );
}
