"use client"

import React, { useMemo, useState, useEffect } from 'react'
import METEORITES from '@/lib/mocks/meteorites-enriched'
import dynamic from 'next/dynamic'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const MeteoriteGlobe = dynamic(() => import('./MeteoriteGlobe').then(m => m.default), { ssr: false })

function computeSummaries(items: any[]) {
  const total = items.length
  const fell = items.filter(i => i.fall === 'Fell')
  const avgCraterFell = fell.length ? (fell.reduce((s, a) => s + (a.crater_diameter_km || 0), 0) / fell.length) : 0
  const highRisk = items.filter(i => i.risk_level === 'high').length
  return { total, avgCraterFell, highRisk }
}

export default function MeteoriteDashboard() {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => {
    setItems(METEORITES as any[])
  }, [])

  const summaries = useMemo(() => computeSummaries(items), [items])

  const barData = useMemo(() => {
    // group by recclass, average tnt_mt and seismic
    const map: Record<string, { tnt_total: number; seismic_total: number; count: number; risk_high: number }> = {}
    items.forEach(it => {
      const k = it.recclass || 'unknown'
      if (!map[k]) map[k] = { tnt_total: 0, seismic_total: 0, count: 0, risk_high: 0 }
      map[k].tnt_total += (it.tnt_mt || 0)
      map[k].seismic_total += (it.seismic_mag || 0)
      map[k].count += 1
      if (it.risk_level === 'high') map[k].risk_high += 1
    })
    return Object.keys(map).map(k => ({ recclass: k, avg_tnt: map[k].tnt_total / map[k].count, avg_seismic: map[k].seismic_total / map[k].count, count: map[k].count, risk_high: map[k].risk_high }))
  }, [items])

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.02)] border border-[var(--color-border)]">
          <h4 className="font-semibold">Total events</h4>
          <div className="mt-2 text-2xl font-[var(--font-display)]">{summaries.total}</div>
        </div>
        <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.02)] border border-[var(--color-border)]">
          <h4 className="font-semibold">Avg crater (Fell)</h4>
          <div className="mt-2 text-2xl font-[var(--font-display)]">{Number(summaries.avgCraterFell).toFixed(2)} km</div>
        </div>
        <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.02)] border border-[var(--color-border)]">
          <h4 className="font-semibold">High risk count</h4>
          <div className="mt-2 text-2xl font-[var(--font-display)]">{summaries.highRisk}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.02)] border border-[var(--color-border)] h-96">
          <h4 className="font-semibold mb-2">Average TNT (Mt) by Class</h4>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="recclass" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg_tnt" name="Avg TNT (Mt)" fill="#FF8C00" />
              <Bar dataKey="avg_seismic" name="Avg Mw" fill="#00BFFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.02)] border border-[var(--color-border)]">
          <h4 className="font-semibold mb-2">Global Impact Map (Top entries)</h4>
          <MeteoriteGlobe items={items} />
        </div>
      </div>

      <div className="mt-4">
        <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.02)] border border-[var(--color-border)]">
          <h4 className="font-semibold">Data preview</h4>
          <div className="overflow-auto max-h-64 mt-2 text-sm font-mono bg-black/20 p-2 rounded">
            {items.slice(0, 10).map(it => (
              <div key={it.id} className="mb-2">
                <strong>{it.name}</strong> — {it.recclass} — {it.tnt_mt} Mt — crater {it.crater_diameter_km} km
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
