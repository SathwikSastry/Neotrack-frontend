"use client"

import React, { useEffect, useState } from 'react';
import { ImpactSummaryCard } from "@/components/impact/impact-summary";
import { EnergyGraph } from "@/components/impact/energy-graph";
import { Impact3D } from "@/components/impact/impact-3d";
import { MetricCards } from "@/components/impact/metric-cards";
import { AsteroidVisualization } from "@/components/impact/asteroid-visualization";

interface Asteroid {
  name: string;
  diameter: number;
  mass: number;
  velocity: number;
  close_approach_date: string;
  risk_level: string;
}

interface ImpactDetails {
  impact_energy: number;
  crater_depth_m: number;
  blast_radius_km: number;
  seismic_magnitude_mw: number;
  energy_graph_data?: any;
  summary_text?: string;
}

export default function ImpactZonePage() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [impactDetails, setImpactDetails] = useState<ImpactDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [shareText, setShareText] = useState("");

  useEffect(() => {
    fetch('/api/asteroids?limit=20')
      .then(res => res.json())
      .then(data => {
        setAsteroids(data.list || []);
      })
      .catch(() => {
        setAsteroids([]);
      });
  }, []);

  const handleAsteroidChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const asteroid = asteroids.find(a => a.name === e.target.value) || null;
    setSelectedAsteroid(asteroid);
    setImpactDetails(null);
  };

  const handleCalculateImpact = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedAsteroid) return;
    setLoading(true);
    setLoadingMessage('Fetching the data from sources...');
    try {
      const res = await fetch('/api/impact-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedAsteroid.name }),
      });
      const data = await res.json();
      setImpactDetails(data);
      setShareText(`Asteroid ${selectedAsteroid.name} impact: ${data.summary_text || ''}`);
    } catch (err) {
      setImpactDetails(null);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">Impact Assessment Dashboard</h1>
      <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed">Interactive tools to analyze impact energy, expected crater, blast radius, and seismic equivalence.</p>

      {/* Dropdown for asteroids */}
      <div className="mt-6">
        <label htmlFor="asteroid-select" className="text-sm text-[var(--color-muted-foreground)]">Select Asteroid</label>
        <select
          id="asteroid-select"
          className="mt-2 w-full rounded p-3 bg-[rgba(255,255,255,0.04)] text-white"
          style={{ fontFamily: "Orbitron, sans-serif", border: "1px solid rgba(255,255,255,0.12)" }}
          onChange={handleAsteroidChange}
          defaultValue=""
        >
          <option value="" disabled>-- Select asteroid --</option>
          {asteroids.map((a) => (
            <option key={a.name} value={a.name}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Asteroid Info Panel */}
      <div className="mt-6">
        {selectedAsteroid ? (
          <div className="rounded-xl p-4" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)' }}>
            <h4 className="font-semibold text-[var(--color-accent)]">Asteroid Info</h4>
            <p className="mt-2 text-sm">Name: <strong>{selectedAsteroid.name}</strong></p>
            <p className="mt-1 text-sm">Diameter: <strong>{selectedAsteroid.diameter} m</strong></p>
            <p className="mt-1 text-sm">Mass: <strong>{selectedAsteroid.mass} kg</strong></p>
            <p className="mt-1 text-sm">Velocity: <strong>{selectedAsteroid.velocity} km/s</strong></p>
            <p className="mt-1 text-sm">Close Approach Date: <strong>{selectedAsteroid.close_approach_date}</strong></p>
            <p className="mt-1 text-sm">Risk Level: <strong>{selectedAsteroid.risk_level}</strong></p>
          </div>
        ) : (
          <div className="rounded-xl p-4" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.006))', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(4px)' }}>
            <h4 className="font-semibold text-[var(--color-accent)]">Asteroid Info</h4>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">Select an asteroid to view precomputed info.</p>
          </div>
        )}
      </div>

      {/* Calculate Impact Button */}
      <div className="mt-6 flex items-center gap-3">
        <button
          aria-label="Calculate Impact"
          className="px-4 py-2 rounded bg-gradient-to-r from-[#FF8C00] to-[#FF4500] text-black shadow-[0_0_20px_rgba(255,140,0,0.5)] hover:brightness-110 disabled:opacity-50"
          disabled={!selectedAsteroid || loading}
          onClick={handleCalculateImpact}
        >
          {loading ? "Fetching the data from sources..." : "Calculate Impact"}
        </button>
        {loading && <span className="ml-2 text-sm text-[var(--color-muted-foreground)]">Fetching the data from sources…</span>}
      </div>

      {/* Results Section */}
      {impactDetails && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metric Cards */}
          <div className="lg:col-span-1 space-y-4">
            <MetricCards data={impactDetails} />
            <ImpactSummaryCard data={impactDetails} />
          </div>
          {/* Energy Graph & 3D Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl p-4 border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)]">
              <h4 className="font-semibold">Impact vs Hiroshima Equivalents</h4>
              <EnergyGraph data={impactDetails.energy_graph_data} />
            </div>
            <div className="rounded-xl p-4 border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.02)]">
              <h4 className="font-semibold">Impact 3D Visualization</h4>
              <Impact3D data={impactDetails} />
            </div>
          </div>
          {/* Social Share Buttons */}
          <div className="lg:col-span-3 mt-6 flex flex-col items-center">
            <h4 className="font-semibold mb-2">Share Your Simulation</h4>
            <div className="flex gap-4">
              <button
                className="share-button x-button px-4 py-2 rounded bg-[#1DA1F2] text-white"
                onClick={() => {
                  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`);
                }}
              >Share on X</button>
              <button
                className="share-button instagram-button px-4 py-2 rounded bg-gradient-to-r from-pink-500 to-yellow-500 text-white"
                onClick={() => {
                  window.open(`https://www.instagram.com/?text=${encodeURIComponent(shareText)}`);
                }}
              >Share on Instagram</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
