import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { couple } from "@/content/wedding";
import { TransitionProvider } from "@/components/PageTransition";
import { LightboxProvider } from "@/components/Lightbox";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/motion/Cursor";
import Snow from "@/components/Snow";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${couple.names} — ${couple.dateDisplay}`,
  description: `Join us as we celebrate the wedding of ${couple.names} on ${couple.dateDisplay} at ${couple.venue}.`,
};

export const viewport: Viewport = {
  themeColor: "#0b1420",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll />
        <TransitionProvider>
          <LightboxProvider>
            <Snow count={32} />
            {children}
            <Cursor />
          </LightboxProvider>
        </TransitionProvider>
      </body>
    </html>
  );
}
