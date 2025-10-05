"use client"

import { useState } from "react"

export function AIExplain() {
  const [term, setTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [explain, setExplain] = useState<string | null>(null)

  const ask = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    setExplain(null)
    try {
      const base = (window as any).__NEOTRACK_API_BASE__ || ""
      const res = await fetch(`${base}/api/ai-explain`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ term }) })
      const json = await res.json()
      setExplain(typeof json.explanation === "string" ? json.explanation : JSON.stringify(json.explanation))
    } catch (err: any) {
      setExplain("Failed to fetch explanation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 max-w-2xl">
      <form onSubmit={ask} className="flex gap-2">
        <input aria-label="term" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Ask: 'asteroid', 'impact'..." className="flex-1 p-2 rounded bg-[rgba(255,255,255,0.02)]" />
        <button className="px-3 py-2 rounded bg-[var(--color-secondary)]" disabled={loading}>
          {loading ? "..." : "Explain"}
        </button>
      </form>
      {explain && (
        <div className="mt-3 p-3 rounded bg-[rgba(0,0,0,0.5)] text-sm">
          <strong>Explanation:</strong>
          <p className="mt-2">{explain}</p>
        </div>
      )}
    </div>
  )
}
