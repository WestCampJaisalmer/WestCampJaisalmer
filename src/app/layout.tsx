import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const autumnScript = localFont({
  src: "./fonts/Autumn-in-Philadelphia-Script-Exfont7da5.otf",
  variable: "--font-autumn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jaisalmer - Travel & Experiences | A Land of Golden Stories",
  description: "Heritage stays, luxury desert camps, thrilling tours and unforgettable experiences in the heart of Rajasthan.",
  keywords: "Jaisalmer tourism, Thar desert camp, Jaisalmer hotels, camel safari, Sam sand dunes, Rajasthan travel",
};

import { CurrencyProvider } from "@/context/CurrencyContext";
import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${autumnScript.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased text-text-main bg-cream">
        <CurrencyProvider>
          {children}
          <ScrollToTop />
        </CurrencyProvider>
      </body>
    </html>
  );
}
