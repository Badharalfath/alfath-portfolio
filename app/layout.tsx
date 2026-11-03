import type { Metadata } from "next";
import localFont from "next/font/local";
import "@fontsource/fragment-mono/400.css";
import "lenis/dist/lenis.css";
import "./globals.css";

const clashDisplay = localFont({
  src: "./fonts/clash-display-600.woff2",
  variable: "--font-display-local",
  weight: "600",
  display: "swap",
});

const switzer = localFont({
  src: [
    { path: "./fonts/switzer-400.woff2", weight: "400" },
    { path: "./fonts/switzer-500.woff2", weight: "500" },
    { path: "./fonts/switzer-600.woff2", weight: "600" },
  ],
  variable: "--font-body-local",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alfath — Web Developer",
  description:
    "Portfolio of Alfatihnaman Badharija Putra Madvi, an Informatics Engineering graduate and junior web programmer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${clashDisplay.variable} ${switzer.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
