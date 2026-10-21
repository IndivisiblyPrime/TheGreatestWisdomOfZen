import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewportSync } from "@/components/ViewportSync";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Pages set their own titles and descriptions (see lib/site.ts); this resolves their
// relative canonical/preview URLs and names anything that doesn't, like the 404 page.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
};

export const viewport: Viewport = {
  // `cover` lets the fixed background photo run under the rounded corners and the
  // home indicator rather than stopping at a letterboxed safe area.
  viewportFit: "cover",
  // Without this, an opening keyboard resizes the visual viewport but not the layout,
  // which reintroduces exactly the fixed-layer/visible-area mismatch --app-h exists to
  // prevent — on /contact, where there are inputs to focus.
  interactiveWidget: "resizes-content",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ViewportSync />
        {children}
      </body>
    </html>
  );
}
