"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ImpactSummaryCard } from "@/components/impact/impact-summary"
import { EnergyGraph } from "@/components/impact/energy-graph"
import { Impact3D } from "@/components/impact/impact-3d"
import { AIExplain } from "@/components/ai-explain"
import { MetricCards } from "@/components/impact/metric-cards"
import { AsteroidVisualization } from "@/components/impact/asteroid-visualization"

export default function ImpactZonePage() {
  // remove custom numeric inputs — user will pick from the curated asteroid list
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<any>(null)
  const [asteroids, setAsteroids] = useState<Array<any>>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedAsteroid, setSelectedAsteroid] = useState<any | null>(null)
  const [shareText, setShareText] = useState<string>("")
  const [computed, setComputed] = useState<any | null>(null)
  const [listLoading, setListLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
      // augment results with a few derived fields for visualization & sharing
      const out = { ...(j || {}) }
      // compute crater diameter (approx) if not provided: depth -> diameter scaling
      const depth_m = Number(j.crater_depth_m || j.crater_depth_m || 0)
      out.crater_diameter_km = j.crater_diameter_km || (depth_m ? (depth_m * 3) / 1000 : null)
      out.blast_radius_km = j.blast_radius_km || j.blast_radius_km || out.blast_radius_km
      out.seismic_magnitude_mw = j.seismic_magnitude_mw || j.seismic_magnitude_mw
      // prepare a friendly share text
      const name = selectedAsteroid?.name || selected || (j.input && j.input.asteroid_name) || 'an asteroid'
      const energyJ = Number(out.impact_energy_j || out.impact_energy || 0)
      const energyMT = Number(out.impact_energy_mt || out.impact_energy_mt || 0)
      const fmtEnergy = energyJ >= 1 ? energyJ.toExponential(2) : String(energyJ)
      out.summary_text = j.summary_text || j.summary || `Estimated impact energy ${fmtEnergy} J (${Number(energyMT).toFixed(3)} Mt).`
      setDetail(out)
      setComputed(out)
      setShareText(`Just simulated an asteroid impact on NeoTrack.Earth — Asteroid ${name} hit Earth with ${Number(energyJ).toExponential(2)} J (${Number(energyMT).toFixed(3)} Mt)! #NASA #NeoTrackEarth`)
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
                const found = asteroids.find((a: any) => (a.name || a.label) === v) || null
                setSelectedAsteroid(found)
              }} className="mt-2 w-full rounded p-3 bg-[rgba(255,255,255,0.04)] text-white" style={{ fontFamily: "Orbitron, sans-serif", border: "1px solid rgba(255,255,255,0.12)" }}
              onFocus={() => setDropdownOpen(true)} onBlur={() => setDropdownOpen(false)} size={dropdownOpen ? Math.min(asteroids.length, 20) : 1}>
                <option value="">-- Select asteroid --</option>
                {asteroids.map((a: any) => (
                  <option key={(a.name || a.label) + String(a.id || a.label)} value={(a.name || a.label)}>{a.name || a.label}</option>
                ))}
              </select>
            )}
          </label>
        </div>
        {/* numeric inputs removed — selection from curated list only */}
          <div className="md:col-span-3 flex items-center gap-3">
          <div className="text-sm text-[var(--color-muted-foreground)]">Choose an asteroid and press Calculate Impact</div>
          <button aria-label="Calculate Impact" type="submit" className="ml-auto px-4 py-2 rounded bg-gradient-to-r from-[#FF8C00] to-[#FF4500] text-black shadow-[0_0_20px_rgba(255,140,0,0.5)] hover:brightness-110 disabled:opacity-50" disabled={loading || !selected}>
            {loading ? "Fetching the data from the sources..." : "Calculate Impact"}
          </button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {selectedAsteroid ? (
            <div className="rounded-xl p-4" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)' }}>
              <h4 className="font-semibold text-[var(--color-accent)]">Asteroid Info</h4>
              <p className="mt-2 text-sm">Name: <strong>{selectedAsteroid.name || selectedAsteroid.label}</strong></p>
              <p className="mt-1 text-sm">Estimated diameter: <strong>{selectedAsteroid.diameter ? Number(selectedAsteroid.diameter).toLocaleString() + ' m' : (selectedAsteroid.size ? String(selectedAsteroid.size) : '—')}</strong></p>
              <p className="mt-1 text-sm">Estimated mass: <strong>{selectedAsteroid.mass ? Number(selectedAsteroid.mass).toExponential(2) + ' kg' : '—'}</strong></p>
              <p className="mt-1 text-sm">Velocity: <strong>{selectedAsteroid.velocity ? selectedAsteroid.velocity + ' km/s' : (selectedAsteroid.velocity_kms ? selectedAsteroid.velocity_kms + ' km/s' : '—')}</strong></p>
              <p className="mt-1 text-sm">Close approach: <strong>{selectedAsteroid.close_approach ? 'Yes' : 'No'}</strong></p>
            </div>
          ) : (
            <div className="rounded-xl p-4" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.006))', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(4px)' }}>
              <h4 className="font-semibold text-[var(--color-accent)]">Asteroid Info</h4>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">Select an asteroid to view precomputed info.</p>
            </div>
          )}
          <div className="mt-4">
            <AsteroidVisualization asteroid={selectedAsteroid} />
          </div>

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
            <div>
              <EnergyGraph series={[{ name: "Impact", value: computed ? computed.impact_energy_mt : 0 }, { name: "Hiroshima", value: computed ? (computed.impact_energy_mt / 0.015) : 0 }]} />

              <div className="flex items-center gap-3 mt-3">
                <button aria-label="Share on X" className="flex items-center gap-2 px-3 py-2 rounded bg-black/30 hover:brightness-110" onClick={() => {
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
                  window.open(url, '_blank')
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.48 4.48 0 0 0 11.07 6.29 12.8 12.8 0 0 1 1.64 2.16 4.48 4.48 0 0 0 3.1 9.72 4.41 4.41 0 0 1 .88 9v.05A4.48 4.48 0 0 0 4.47 13a4.52 4.52 0 0 1-2 .08 4.49 4.49 0 0 0 4.2 3.15A9 9 0 0 1 0 18.57a12.8 12.8 0 0 0 6.92 2.02c8.3 0 12.84-6.87 12.84-12.83v-.59A9.22 9.22 0 0 0 23 3z" fill="#1DA1F2"/></svg>
                  <span className="text-sm">Share on X</span>
                </button>

                <button aria-label="Share on Instagram" className="flex items-center gap-2 px-3 py-2 rounded bg-black/30 hover:brightness-110" onClick={() => {
                  // Instagram web share is limited; open a new window with prefilled text for copy
                  const share = `${shareText} \n\n#NeoTrackEarth #Asteroid`;
                  // fallback: open a blank instagram.com page and copy text in console for user
                  window.open('https://www.instagram.com', '_blank')
                  alert('Instagram share opened — copy the following text to your post:\n\n' + share)
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zM19 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#E1306C"/></svg>
                  <span className="text-sm">Share on Instagram</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.006))', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(4px)' }}>
              <h4 className="font-semibold">Blast & Seismic</h4>
              <p className="mt-2 text-sm font-mono">{computed ? `Blast radius ~ ${Number(computed.blast_radius_km || computed.blast_radius_km || 0).toFixed(2)} km` : "—"}</p>
                <p className="mt-2 text-sm font-mono">{computed ? `Estimated Mw ${Number(computed.seismic_magnitude_mw || computed.seismic_magnitude_mw || 0).toFixed(2)}` : "—"}</p>
              <div className="mt-3">
                <h5 className="font-semibold">Detailed result</h5>
                {computed ? (
                  <pre className="mt-2 text-xs font-mono bg-black/10 p-2 rounded max-h-40 overflow-auto">{JSON.stringify(computed, null, 2)}</pre>
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
