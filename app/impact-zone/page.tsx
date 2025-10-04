export default function ImpactZonePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6">
      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">Impact Zone</h1>
      <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed">
        Visualize projected impact zones and atmospheric entry paths. Mapping and simulation layers will be added.
      </p>
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.04)] p-6 backdrop-blur-md">
        <p className="text-sm text-[var(--muted-foreground)]">
          Coming soon: map overlays, past events, and probabilistic cone visualization.
        </p>
      </div>
    </main>
  )
}
