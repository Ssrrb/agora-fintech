import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Login-signup form",
  description: "Login-signup form layout",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <header className="flex justify-center items-center p-4 gap-4 h-16">
          {" "}
          {/* Header with fixed height*/}
          <div className="flex gap-4"></div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center">
          {/* Main content with flexbox for centering */}
          {children}
        </main>
      </body>
    </html>
  );
}
