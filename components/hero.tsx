"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Hero() {
  const reduce = useReducedMotion()
  const onBegin = () => {
    const el = document.getElementById("nasa-model")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="relative overflow-hidden">
      {/* subtle glow behind heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-32 -top-24 h-64 opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(120px 120px at 30% 50%, var(--color-accent) 0%, transparent 70%), radial-gradient(180px 180px at 70% 50%, var(--color-primary) 0%, transparent 75%)",
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-12 pt-16 md:px-6 md:pt-24">
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-pretty text-center font-[var(--font-display)] text-4xl leading-tight tracking-wide md:text-6xl"
          style={{
            textShadow: "0 0 10px rgba(255,140,0,0.35), 0 0 18px rgba(0,191,255,0.25)",
            color: "var(--color-foreground)",
          }}
        >
          Welcome to{" "}
          <span className="italic font-bold">
            <span className="text-[var(--color-accent)]">NEO</span>Track
          </span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 max-w-3xl text-balance text-center text-base leading-relaxed text-[var(--color-muted-foreground)] md:text-lg"
        >
          Track. Predict. Defend. Experience Earth&apos;s most advanced asteroid awareness system.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-6"
        >
          <Button
            onClick={onBegin}
            size="lg"
            style={{
              background: "linear-gradient(90deg, #FF8C00, #00BFFF)",
              color: "#FFFFFF",
              padding: "16px 32px",
              borderRadius: "12px",
              fontWeight: 700,
            }}
          >
            Begin Exploration
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
