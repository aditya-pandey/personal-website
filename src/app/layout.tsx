import type { Metadata } from "next";
import { Geist, Newsreader, Noto_Serif_Devanagari } from "next/font/google";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DeepLinkHandler } from "@/components/DeepLinkHandler";
import { CommandMenu } from "@/components/CommandMenu";
import { GoogleAnalyticsTracker } from "@/components/GoogleAnalyticsTracker";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-noto-serif-devanagari",
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari"],
});

export const metadata: Metadata = {
  title: "aditya",
  description: "Space for thoughts, poetry, and experiments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${newsreader.variable} ${notoSerifDevanagari.variable} h-full antialiased`}
    >
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2PP9ZZ4TMT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2PP9ZZ4TMT');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-serif bg-canvas text-ink transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GoogleAnalyticsTracker />
          <Navigation />
          <main className="flex-grow flex flex-col items-center">
            {children}
          </main>
          <Footer />
          <DeepLinkHandler />
          <CommandMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
