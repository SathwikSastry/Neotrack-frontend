"use client"

import { useEffect, useState } from "react"

/**
 * CursorGlow
 * - Adds a site-wide "lighting cursor" spotlight effect.
 * - Render once in layout so it's active on every page.
 * - Pointer-events-none so it never blocks clicks or scroll.
 */
export function CursorGlow() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const onLeave = () => setPos({ x: -9999, y: -9999 })
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        // Soft multi-stop spotlight that blends with background
        background: `radial-gradient(160px 160px at ${pos.x}px ${pos.y}px,
          rgba(255,255,255,0.12) 0%,
          rgba(0,191,255,0.10) 30%,
          rgba(255,140,0,0.08) 45%,
          transparent 60%)`,
        mixBlendMode: "screen",
        transition: "background 90ms linear",
      }}
    />
  )
}
