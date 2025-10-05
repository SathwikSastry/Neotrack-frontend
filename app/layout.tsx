import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Orbitron } from "next/font/google"
import { Suspense } from "react"
import { SiteFooter } from "@/components/site-footer"
import { CursorGlow } from "@/components/cursor-glow"

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "NeoTrack.Earth",
  description: "Near-Earth object tracking and impact insights",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`font-sans ${GeistSans.variable} ${orbitron.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <CursorGlow /> {/* site-wide lighting cursor */}
          {children}
          <SiteFooter />
          <Analytics />
        </Suspense>

        {/* Client-side helper: set API base to backend when running locally */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){ if(typeof window!==\'undefined\' && !window.__NEOTRACK_API_BASE__){ window.__NEOTRACK_API_BASE__ = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:5000' : '' } })()" }} />
      </body>
    </html>
  )
}
