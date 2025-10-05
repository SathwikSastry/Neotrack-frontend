"use client"

import { motion } from "framer-motion"

export function ImpactSummaryCard({ data }: { data: any }) {
  if (!data) return null
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-4">
      <h3 className="font-semibold">Impact Summary</h3>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[var(--color-muted-foreground)]">Energy (Mt)</dt>
          <dd className="font-mono">{Number(data.impact_energy_mt).toFixed(3)} Mt</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted-foreground)]">Crater Depth</dt>
          <dd className="font-mono">{Number(data.crater_depth_m).toFixed(2)} m</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted-foreground)]">Displacement</dt>
          <dd className="font-mono">{Number(data.displacement_m).toFixed(2)} m</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted-foreground)]">Seismic (Mw)</dt>
          <dd className="font-mono">{Number(data.seismic_magnitude_mw).toFixed(2)}</dd>
        </div>
      </dl>
    </motion.div>
  )
}
