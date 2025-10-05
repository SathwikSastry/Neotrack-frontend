"use client"

import React, { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

type Asteroid = {
  name: string
  diameter?: number | string
  mass?: number | string
  velocity?: number | string
  close_approach?: boolean
  [key: string]: any
}

export function AsteroidVisualization({ asteroid }: { asteroid: Asteroid | null }) {
  const data = useMemo(() => {
    if (!asteroid) return []
    const diameter = Number(asteroid.diameter) || 0
    const mass = Number(asteroid.mass) || 0
    const velocity = Number(asteroid.velocity) || 0
    // normalize for visual comparison (log scale where appropriate)
    const normMass = mass > 0 ? Math.log10(mass) : 0
    const normDiameter = diameter
    const normVelocity = velocity
    return [
      { name: "Diameter (m)", value: normDiameter },
      { name: "Mass (log10 kg)", value: Number.isFinite(normMass) ? normMass : 0 },
      { name: "Velocity (km/s)", value: normVelocity }
    ]
  }, [asteroid])

  if (!asteroid) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-4">
        <h4 className="font-semibold">Asteroid Visualization</h4>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">Select an asteroid to see an interactive visualization.</p>
      </div>
    )
  }

  const max = Math.max(...data.map((d) => d.value), 1)
  const colors = ["#FFB86B", "#7DD3FC", "#F76B8A"]

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-4">
      <h4 className="font-semibold">Asteroid Visualization</h4>
      <p className="mt-2 text-sm">{asteroid.name}</p>

      <div style={{ width: "100%", height: 160 }} className="mt-4">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, left: 24, bottom: 8 }}>
            <XAxis type="number" domain={[0, Math.ceil(max * 1.1)]} hide />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(2) : value)} />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="text-xs text-[var(--color-muted-foreground)]">Diameter</div>
          <div className="font-mono font-semibold">{asteroid.diameter ? Number(asteroid.diameter).toLocaleString() + ' m' : '—'}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[var(--color-muted-foreground)]">Mass</div>
          <div className="font-mono font-semibold">{asteroid.mass ? Number(asteroid.mass).toExponential(2) + ' kg' : '—'}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[var(--color-muted-foreground)]">Velocity</div>
          <div className="font-mono font-semibold">{asteroid.velocity ? asteroid.velocity + ' km/s' : '—'}</div>
        </div>
      </div>
    </div>
  )
}
