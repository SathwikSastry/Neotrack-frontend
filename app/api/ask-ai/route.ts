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
    return new Response(JSON.stringify(data), {
      status: res.ok ? res.status : 502,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ response: "Network error contacting Space AI. Please try again." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}


