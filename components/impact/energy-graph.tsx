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
          "use client"

          import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"

          // 1 megaton TNT = 4.184e15 joules
          const J_PER_MT = 4.184e15

          export function EnergyGraph({ series }: { series: Array<{ name: string; value: number }> }) {
            // normalize values from Joules to Megatons for display (friendly units)
            const data = (series || []).map((s) => ({ name: s.name, value: Number(s.value || 0) / J_PER_MT, raw: Number(s.value || 0) }))

            const tooltipFormatter = (value: any, name: any, props: any) => {
              const mt = Number(value || 0)
              const j = Number(props?.payload?.raw || 0)
              // show Mt with 3 decimals and raw joules in exponential
              return [`${mt.toFixed(3)} Mt`, `${j.toExponential(2)} J`]
            }

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
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} label={{ value: 'Event', position: 'insideBottom', offset: -6 }} />
                    <YAxis tick={{ fontSize: 11 }} label={{ value: 'Energy (Mt TNT)', angle: -90, position: 'insideLeft', offset: 0 }} />
                    <Tooltip formatter={tooltipFormatter} />
                    <Area type="monotone" dataKey="value" stroke="#FF8C00" fill="url(#grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )
          }
