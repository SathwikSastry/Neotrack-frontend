import GameCanvas from "@/components/GameCanvas";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-[#0f1729] to-background flex flex-col">
      <header className="p-6 flex justify-between items-center border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
            <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AstroDefender</h1>
            <p className="text-xs text-muted-foreground">NeoTrack Mission</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
            Powered by NASA NEO API
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <GameCanvas />
      </main>

      <footer className="p-4 text-center text-xs text-muted-foreground border-t border-primary/20">
        <p>Planetary defense game • Destroy all asteroids • Real NASA data • Learn while you play</p>
      </footer>
    </div>
  );
};

export default Index;
