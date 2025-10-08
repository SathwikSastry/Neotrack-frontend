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

  // Pre-load asteroids data with a smaller initial limit for faster loading
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  
  useEffect(() => {
    // Set a loading state to provide immediate feedback
    setIsLoadingOptions(true);
    
    // Use a cached approach with localStorage if available
    const cachedAsteroids = localStorage.getItem('cachedAsteroids');
    if (cachedAsteroids) {
      try {
        const parsed = JSON.parse(cachedAsteroids);
        setAsteroids(parsed);
        setIsLoadingOptions(false);
        
        // Still fetch fresh data in background
        fetch('/api/asteroids?limit=20')
          .then((r) => r.json())
          .then((j) => {
            const newData = j?.list || j || [];
            setAsteroids(newData);
            localStorage.setItem('cachedAsteroids', JSON.stringify(newData));
          })
          .catch(console.error);
      } catch (e) {
        // If cache parsing fails, fetch normally
        fetchAsteroids();
      }
    } else {
      fetchAsteroids();
    }
  }, []);
  
  // Separate fetch function for cleaner code
  const fetchAsteroids = () => {
    fetch('/api/asteroids?limit=20')
      .then((r) => r.json())
      .then((j) => {
        const data = j?.list || j || [];
        setAsteroids(data);
        setIsLoadingOptions(false);
        // Cache the results
        try {
          localStorage.setItem('cachedAsteroids', JSON.stringify(data));
        } catch (e) {
          console.error('Failed to cache asteroid data', e);
        }
      })
      .catch((err) => {
        console.error(err);
        setAsteroids([]);
        setIsLoadingOptions(false);
      });
  };

  const handleAsteroidChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    // Use a more efficient lookup with Map if there are many asteroids
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
      <div className="mt-2 mb-4 text-center">
        <a 
          href="https://drive.google.com/file/d/1B5QGTMOQnzrWLYXhXrgzIsx42FhiCBHe/view?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#6495ED] hover:text-[#87CEFA] transition-colors duration-200 font-medium"
          style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "0.03em" }}
        >
          Educate yourself with basics
        </a>
      </div>

      <form onSubmit={handleCalculateImpact} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <label className="flex flex-col">
            <span className="text-sm text-[var(--color-muted-foreground)]">Select Asteroid</span>
            <select
              aria-label="Select Asteroid"
              value={selectedAsteroid?.name ?? ""}
              onChange={handleAsteroidChange}
              disabled={isLoadingOptions}
              className={`mt-2 w-full rounded-lg p-4 bg-[rgba(20,20,40,0.8)] text-[#f0f0ff] font-medium appearance-none ${isLoadingOptions ? 'opacity-80' : 'cursor-pointer'}`}
              style={{ 
                fontFamily: "Orbitron, sans-serif", 
                border: "1px solid rgba(100,149,237,0.6)",
                boxShadow: "0 0 12px rgba(100,149,237,0.35)",
                fontSize: "1.05rem",
                letterSpacing: "0.03em",
                backgroundImage: "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236495ED%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem top 50%",
                backgroundSize: "0.8rem auto",
                paddingRight: "2.5rem",
                transition: "all 0.15s ease-in-out"
              }}
            >
              <option value="" style={{ backgroundColor: "#1a1a2e", color: "#f0f0ff", padding: "12px", fontSize: "1rem" }}>
                {isLoadingOptions ? "Loading asteroids..." : "-- Select asteroid --"}
              </option>
              {asteroids.map((a) => (
                <option 
                  key={String(a.id ?? a.name)} 
                  value={a.name}
                  style={{ backgroundColor: "#1a1a2e", color: "#f0f0ff", padding: "12px", fontSize: "1rem" }}
                >
                  {a.name}
                </option>
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
