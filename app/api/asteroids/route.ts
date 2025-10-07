export async function GET() {
  try {
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendBase}/api/asteroids`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data) {
      return new Response(JSON.stringify({ status: "ok", data: [], list: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ status: "ok", data: [], list: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
