import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Asteroid {
  x: number;
  y: number;
  radius: number;
  speed: number;
  name?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [asteroidFact, setAsteroidFact] = useState("");
  
  const gameRef = useRef({
    player: { x: 400, y: 500, width: 40, height: 60, speed: 8 },
    asteroids: [] as Asteroid[],
    stars: [] as Star[],
    keys: {} as Record<string, boolean>,
    animationId: 0,
    lastAsteroidSpawn: 0,
    asteroidSpawnRate: 1000,
  });

  // Initialize stars
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        size: Math.random() * 2,
        speed: Math.random() * 2 + 1,
      });
    }
    gameRef.current.stars = stars;
  }, []);

  // Fetch NASA asteroid data for facts
  const fetchAsteroidFact = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&api_key=DEMO_KEY`
      );
      const data = await response.json();
      
      const allAsteroids = Object.values(data.near_earth_objects).flat() as any[];
      if (allAsteroids.length > 0) {
        const randomAsteroid = allAsteroids[Math.floor(Math.random() * allAsteroids.length)];
        const diameter = randomAsteroid.estimated_diameter?.meters?.estimated_diameter_max || 0;
        const velocity = randomAsteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 0;
        
        setAsteroidFact(
          `Real NASA Data: Asteroid "${randomAsteroid.name}" is approximately ${Math.round(diameter)}m wide and travels at ${Math.round(velocity).toLocaleString()} km/h! ${randomAsteroid.is_potentially_hazardous_asteroid ? "⚠️ This is classified as potentially hazardous!" : "✅ This one is safe."}`
        );
      }
    } catch (error) {
      setAsteroidFact("Did you know? NASA tracks over 30,000 Near-Earth Objects to protect our planet!");
    }
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    gameRef.current.asteroids = [];
    gameRef.current.player.x = 380;
    gameRef.current.lastAsteroidSpawn = Date.now();
  };

  const gameOver = () => {
    setGameState("gameover");
    if (score > highScore) {
      setHighScore(score);
    }
    fetchAsteroidFact();
    setShowFact(true);
  };

  const spawnAsteroid = () => {
    const asteroid: Asteroid = {
      x: Math.random() * 760,
      y: -30,
      radius: Math.random() * 20 + 15,
      speed: Math.random() * 2 + 2,
    };
    gameRef.current.asteroids.push(asteroid);
  };

  const checkCollision = (player: any, asteroid: Asteroid) => {
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const dx = playerCenterX - asteroid.x;
    const dy = playerCenterY - asteroid.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < asteroid.radius + player.width / 3;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      gameRef.current.keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const gameLoop = () => {
      if (gameState !== "playing") return;

      ctx.fillStyle = "#0a0e1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      gameRef.current.stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${star.size / 2})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // Update player
      const player = gameRef.current.player;
      if (gameRef.current.keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
      }
      if (gameRef.current.keys["ArrowRight"] && player.x < canvas.width - player.width) {
        player.x += player.speed;
      }

      // Draw player (rocket)
      const gradient = ctx.createLinearGradient(player.x, player.y, player.x, player.y + player.height);
      gradient.addColorStop(0, "#38bdf8");
      gradient.addColorStop(1, "#3b82f6");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x, player.y + player.height);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.closePath();
      ctx.fill();

      // Draw thruster
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(player.x + player.width / 2, player.y + player.height + 5, 8, 0, Math.PI * 2);
      ctx.fill();

      // Spawn asteroids
      const now = Date.now();
      if (now - gameRef.current.lastAsteroidSpawn > gameRef.current.asteroidSpawnRate) {
        spawnAsteroid();
        gameRef.current.lastAsteroidSpawn = now;
      }

      // Update and draw asteroids
      gameRef.current.asteroids = gameRef.current.asteroids.filter((asteroid) => {
        asteroid.y += asteroid.speed;

        // Remove asteroid if it escapes off screen
        if (asteroid.y > canvas.height + 50) {
          return false;
        }

        // NEW MECHANIC: Hitting asteroid is GOOD! Increases score
        if (checkCollision(player, asteroid)) {
          setScore((s) => s + 10);
          
          // Create explosion effect
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(asteroid.x, asteroid.y, asteroid.radius * 2, 0, Math.PI * 2);
          ctx.fill();
          
          return false; // Remove asteroid after hit
        }

        // Draw asteroid
        ctx.fillStyle = "#94a3b8";
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const sides = 8;
        for (let i = 0; i < sides; i++) {
          const angle = (Math.PI * 2 * i) / sides;
          const radius = asteroid.radius * (0.8 + Math.random() * 0.4);
          const x = asteroid.x + Math.cos(angle) * radius;
          const y = asteroid.y + Math.sin(angle) * radius;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        return true;
      });

      gameRef.current.animationId = requestAnimationFrame(gameLoop);
    };

    if (gameState === "playing") {
      gameLoop();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, [gameState]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-2 border-primary/30 rounded-lg shadow-[0_0_30px_rgba(56,189,248,0.3)]"
      />
      
      {gameState === "menu" && (
        <Card className="absolute inset-0 m-auto w-96 h-64 flex flex-col items-center justify-center gap-6 bg-card/95 backdrop-blur-sm border-primary/30">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AstroDefender
          </h1>
          <p className="text-muted-foreground text-center px-6">
            Destroy asteroids before they escape! Learn about NASA's planetary defense missions
          </p>
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6"
          >
            Launch Mission
          </Button>
        </Card>
      )}

      {gameState === "playing" && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary animate-pulse-glow">
            Score: {score}
          </div>
          <div className="text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-lg border border-primary/20">
            🎯 HIT asteroids to score points! Use ← → arrows
          </div>
        </div>
      )}

      {gameState === "gameover" && (
        <Card className="absolute inset-0 m-auto w-[500px] h-auto p-8 flex flex-col items-center justify-center gap-6 bg-card/95 backdrop-blur-sm border-destructive/50 animate-slide-up">
          <h2 className="text-3xl font-bold text-destructive">Asteroid Escaped!</h2>
          <div className="space-y-2 text-center">
            <p className="text-xl">Final Score: <span className="text-primary font-bold">{score}</span></p>
            <p className="text-sm text-muted-foreground">High Score: {highScore}</p>
          </div>
          
          {showFact && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-sm">
              <p className="text-foreground">{asteroidFact}</p>
            </div>
          )}
          
          <div className="flex gap-4">
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Retry Mission
            </Button>
            <Button 
              onClick={() => {
                setGameState("menu");
                setShowFact(false);
              }}
              variant="outline"
              className="border-primary/30"
            >
              Main Menu
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GameCanvas;
