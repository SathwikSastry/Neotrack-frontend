"use client"

import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Contributors } from "@/components/contributors"
import { useEffect, useState } from "react" // for modal/overlay control
import { AIExplain } from "@/components/ai-explain"

export default function HomePage() {
  const [showNasaViewer, setShowNasaViewer] = useState(false)

  useEffect(() => {
    const prev = document.documentElement.style.overflow
    if (showNasaViewer) {
      document.documentElement.style.overflow = "hidden"
    } else {
      document.documentElement.style.overflow = prev || ""
    }
    return () => {
      document.documentElement.style.overflow = prev || ""
    }
  }, [showNasaViewer])

  return (
    <main className="min-h-dvh flex flex-col">
      <section className="relative">
        <Hero />
      </section>
      <div aria-hidden="true" className="h-12 md:h-16" />

      {/* Ask the Space AI — replaces Learn section, appears after NASA Eyes */}
      <section className="relative" aria-labelledby="ask-space-ai">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="rounded-2xl border border-[var(--color-border)]/70 bg-[color:rgba(255,255,255,0.04)]/60 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_40px_rgba(255,140,0,0.18)]">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 id="ask-space-ai" className="font-[var(--font-orbitron)] text-2xl md:text-3xl">Ask the Space AI</h2>
                <p className="mt-2 max-w-2xl text-[var(--color-muted-foreground)]">
                  Explore the unknown. Ask about asteroids, impacts, or space technology — powered by Groq Intelligence.
                </p>
              </div>
              <Link href="/space-ai" className="inline-flex">
                <Button
                  aria-label="Launch Space AI"
                  className="rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#FF4500] text-white px-5 py-3 shadow-[0_0_24px_rgba(255,140,0,0.35)]"
                >
                  Launch Space AI 🚀
                </Button>
              </Link>
            </div>
            <div className="pointer-events-none mt-6 h-20 w-full rounded-xl bg-[radial-gradient(ellipse_at_top,rgba(255,140,0,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(0,191,255,0.08),transparent_55%)] animate-pulse [animation-duration:6s]" />
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="h-6 md:h-8 lg:h-12" />

      {/* NASA Eyes Section */}
      <section className="relative" id="nasa-model" aria-labelledby="nasa-eyes-title">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <h2
            id="nasa-eyes-title"
            className="text-pretty font-[var(--font-display)] font-bold text-2xl text-[var(--color-foreground)] md:text-3xl"
          >
            Explore the Solar System in Real Time
          </h2>
          <p className="mt-2 text-[var(--color-muted-foreground)]">
            Powered by NASA Eyes. Click the button below to open the full 3D viewer right on this page.
          </p>

          <div className="mt-6">
            <Button
              onClick={() => setShowNasaViewer(true)}
              aria-label="Open NASA Eyes 3D viewer in a fullscreen overlay"
              style={{
                background: "linear-gradient(90deg, #FF8C00, #00BFFF)",
                color: "#FFFFFF",
                fontWeight: 700,
                padding: "14px 24px",
                borderRadius: "12px",
                boxShadow: "0 0 18px rgba(0,191,255,0.35)",
              }}
            >
              Open 3D Viewer
            </Button>
            <AIExplain />
          </div>
        </div>

  <div aria-hidden="true" className="h-12 md:h-16" />

        {showNasaViewer ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="NASA Eyes 3D Viewer"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          >
            {/* Close button */}
            <div className="absolute right-4 top-4 z-[51]">
              <Button
                onClick={() => setShowNasaViewer(false)}
                variant="secondary"
                aria-label="Close NASA Eyes 3D viewer"
                style={{
                  background: "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.14))",
                  color: "var(--color-foreground)",
                  borderRadius: "12px",
                  boxShadow: "0 0 24px rgba(0,191,255,0.25)",
                  border: "1px solid var(--color-border)",
                }}
              >
                Close ✕
              </Button>
            </div>

            {/* Iframe wrapper */}
            <div className="absolute inset-0 p-2 md:p-4 lg:p-6">
              <div className="h-full w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.04)] shadow-[0_0_40px_rgba(0,191,255,0.25)]">
                <iframe
                  title="NASA Eyes — Fullscreen"
                  src="https://eyes.nasa.gov/apps/asteroids/#/"
                  className="h-full w-full"
                  style={{
                    border: "none",
                  }}
                />
                <p className="sr-only">Visualization provided by NASA Eyes</p>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <div aria-hidden="true" className="h-20 md:h-24 lg:h-28" />

      {/* Impact Assessment — just a heading + button to the full-screen page */}
      <section className="relative" aria-labelledby="impact-assessment">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <h2
            id="impact-assessment"
            className="text-pretty font-[var(--font-display)] font-bold text-2xl text-[var(--color-foreground)] md:text-3xl"
          >
            Impact Assessment Dashboard
          </h2>
          <p className="mt-2 text-[var(--color-muted-foreground)]">
            Open the full-screen dashboard to analyze kinetic energy, crater size, and probabilities.
          </p>
          <Link
            href="/impact-zone"
            className="mt-6 inline-flex"
            aria-label="Open full-screen Impact Assessment Dashboard"
          >
            <Button
              style={{
                background: "linear-gradient(90deg, #FF8C00, #00BFFF)",
                color: "#FFFFFF",
                fontWeight: 700,
                padding: "14px 24px",
                borderRadius: "12px",
                boxShadow: "0 0 18px rgba(0,191,255,0.35)",
              }}
            >
              Open Full Screen Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <div aria-hidden="true" className="h-24 md:h-32 lg:h-36" />

      <section className="relative" aria-labelledby="space-game">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <h2
            id="space-game"
            className="text-pretty font-[var(--font-display)] font-bold text-2xl text-[var(--color-foreground)] md:text-3xl"
          >
            Play the Meteor Madness Game
          </h2>
          <p className="mt-2 text-[var(--color-muted-foreground)]">
            Test your reflexes in an asteroid field! Survive as long as you can while dodging meteors and debris.
          </p>

          <Link
            href="/game"
            className="mt-6 block rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.04)] p-4 backdrop-blur-md transition hover:brightness-110"
            aria-label="Navigate to the space game"
          >
            <div className="grid items-center gap-4 md:grid-cols-[320px_1fr]">
              <img src="/placeholder.jpg" alt="Space game preview" className="rounded-md" />
              <div className="flex flex-col gap-3">
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Hover for glow. The full game loads on the dedicated page.
                </p>
                <Button
                  style={{
                    background: "linear-gradient(90deg, #FF8C00, #8A2BE2)",
                    color: "#FFFFFF",
                    padding: "14px 28px",
                    borderRadius: "10px",
                    boxShadow: "0 0 20px rgba(255,140,0,0.6)",
                  }}
                  className="w-fit"
                >
                  Play Now 🎮
                </Button>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <div aria-hidden="true" className="h-24 md:h-32 lg:h-36" />

      <section className="relative" aria-labelledby="contributors">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <h2
            id="contributors"
            className="text-pretty font-[var(--font-display)] font-bold text-2xl text-[var(--color-foreground)] md:text-3xl"
          >
            Meet the Team Behind NeoTrack.Earth
          </h2>
          <Contributors />
        </div>
      </section>

      <div aria-hidden="true" className="h-12 md:h-16" />
    </main>
  )
}
