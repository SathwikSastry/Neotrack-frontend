"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export function LearnScience() {
  // Slides provided in public/images/learn
  const slides = [
    { src: "/images/learn/learn-1.jpg", caption: "Augmented Reality - Space in your room", description: "Use AR to visualize trajectories and where impacts might occur." },
    { src: "/images/learn/learn-2.jpg", caption: "Impact Points - Where space rocks land", description: "Learn how orbital mechanics determine impact locations and timing." },
    { src: "/images/learn/learn-3.jpg", caption: "Population density & megatons", description: "Understand how energy release (megatons) affects populated areas differently." },
  ]

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const autoplayRef = useRef<number | null>(null)

  useEffect(() => {
    // autoplay every 5s when playing
    if (playing) {
      autoplayRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % slides.length)
      }, 5000)
    }
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, [playing])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + slides.length) % slides.length)
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % slides.length)
      if (e.key === "Escape") setExpanded(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (!slides || slides.length === 0) return null

  return (
    <section className="relative" aria-labelledby="learn-science">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 id="learn-science" className="text-pretty font-[var(--font-display)] text-2xl md:text-3xl">Learn the Science Behind NeoTrack.Earth</h2>
            <p className="mt-2 text-[var(--color-muted-foreground)]">Guided visuals to explain the science of impacts, orbits, and planetary effects. Use the arrows or click to expand for a closer look.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1 rounded-md border" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing}>
              {playing ? "Pause" : "Play"}
            </button>
            <div className="text-sm text-[var(--color-muted-foreground)]">{index + 1}/{slides.length}</div>
          </div>
        </div>

        <div className="mt-6 relative">
          <div className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)]">
            <div className="relative w-full h-64 md:h-80 lg:h-96 bg-black/5">
              {/* using native img to avoid next/image layout during dynamic modal; images are in public */}
              <img src={slides[index].src} alt={slides[index].caption} className="w-full h-full object-cover" onClick={() => setExpanded(true)} />
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60"
                onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
                aria-label="Previous slide"
              >
                ◀
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60"
                onClick={() => setIndex((i) => (i + 1) % slides.length)}
                aria-label="Next slide"
              >
                ▶
              </button>
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-lg font-semibold">{slides[index].caption}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{slides[index].description}</p>
              <div className="mt-3 flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={i}
                    className={`w-8 h-2 rounded-full ${i === index ? "bg-primary" : "bg-white/30"}`}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal expanded view */}
        {expanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setExpanded(false)}>
            <div className="max-w-5xl w-full bg-card rounded-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full h-[60vh] md:h-[75vh]">
                <img src={slides[index].src} alt={slides[index].caption} className="w-full h-full object-contain bg-black" />
                <button className="absolute right-3 top-3 bg-black/50 text-white rounded-full p-2" onClick={() => setExpanded(false)} aria-label="Close expanded view">✕</button>
              </div>
              <div className="p-4">
                <h4 className="font-semibold">{slides[index].caption}</h4>
                <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{slides[index].description}</p>
                <div className="mt-4 flex justify-between">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded border" onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}>Previous</button>
                    <button className="px-3 py-1 rounded border" onClick={() => setIndex((i) => (i + 1) % slides.length)}>Next</button>
                  </div>
                  <div className="text-sm text-[var(--color-muted-foreground)]">{index + 1}/{slides.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
