import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast-provider";

// Use the standard Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RetailOs",
  description: "SaaS for Grocery Store Digitization",
  icons: '/favicon.ico',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}