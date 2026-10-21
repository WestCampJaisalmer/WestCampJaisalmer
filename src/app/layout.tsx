import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jaisalmer - Travel & Experiences | A Land of Golden Stories",
  description: "Heritage stays, luxury desert camps, thrilling tours and unforgettable experiences in the heart of Rajasthan.",
  keywords: "Jaisalmer tourism, Thar desert camp, Jaisalmer hotels, camel safari, Sam sand dunes, Rajasthan travel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
