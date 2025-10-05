"use client"

import { useState } from "react"
import { ImpactSummaryCard } from "@/components/impact/impact-summary"
import { EnergyGraph } from "@/components/impact/energy-graph"
import { Impact3D } from "@/components/impact/impact-3d"
import { AIExplain } from "@/components/ai-explain"

export default function ImpactZonePage() {
  const [velocity, setVelocity] = useState(20)
  const [mass, setMass] = useState(1e9)
  const [diameter, setDiameter] = useState(100)
  const [target, setTarget] = useState("ground")
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<any>(null)

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    setDetail(null)
    try {
      const base = (window as any).__NEOTRACK_API_BASE__ || ""
      const res = await fetch(`${base}/api/impact-details`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ velocity_kms: velocity, mass_kg: mass, diameter_m: diameter, target }) })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.message || "Server error")
      setDetail(j)
    } catch (err: any) {
      setDetail({ error: err.message || String(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">Impact Assessment Dashboard</h1>
      <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed">Interactive tools to analyze impact energy, expected crater, blast radius, and seismic equivalence.</p>

      <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-[var(--color-muted-foreground)]">Velocity (km/s)</span>
          <input aria-label="velocity" type="number" step="0.1" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="p-2 rounded bg-[rgba(255,255,255,0.02)]" />
        </label>
        <label className="flex flex-col">
          <span className="text-sm text-[var(--color-muted-foreground)]">Mass (kg)</span>
          <input aria-label="mass" type="number" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="p-2 rounded bg-[rgba(255,255,255,0.02)]" />
        </label>
        <label className="flex flex-col">
          <span className="text-sm text-[var(--color-muted-foreground)]">Diameter (m)</span>
          <input aria-label="diameter" type="number" step="0.1" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} className="p-2 rounded bg-[rgba(255,255,255,0.02)]" />
        </label>

        <div className="md:col-span-3 flex items-center gap-3">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="target" checked={target === "ground"} onChange={() => setTarget("ground")} /> Ground
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="target" checked={target === "air"} onChange={() => setTarget("air")} /> Airburst
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="target" checked={target === "water"} onChange={() => setTarget("water")} /> Water
          </label>

          <button aria-label="Compute impact details" className="ml-auto px-4 py-2 rounded bg-[var(--color-primary)] text-black" disabled={loading}>
            {loading ? "Computing..." : "Compute"}
          </button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <ImpactSummaryCard data={detail} />
          <div className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-4">
            <h4 className="font-semibold">Hiroshima equivalence</h4>
            <p className="mt-2 font-mono text-sm">{detail ? Number(detail.impact_energy_mt / 0.015).toFixed(1) : "—"} bombs</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-4">
            <h4 className="font-semibold">Explain a term</h4>
            <AIExplain />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Impact3D impactPoint={detail ? { lat: 12.5, lon: 77.6 } : null} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnergyGraph series={[{ name: "Impact", value: detail ? detail.impact_energy_mt : 0 }, { name: "Hiroshima", value: detail ? detail.impact_energy_mt / 0.015 : 0 }]} />
            <div className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-4">
              <h4 className="font-semibold">Blast & Seismic</h4>
              <p className="mt-2 text-sm font-mono">{detail ? `Blast radius ~ ${Number(detail.blast_radius_km).toFixed(2)} km` : "—"}</p>
                <p className="mt-2 text-sm font-mono">{detail ? `Estimated Mw ${Number(detail.seismic_magnitude_mw).toFixed(2)}` : "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
