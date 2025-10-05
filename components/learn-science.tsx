"use client"

import Image from "next/image"

export function LearnScience() {
  const items = [
    { src: "/images/learn/learn-1.jpg", caption: "Augmented Reality - Space in your room" },
    { src: "/images/learn/learn-2.jpg", caption: "Impact Points - Where space rocks land" },
    { src: "/images/learn/learn-3.jpg", caption: "Population density & megatons" },
  ]

  return (
    <section className="relative" aria-labelledby="learn-science">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <h2 id="learn-science" className="text-pretty font-[var(--font-display)] text-2xl md:text-3xl">Learn the Science Behind NeoTrack.Earth</h2>
        <p className="mt-2 text-[var(--color-muted-foreground)]">Short guided visuals to explain the science of impacts, orbits, and planetary effects. Click each tile to expand.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <figure key={i} className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-2">
              <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden">
                <img src={it.src} alt={it.caption} className="w-full h-full object-cover rounded-md" />
              </div>
              <figcaption className="mt-3 p-2">
                <h4 className="font-semibold">{it.caption}</h4>
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">A short explanation about the image and how it connects to NeoTrack.Earth's science. Use this space to teach young learners about orbits, impact points, and energy.</p>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  )
}
