"use client"

import React, { useEffect, useState } from 'react';
import { ImpactSummaryCard } from "@/components/impact/impact-summary";
import { EnergyGraph } from "@/components/impact/energy-graph";
import { Impact3D } from "@/components/impact/impact-3d";
import { MetricCards } from "@/components/impact/metric-cards";
import { AsteroidVisualization } from "@/components/impact/asteroid-visualization";

interface Asteroid {
  id?: string | number;
  name: string;
  diameter?: number;
  mass?: number;
  velocity?: number;
  close_approach_date?: string;
  risk_level?: string;
}

interface ImpactDetails {
  impact_energy?: number;
  crater_depth_m?: number;
  blast_radius_km?: number;
  seismic_magnitude_mw?: number;
  energy_graph_data?: Array<{ name: string; value: number }>;
  summary_text?: string;
  impact_point?: { lat: number; lon: number } | null;
}

export default function ImpactZonePage() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [impactDetails, setImpactDetails] = useState<ImpactDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [shareText, setShareText] = useState("");

  useEffect(() => {
    fetch('/api/asteroids?limit=20')
      .then((r) => r.json())
      .then((j) => setAsteroids(j?.list || j || []))
      .catch(() => setAsteroids([]));
  }, []);

  const handleAsteroidChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const found = asteroids.find((a) => a.name === val || String(a.id) === val) || null;
    setSelectedAsteroid(found);
    setImpactDetails(null);
  };

  const handleCalculateImpact = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedAsteroid) return;
    setLoading(true);
    try {
      const res = await fetch('/api/impact-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedAsteroid.name }),
      });
      const j = await res.json();
      setImpactDetails(j || null);
      setShareText(`Asteroid ${selectedAsteroid.name} impact: ${j?.summary_text || ''}`);
    } catch (err) {
      console.error(err);
      setImpactDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">Impact Assessment Dashboard</h1>
      <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed">Interactive tools to analyze impact energy, expected crater, blast radius, and seismic equivalence.</p>

      <form onSubmit={handleCalculateImpact} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <label className="flex flex-col">
            <span className="text-sm text-[var(--color-muted-foreground)]">Select Asteroid</span>
            <select
              aria-label="Select Asteroid"
              value={selectedAsteroid?.name ?? ""}
              onChange={handleAsteroidChange}
              className="mt-2 w-full rounded p-3 bg-[rgba(255,255,255,0.04)] text-white"
              style={{ fontFamily: "Orbitron, sans-serif", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <option value="">-- Select asteroid --</option>
              {asteroids.map((a) => (
                <option key={String(a.id ?? a.name)} value={a.name}>{a.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="md:col-span-3 flex items-center gap-3">
          <div className="text-sm text-[var(--color-muted-foreground)]">Choose an asteroid and press Calculate Impact</div>
          <button aria-label="Calculate Impact" type="submit" className="ml-auto px-4 py-2 rounded bg-gradient-to-r from-[#FF8C00] to-[#FF4500] text-black shadow-[0_0_20px_rgba(255,140,0,0.5)] hover:brightness-110 disabled:opacity-50" disabled={loading || !selectedAsteroid}>
            {loading ? "Fetching the data from the sources..." : "Calculate Impact"}
          </button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {selectedAsteroid ? (
            <div className="rounded-xl p-4" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)' }}>
              <h4 className="font-semibold text-[var(--color-accent)]">Asteroid Info</h4>
              <p className="mt-2 text-sm">Name: <strong>{selectedAsteroid.name}</strong></p>
              <p className="mt-1 text-sm">Diameter: <strong>{selectedAsteroid.diameter ?? '—'} m</strong></p>
              <p className="mt-1 text-sm">Mass: <strong>{selectedAsteroid.mass ?? '—'} kg</strong></p>
              <p className="mt-1 text-sm">Velocity: <strong>{selectedAsteroid.velocity ?? '—'} km/s</strong></p>
              <p className="mt-1 text-sm">Close Approach Date: <strong>{selectedAsteroid.close_approach_date ?? '—'}</strong></p>
              <p className="mt-1 text-sm">Risk Level: <strong>{selectedAsteroid.risk_level ?? '—'}</strong></p>
            </div>
          ) : (
            <div className="rounded-xl p-4" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.006))', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(4px)' }}>
              <h4 className="font-semibold text-[var(--color-accent)]">Asteroid Info</h4>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">Select an asteroid to view precomputed info.</p>
            </div>
          )}

          <div className="mt-4 rounded-xl p-3 border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)]">
            <h5 className="font-semibold">Quick pick</h5>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">Click a name to load its details</p>
            <ul className="mt-2 max-h-40 overflow-auto text-sm space-y-1">
              {asteroids.length > 0 ? (
                asteroids.map((a) => (
                  <li key={String(a.id ?? a.name)}>
                    <button className="w-full text-left px-2 py-1 rounded hover:bg-[rgba(255,255,255,0.02)]" onClick={() => setSelectedAsteroid(a)}>{a.name}</button>
                  </li>
                ))
              ) : (
                <li className="text-[var(--color-muted-foreground)]">No asteroids available</li>
              )}
            </ul>
          </div>

          <div className="mt-4">
            <AsteroidVisualization asteroid={selectedAsteroid} />
          </div>

          <MetricCards data={impactDetails} />
          <ImpactSummaryCard data={impactDetails} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl p-4 border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)]">
            <h4 className="font-semibold">Impact vs Hiroshima Equivalents</h4>
            <EnergyGraph series={[{ name: 'Impact', value: Number(impactDetails?.impact_energy || 0) }, { name: 'Hiroshima', value: 6.3e13 }]} />
          </div>

          <div className="rounded-xl p-4 border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)]">
            <h4 className="font-semibold">Impact 3D Visualization</h4>
            <Impact3D impactPoint={impactDetails?.impact_point ?? undefined} />
          </div>
        </div>

        <div className="lg:col-span-3 mt-6 flex flex-col items-center">
          <h4 className="font-semibold mb-2">Share Your Simulation</h4>
          <div className="flex gap-4">
            <button className="share-button x-button px-4 py-2 rounded bg-[#1DA1F2] text-white" onClick={() => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`)}>Share on X</button>
            <button className="share-button instagram-button px-4 py-2 rounded bg-gradient-to-r from-pink-500 to-yellow-500 text-white" onClick={() => window.open(`https://www.instagram.com/?text=${encodeURIComponent(shareText)}`)}>Share on Instagram</button>
          </div>
        </div>

      </div>
    </main>
  );
}
