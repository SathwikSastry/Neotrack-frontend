"use client"

import { useState } from "react"

export default function CustomImpactPage() {
  const [velocity, setVelocity] = useState(20)
  const [mass, setMass] = useState(1e9)
  const [diameter, setDiameter] = useState(100)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const base = (window as any).__NEOTRACK_API_BASE__ || ""
      const res = await fetch(`${base}/api/impact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ velocity_kms: velocity, mass_kg: mass, diameter_m: diameter }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || "Server error")
      setResult(json)
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-12 px-6 text-[var(--color-foreground)]">
      <h1 className="text-4xl font-bold mb-4">What If It Hit Us? — Custom Impact Simulator</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">Enter parameters and simulate impact consequences. Values are for demonstration and use simplified physics.</p>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
        <label className="flex flex-col">
          <span className="mb-2">Velocity (km/s)</span>
          <input aria-label="velocity" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} type="number" step="0.1" className="p-2 rounded bg-[rgba(255,255,255,0.03)]" />
        </label>
        <label className="flex flex-col">
          <span className="mb-2">Mass (kg)</span>
          <input aria-label="mass" value={mass} onChange={(e) => setMass(Number(e.target.value))} type="number" step="1" className="p-2 rounded bg-[rgba(255,255,255,0.03)]" />
        </label>
        <label className="flex flex-col">
          <span className="mb-2">Diameter (m)</span>
          <input aria-label="diameter" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} type="number" step="0.1" className="p-2 rounded bg-[rgba(255,255,255,0.03)]" />
        </label>

        <div className="md:col-span-3">
          <button aria-label="Simulate impact" className="px-4 py-2 rounded bg-[var(--color-primary)] text-black hover:brightness-110" disabled={loading}>
            {loading ? "Simulating..." : "Simulate Impact"}
          </button>
        </div>
      </form>

      {error && <div role="alert" className="mt-6 text-red-400">{error}</div>}

      {result && (
        <section aria-live="polite" className="mt-6 max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded backdrop-blur bg-[rgba(255,255,255,0.02)]">
              <strong>Impact Energy (J)</strong>
              <div className="mt-2 text-sm">{Number(result.impact_energy_j).toExponential(3)}</div>
            </div>
            <div className="p-4 rounded backdrop-blur bg-[rgba(255,255,255,0.02)]">
              <strong>Impact Energy (Mt TNT)</strong>
              <div className="mt-2 text-sm">{Number(result.impact_energy_mt).toFixed(3)} Mt</div>
            </div>
            <div className="p-4 rounded backdrop-blur bg-[rgba(255,255,255,0.02)]">
              <strong>Crater Depth (m)</strong>
              <div className="mt-2 text-sm">{Number(result.crater_depth_m).toFixed(2)} m</div>
            </div>
            <div className="p-4 rounded backdrop-blur bg-[rgba(255,255,255,0.02)]">
              <strong>Hiroshima Equivalent</strong>
              <div className="mt-2 text-sm">{Number(result.hiroshima_equivalent).toFixed(1)} bombs</div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
