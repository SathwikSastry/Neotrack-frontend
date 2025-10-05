"use client"

import { motion } from "framer-motion"

export function MetricCards({ data }: { data: any }) {
  if (!data) return null

  const cards = [
    { id: 'energy', title: 'Impact Energy', value: `${Number(data.impact_energy_mt).toFixed(3)} Mt`, hint: `${Number(data.impact_energy_j).toExponential(2)} J` },
    { id: 'crater', title: 'Crater Depth', value: `${Number(data.crater_depth_m).toFixed(1)} m`, hint: 'Estimated depth' },
    { id: 'blast', title: 'Blast Radius', value: `${Number(data.blast_radius_km).toFixed(2)} km`, hint: 'Thermal/pressure range' },
    { id: 'seismic', title: 'Seismic Equiv', value: `Mw ${Number(data.seismic_magnitude_mw).toFixed(2)}`, hint: 'Local seismic magnitude' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c) => (
        <motion.div key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-3">
          <div className="text-sm text-[var(--color-muted-foreground)]">{c.title}</div>
          <div className="mt-2 text-2xl font-[var(--font-display)]">{c.value}</div>
          <div className="mt-1 text-xs text-[var(--color-muted-foreground)]">{c.hint}</div>
        </motion.div>
      ))}
    </div>
  )
}
