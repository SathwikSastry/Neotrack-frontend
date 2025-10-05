"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"

export function EnergyGraph({ series }: { series: Array<{ name: string; value: number }> }) {
  const data = series.map((s, i) => ({ name: s.name, value: s.value }))
  return (
    <div className="h-44 rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)] p-3">
      <h4 className="text-sm font-semibold mb-2">Energy Output</h4>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF8C00" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#00BFFF" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#FF8C00" fill="url(#grad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
