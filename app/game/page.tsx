"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function GamePage() {
  const [loaded, setLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // recommended hosted URL for the game; if you host the repo, update this to the hosted URL
  // Serve the embedded game's production files through a Next route at /game/static/index.html
  const GAME_URL = process.env.NEXT_PUBLIC_GAME_URL || "/astro-neo-defense/index.html"
  // When serving locally the origin will be the site's origin.
  const GAME_ORIGIN = process.env.NEXT_PUBLIC_GAME_ORIGIN || (typeof window !== 'undefined' ? window.location.origin : '')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    // Listen for messages from the iframe, but validate origin.
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== GAME_ORIGIN) return
      // handle simple status messages
      if (e.data && e.data.type === 'status' && e.data.payload === 'ready') {
        setLoaded(true)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [GAME_ORIGIN])

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-20" style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.02), transparent), var(--color-background)" }}>
      <div className="w-full max-w-6xl px-4">
        <h1 className="text-3xl font-[var(--font-display)] text-[var(--color-foreground)] text-center">🛰️ Asteroid Defense Simulation</h1>
        <p className="mt-3 text-center text-[var(--color-muted-foreground)]">Experience how space defense missions work — control your spacecraft to deflect asteroids and protect Earth!</p>

        <div className="mt-8 flex items-center justify-center">
          {!loaded && (
            <div role="status" aria-live="polite" className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full border-4 border-t-[var(--color-accent)] animate-spin" />
              <div className="text-sm font-[var(--font-display)] text-[var(--color-accent)]">Preparing Space Defense Simulation...</div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <div style={{ width: "100%", maxWidth: 1200, height: isFullscreen ? '100vh' : 750, borderRadius: 16, overflow: 'hidden', boxShadow: '0 0 30px rgba(255,140,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <iframe
              id="astro-neo-iframe"
              title="Astro NEO Defense"
              src={GAME_URL}
              sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              referrerPolicy="no-referrer"
              loading="lazy"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: 16, background: 'transparent' }}
              onLoad={() => setLoaded(true)}
              onError={() => {
                // If iframe fails to load, show a console hint; the server route may be misconfigured or assets missing.
                console.error('Failed to load embedded game at', GAME_URL)
                setLoaded(false)
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => setIsFullscreen((s) => !s)} className="px-4 py-2 rounded bg-[var(--color-primary)] text-black">{isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}</button>
          <button
            onClick={() => {
              const f = document.getElementById('astro-neo-iframe') as HTMLIFrameElement | null
              if (f && f.contentWindow) {
                f.contentWindow.postMessage({ type: 'restart' }, GAME_ORIGIN)
              }
            }}
            className="px-4 py-2 rounded bg-[var(--color-accent)]"
          >
            Restart
          </button>
          <button
            onClick={() => {
              const f = document.getElementById('astro-neo-iframe') as HTMLIFrameElement | null
              if (f && f.contentWindow) {
                f.contentWindow.postMessage({ type: 'toggle-sound' }, GAME_ORIGIN)
              }
            }}
            className="px-4 py-2 rounded bg-[var(--color-secondary)]"
          >
            Sound
          </button>
        </div>

      </div>
    </main>
  )
}
