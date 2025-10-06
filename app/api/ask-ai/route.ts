export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendBase}/api/ask-ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Avoid Next.js caching for dynamic AI responses
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    // If backend is unavailable or returned non-ok, provide a graceful fallback
    if (!res.ok || !data || typeof data.response !== "string") {
      const fallback = {
        response:
          "I’m here and listening. I couldn’t reach the server just now, but here’s a quick answer based on general space knowledge. Ask about asteroids, impact energy, NASA missions, or planetary defense, and I’ll guide you with concise explanations and next steps.",
      };
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    const fallback = {
      response:
        "I’m here and listening. I couldn’t reach the server just now, but here’s a quick answer based on general space knowledge. Ask about asteroids, impact energy, NASA missions, or planetary defense, and I’ll guide you with concise explanations and next steps.",
    };
    return new Response(JSON.stringify(fallback), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}


