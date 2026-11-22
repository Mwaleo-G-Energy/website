import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomTabBar from "@/components/BottomTabBar";
import { WixClientContextProvider } from "@/context/wixContext";
import { THEME_SCRIPT } from "@/lib/theme";

const dmSans = localFont({
  src: "../../public/fonts/dm-sans-latin.woff2",
  variable: "--font-sans",
  weight: "400 500",
  display: "swap",
});

const montserrat = localFont({
  src: "../../public/fonts/montserrat-latin.woff2",
  variable: "--font-display",
  weight: "700 800",
  display: "swap",
});

// Lets the page use the whole screen on iPhones, so the tab bar can sit above the home indicator.
export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Felicity Solar in Nairobi`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/share-image.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/share-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-KE" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${dmSans.variable} ${montserrat.variable} font-sans antialiased pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:pb-0`}>
        <WixClientContextProvider>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
          <Suspense fallback={null}>
            <BottomTabBar />
          </Suspense>
        </WixClientContextProvider>
        
      </body>
    </html>
  );
}
