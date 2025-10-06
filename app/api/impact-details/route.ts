export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendBase}/api/impact-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asteroid_name: payload?.asteroid_name || payload?.name,
        target: payload?.target || 'ground',
        velocity_kms: payload?.velocity_kms,
        mass_kg: payload?.mass_kg,
        diameter_m: payload?.diameter_m,
      }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data) {
      return new Response(JSON.stringify({ status: 'error', message: 'Backend unavailable' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
