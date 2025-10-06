"use client"

import { motion } from "framer-motion"
import ChatPanel from "@/components/ai/chat-panel"

export default function SpaceAIPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Animated cosmic background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a] via-[#0a0f1a] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,140,0,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,191,255,0.12),transparent_55%)]" />
        {/* subtle twinkling stars */}
        <div className="stars" />
        <div className="stars2" />
        <div className="stars3" />
      </div>

      <section className="relative mx-auto w-full max-w-6xl px-4 pt-10 md:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="font-[var(--font-orbitron)] text-3xl md:text-4xl">Ask the Space AI</h1>
          <p className="mt-2 max-w-3xl text-[var(--color-muted-foreground)]">
            An intelligent assistant built with Groq to explore asteroids, impacts, and space technology.
          </p>
        </motion.div>
      </section>

      <section className="relative mx-auto w-full max-w-[1100px] px-4 pb-16 pt-6 md:pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <ChatPanel />
        </motion.div>
      </section>
    </main>
  )
}


