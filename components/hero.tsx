"use client"

import type React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRef, useEffect, useState } from "react"

export function Hero() {
  const reduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const earthRef = useRef<HTMLDivElement>(null)
  const [earthVisible, setEarthVisible] = useState(false)

  useEffect(() => {
    const node = earthRef.current
    if (!node) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEarthVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: "120px", threshold: 0.1 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  const onBegin = () => {
    const el = document.getElementById("nasa-model")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty("--mx", `${x}px`)
    e.currentTarget.style.setProperty("--my", `${y}px`)
  }

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--mx", `-9999px`)
    e.currentTarget.style.setProperty("--my", `-9999px`)
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={
        {
          // @ts-expect-error CSS var custom props
          "--mx": "-9999px",
          "--my": "-9999px",
        } as React.CSSProperties
      }
    >
      {/* subtle glow behind heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-32 -top-24 h-64 opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(120px 120px at 30% 50%, var(--color-accent) 0%, transparent 70%), radial-gradient(180px 180px at 70% 50%, var(--color-primary) 0%, transparent 75%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-35 mix-blend-screen">
        <div className="laserFlow absolute inset-0" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(140px 140px at var(--mx) var(--my), rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0) 70%)",
          mixBlendMode: "screen",
          transition: "background 80ms linear",
        }}
      />

      {/* Organize Hero content into a responsive grid with the Earth on the right */}
      <div
        className="relative z-20 mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 pb-10 pt-14 md:grid-cols-2 md:gap-10 md:px-6 md:pt-20 isolate"
        style={{ contentVisibility: "auto", contain: "layout paint" } as React.CSSProperties}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-44 w-[92%] rounded-[28px] opacity-90 blur-[6px] md:h-52"
          style={{
            background:
              "radial-gradient(55% 120% at 50% 0%, rgba(255,140,0,0.35) 0%, rgba(0,191,255,0.28) 30%, rgba(0,0,0,0) 70%)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 90%)",
          }}
        />

        {/* Left: Title + copy + CTA */}
        <div className="relative z-30 flex flex-col items-center md:items-start will-change-transform">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-pretty text-center font-[var(--font-display)] text-4xl leading-tight tracking-wide md:text-6xl"
            style={{
              textShadow: "0 0 10px rgba(255,140,0,0.45), 0 0 24px rgba(0,191,255,0.35), 0 1px 2px rgba(0,0,0,0.6)",
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
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
            className="mt-4 max-w-3xl text-balance text-center text-base leading-relaxed text-[var(--color-muted-foreground)] md:text-lg"
          >
            Track. Predict. Defend. Experience Earth&apos;s most advanced asteroid awareness system.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
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
                boxShadow: "0 0 24px rgba(0,191,255,0.35)",
              }}
              aria-label="Begin Exploration and jump to NASA Eyes section"
            >
              Begin Exploration
            </Button>
          </motion.div>
        </div>

        {/* Right: Revolving Earth (decorative 3D visual) */}
        <div
          ref={earthRef}
          className="relative mx-auto w-full max-w-[560px] md:max-w-[620px]"
          style={{ contain: "layout paint", contentVisibility: "auto" } as React.CSSProperties}
        >
          {/* Decorative rim light behind the embed for separation */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -inset-y-6 rounded-full opacity-60 blur-2xl"
            style={{
              background:
                "radial-gradient(60% 60% at 60% 40%, rgba(0,191,255,0.28) 0%, rgba(255,140,0,0.22) 28%, rgba(0,0,0,0) 70%)",
            }}
          />

          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)]">
            <span className="sr-only">Interactive 3D model of Earth embedded from Sketchfab</span>

            {earthVisible ? (
              <iframe
                title="Earth"
                src="https://sketchfab.com/models/41fc80d85dfd480281f21b74b2de2faa/embed"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
                style={{
                  border: "0",
                  borderRadius: "16px",
                  willChange: "transform",
                  transform: "translateZ(0)",
                }}
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-full w-full animate-pulse"
                style={{
                  background:
                    "radial-gradient(60% 60% at 55% 45%, rgba(0,191,255,0.10), rgba(255,140,0,0.06) 35%, rgba(0,0,0,0) 70%)",
                }}
              />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .laserFlow {
          background-image:
            repeating-linear-gradient(
              100deg,
              rgba(0, 191, 255, 0.08) 0px,
              rgba(0, 191, 255, 0.08) 2px,
              rgba(255, 140, 0, 0.06) 2px,
              rgba(255, 140, 0, 0.06) 4px,
              transparent 4px,
              transparent 14px
            );
          background-size: 200% 100%;
          filter: blur(0.5px);
          animation: flowSlide 9s linear infinite;
        }
        @keyframes flowSlide {
          0% {
            background-position: 0% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}
