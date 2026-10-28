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

// Title / description / keywords are editable in Admin > Site settings.
export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
  };
}

import { CurrencyProvider } from "@/context/CurrencyContext";
import { ContentProvider } from "@/context/ContentContext";
import FloatingButtons from "@/components/FloatingButtons";
import AnnouncementBar from "@/components/AnnouncementBar";
import { getSiteContent } from "@/lib/content";

/**
 * Chrome's built-in Translate (e.g. a phone set to Hindi) swaps page text for <font> tags, but React keeps
 * pointing at the old text nodes. The next time React adds or removes something next to one of them
 * (a button switching to "Uploading…" / "Saving…") the browser throws and the whole page becomes
 * "This page couldn't load". This makes those two DOM calls tolerant instead of crashing.
 * Background: https://github.com/facebook/react/issues/11538
 */
const TRANSLATE_GUARD = `(function(){
  if (typeof Node !== "function" || !Node.prototype) return;
  var remove = Node.prototype.removeChild, insert = Node.prototype.insertBefore;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) {
      if (child.parentNode && this.contains(child)) return remove.call(child.parentNode, child);
      return child;
    }
    return remove.apply(this, arguments);
  };
  Node.prototype.insertBefore = function (node, ref) {
    if (ref && ref.parentNode !== this) {
      while (ref && ref.parentNode !== this) ref = ref.parentNode;
      return insert.call(this, node, ref || null);
    }
    return insert.apply(this, arguments);
  };
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${autumnScript.variable}`}>
      <head>
        {/* Must run before React hydrates, so it is an inline script at the top of <head>. */}
        <script dangerouslySetInnerHTML={{ __html: TRANSLATE_GUARD }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased text-text-main bg-cream">
        <ContentProvider content={content}>
          <CurrencyProvider>
            {children}
            <FloatingButtons />
            <AnnouncementBar />
          </CurrencyProvider>
        </ContentProvider>
      </body>
    </html>
  );
}
