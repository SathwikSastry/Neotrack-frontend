"use client"

import { useState, useEffect } from "react"
import { ImpactSummaryCard } from "@/components/impact/impact-summary"
import { EnergyGraph } from "@/components/impact/energy-graph"
import { Impact3D } from "@/components/impact/impact-3d"
import { AIExplain } from "@/components/ai-explain"
import { MetricCards } from "@/components/impact/metric-cards"

export default function ImpactZonePage() {
  // remove custom numeric inputs — user will pick from the curated asteroid list
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<any>(null)
  const [asteroids, setAsteroids] = useState<Array<any>>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedAsteroid, setSelectedAsteroid] = useState<any | null>(null)
  const [listLoading, setListLoading] = useState(true)

  useEffect(() => {
    const base = (window as any).__NEOTRACK_API_BASE__ || ""
    setListLoading(true)
    fetch(`${base}/api/asteroids`).then((r) => r.json()).then((j) => {
      setAsteroids(j?.list || [])
      setListLoading(false)
    }).catch(() => setListLoading(false))
  }, [])

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    setDetail(null)
    try {
      // simulate fetching & formatting delay (3-4s) to show the banner
      await new Promise((res) => setTimeout(res, 3400))
      const base = (window as any).__NEOTRACK_API_BASE__ || ""
      const body: any = {}
      if (selected) body.asteroid_name = selected
      const res = await fetch(`${base}/api/impact-details`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
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

      {loading ? (
        <div className="mt-6 rounded-md bg-[rgba(0,0,0,0.6)] p-3 text-center">
          <strong>Fetching the data from the sources</strong>
          <div className="mt-2 text-sm text-[var(--color-muted-foreground)]">This may take a few seconds as we gather model outputs and external data.</div>
        </div>
      ) : null}

  <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <label className="flex flex-col">
            <span className="text-sm text-[var(--color-muted-foreground)]">Select Asteroid</span>
            {listLoading ? (
              <select disabled className="mt-2 w-full rounded p-3 bg-[rgba(255,255,255,0.05)]">
                <option>Loading...</option>
              </select>
            ) : (
              <select aria-label="Select Asteroid" value={selected ?? ""} onChange={(e) => {
                const v = e.target.value || null
                setSelected(v)
                const found = asteroids.find((a: any) => a.name === v) || null
                setSelectedAsteroid(found)
              }} className="mt-2 w-full rounded p-3 bg-[rgba(255,255,255,0.05)] text-white" style={{ fontFamily: "Orbitron, sans-serif", border: "1px solid rgba(255,255,255,0.2)" }}>
                <option value="">-- Select asteroid --</option>
                {asteroids.map((a: any) => (
                  <option key={a.name} value={a.name}>{a.name}</option>
                ))}
              </select>
            )}
          </label>
        </div>
        {/* numeric inputs removed — selection from curated list only */}
        <div className="md:col-span-3 flex items-center gap-3">
          <div className="text-sm text-[var(--color-muted-foreground)]">Choose an asteroid and press Calculate Impact</div>
          <button aria-label="Calculate Impact" className="ml-auto px-4 py-2 rounded bg-[var(--color-primary)] text-black shadow-[0_0_20px_rgba(255,140,0,0.5)]" disabled={loading || !selected}>
            {loading ? "Fetching the data from the sources" : "Calculate Impact"}
          </button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {selectedAsteroid ? (
            <div className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-4">
              <h4 className="font-semibold">Asteroid Info</h4>
              <p className="mt-2 text-sm">Name: <strong>{selectedAsteroid.name}</strong></p>
              <p className="mt-1 text-sm">Estimated diameter: <strong>{selectedAsteroid.diameter ? Number(selectedAsteroid.diameter).toLocaleString() + ' m' : '—'}</strong></p>
              <p className="mt-1 text-sm">Estimated mass: <strong>{selectedAsteroid.mass ? Number(selectedAsteroid.mass).toExponential(2) + ' kg' : '—'}</strong></p>
              <p className="mt-1 text-sm">Velocity: <strong>{selectedAsteroid.velocity ? selectedAsteroid.velocity + ' km/s' : '—'}</strong></p>
              <p className="mt-1 text-sm">Close approach: <strong>{selectedAsteroid.close_approach ? 'Yes' : 'No'}</strong></p>
              <p className="mt-1 text-sm">Diameter (raw): <strong>{selectedAsteroid.diameter}</strong></p>
              <p className="mt-1 text-sm">Raw payload: <small className="text-xs">{JSON.stringify(selectedAsteroid)}</small></p>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-4">
              <h4 className="font-semibold">Asteroid Info</h4>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">Select an asteroid to view precomputed info.</p>
            </div>
          )}

          <MetricCards data={detail} />
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
              <div className="mt-3">
                <h5 className="font-semibold">Detailed result</h5>
                {detail ? (
                  <pre className="mt-2 text-xs font-mono bg-black/10 p-2 rounded max-h-40 overflow-auto">{JSON.stringify(detail, null, 2)}</pre>
                ) : (
                  <div className="mt-2 text-sm text-[var(--color-muted-foreground)]">Run a calculation to see detailed values</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
