export default function AsteroidInfoPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6">
      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">Asteroid Info</h1>
      <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed">
        Explore near-Earth objects, sizes, velocities, and orbital parameters. API integration with NASA/JPL will be
        added next.
      </p>
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[color:rgba(255,255,255,0.04)] p-6 backdrop-blur-md">
        <p className="text-sm text-[var(--muted-foreground)]">
          Coming soon: searchable catalog, details, and risk indicators.
        </p>
      </div>
    </main>
  )
}
