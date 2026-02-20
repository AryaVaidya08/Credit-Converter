import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://credit-converter.vercel.app"),
  title: "AP Credit Calculator",
  description: "This website allows you to understand how many credits you will get for each college based on your AP scores.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AP Credit Calculator",
    description: "This website allows you to understand how many credits you will get for each college based on your AP scores.",
    url: "https://credit-converter.vercel.app",
    siteName: "AP Credit Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AP Credit Calculator",
    description: "This website allows you to understand how many credits you will get for each college based on your AP scores.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
