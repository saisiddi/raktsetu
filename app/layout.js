import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DemoBanner from "@/components/DemoBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { t } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://raktsetu-three.vercel.app"),
  title: "RaktSetu — Privacy-first blood donor & recipient connect platform",
  description:
    "Find nearby blood banks, post verified urgent blood requests, and connect with opt-in donors through masked, in-app contact.",
  openGraph: {
    type: "website",
    url: "https://raktsetu-three.vercel.app",
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

// Runs before first paint so a saved dark preference doesn't flash light.
const themeScript = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        {/* First thing to receive focus: hidden until a keyboard user tabs to it. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark"
        >
          {t("nav.skipToMain")}
        </a>
        <DemoBanner />
        <Navbar />
        {/* tabIndex={-1} lets the skip link move focus here without adding a tab stop. */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus:outline-none"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
