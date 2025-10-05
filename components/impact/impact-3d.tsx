"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// load OrbitSimulation client-only
const OrbitSimulation = dynamic(() => import("@/components/orbit-simulation").then((mod) => mod.OrbitSimulation), { ssr: false })

export function Impact3D({ impactPoint }: { impactPoint?: { lat: number; lon: number } | null }) {
  const [showWave, setShowWave] = useState(false)

  useEffect(() => {
    if (impactPoint) {
      setShowWave(true)
      const t = setTimeout(() => setShowWave(false), 2200)
      return () => clearTimeout(t)
    }
  }, [impactPoint])

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-2">
      <div style={{ height: 360 }} className="relative overflow-hidden rounded">
        <OrbitSimulation />
        {showWave ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-gradient-to-r from-[#FF8C00]/40 to-[#00BFFF]/20 animate-ping" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
