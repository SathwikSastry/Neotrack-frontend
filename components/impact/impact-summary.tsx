"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function ImpactSummaryCard({ data }: { data: any }) {
  const [open, setOpen] = useState<{ key?: string; text?: string } | null>(null)

  // When clicking a metric label, fetch explanation from /api/ai-explain and toggle a small panel.
  const onExplain = async (key: string) => {
    try {
      const base = (window as any).__NEOTRACK_API_BASE__ || ""
      const res = await fetch(`${base}/api/ai-explain`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ term: key }) })
      const j = await res.json()
      setOpen({ key, text: typeof j.explanation === "string" ? j.explanation : JSON.stringify(j.explanation) })
    } catch (e) {
      setOpen({ key, text: "Failed to fetch explanation" })
    }
  }

  if (!data) return null
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-4">
      <h3 className="font-semibold">Impact Summary</h3>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[var(--color-muted-foreground)]">
            <button onClick={() => onExplain("impact energy")} className="underline">Energy (Mt)</button>
          </dt>
          <dd className="font-mono">{Number(data.impact_energy_mt).toFixed(3)} Mt</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted-foreground)]"><button onClick={() => onExplain("crater depth")} className="underline">Crater Depth</button></dt>
          <dd className="font-mono">{Number(data.crater_depth_m).toFixed(2)} m</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted-foreground)]"><button onClick={() => onExplain("displacement")} className="underline">Displacement</button></dt>
          <dd className="font-mono">{Number(data.displacement_m).toFixed(2)} m</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted-foreground)]"><button onClick={() => onExplain("seismic magnitude")} className="underline">Seismic (Mw)</button></dt>
          <dd className="font-mono">{Number(data.seismic_magnitude_mw).toFixed(2)}</dd>
        </div>
      </dl>

      {open && open.text ? (
        <div className="mt-3 rounded-md bg-[rgba(0,0,0,0.45)] p-3 text-sm">
          <strong>{open.key}</strong>
          <p className="mt-2">{open.text}</p>
        </div>
      ) : null}
    </motion.div>
  )
}
