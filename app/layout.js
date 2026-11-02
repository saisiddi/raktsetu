import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DemoBanner from "@/components/DemoBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BASE_URL } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: "RaktSetu — Privacy-first blood donor & recipient connect platform",
  description:
    "Find nearby blood banks, post verified urgent blood requests, and connect with opt-in donors through masked, in-app contact.",
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "RaktSetu",
    locale: "en_US",
    title: "RaktSetu — Privacy-first blood donor & recipient connect platform",
    description:
      "Find nearby blood banks, post verified urgent blood requests, and connect with opt-in donors through masked, in-app contact.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RaktSetu — Privacy-first blood donor & recipient connect platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RaktSetu — Privacy-first blood donor & recipient connect platform",
    description:
      "Find nearby blood banks, post verified urgent blood requests, and connect with opt-in donors through masked, in-app contact.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <DemoBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
