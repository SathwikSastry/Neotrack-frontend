"use client"

import { Hero } from "@/components/hero"
import { OrbitSimulation } from "@/components/orbit-simulation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { Contributors } from "@/components/contributors"

export default function HomePage() {
  const [asteroid, setAsteroid] = useState<string>("Apophis")
  const [computed, setComputed] = useState<null | {
    velocity_kms: number
    impact_energy_mt: number
    crater_diameter_km: number
    impact_probability: number
  }>(null)

  const handleCompute = () => {
    setComputed({
      velocity_kms: asteroid === "Bennu" ? 12.6 : 19.3,
      impact_energy_mt: asteroid === "Bennu" ? 1200 : 3400,
      crater_diameter_km: asteroid === "Bennu" ? 1.2 : 2.1,
      impact_probability: asteroid === "Bennu" ? 0.002 : 0.001,
    })
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <section className="relative">
        <Hero />
      </section>

      <div aria-hidden="true" className="h-24 md:h-40 lg:h-48" />

      <section className="relative">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div
            className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.04)] backdrop-blur-md"
            aria-label="Interactive orbit simulation"
          >
            <OrbitSimulation />
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="h-24 md:h-40 lg:h-48" />

      <section className="relative" id="nasa-model" aria-labelledby="nasa-eyes-title">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <h2
            id="nasa-eyes-title"
            className="text-pretty font-[var(--font-display)] font-bold text-2xl text-[var(--color-foreground)] md:text-3xl"
          >
            Explore the Solar System in Real Time
          </h2>
          <p className="mt-2 text-[var(--color-muted-foreground)]">Powered by NASA Eyes</p>
          <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.04)] p-2 backdrop-blur-md">
            <iframe
              title="NASA Eyes — Asteroids"
              src="https://eyes.nasa.gov/apps/asteroids/#/"
              style={{
                width: "100%",
                height: "600px",
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                boxShadow: "0 0 30px rgba(0,191,255,0.5)",
              }}
            />
            <p className="sr-only">Visualization provided by NASA Eyes</p>
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="h-24 md:h-40 lg:h-48" />

      <section className="relative" aria-labelledby="impact-assessment">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <h2
            id="impact-assessment"
            className="text-pretty font-[var(--font-display)] font-bold text-2xl text-[var(--color-foreground)] md:text-3xl"
          >
            Impact Assessment Dashboard
          </h2>
          <p className="mt-2 text-[var(--color-muted-foreground)]">Physics meets AI</p>

          <div className="mt-6 grid gap-4 md:grid-cols-[260px_1fr]">
            <div className="rounded-lg border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.04)] p-4 backdrop-blur-md">
              <label className="text-sm text-[var(--color-muted-foreground)]">Select Asteroid</label>
              <div className="mt-2">
                <Select value={asteroid} onValueChange={setAsteroid}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select asteroid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apophis">Apophis</SelectItem>
                    <SelectItem value="Bennu">Bennu</SelectItem>
                    <SelectItem value="Psyche">Psyche</SelectItem>
                    <SelectItem value="Eros">Eros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCompute}
                className="mt-4"
                style={{
                  background: "linear-gradient(90deg, #FF8C00, #00BFFF)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                }}
              >
                Compute Impact Simulation
              </Button>
              <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
                Future: calls backend /api/impact-analysis to compute physics.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.04)] p-4 backdrop-blur-md">
              {!computed ? (
                <div className="grid place-items-center gap-3 py-10 text-center">
                  <img src="/placeholder.svg?height=200&width=400" alt="Placeholder chart" className="rounded-md" />
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Visualized results of kinetic energy, crater size, and impact probability.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <div>
                    <img
                      src="/placeholder.svg?height=220&width=420"
                      alt="Computed chart preview"
                      className="rounded-md"
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-foreground)]">Velocity</span>
                      <span className="font-medium">{computed.velocity_kms.toFixed(1)} km/s</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-foreground)]">Impact Energy</span>
                      <span className="font-medium">{computed.impact_energy_mt.toLocaleString()} Mt</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-foreground)]">Crater Diameter</span>
                      <span className="font-medium">{computed.crater_diameter_km.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--color-muted-foreground)]">Impact Probability</span>
                      <span className="font-medium">{(computed.impact_probability * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="h-24 md:h-40 lg:h-48" />

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
              <img src="/placeholder.svg?height=200&width=320" alt="Space game preview" className="rounded-md" />
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

      <div aria-hidden="true" className="h-24 md:h-40 lg:h-48" />

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
