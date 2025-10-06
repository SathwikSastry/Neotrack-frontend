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

import { NextResponse } from 'next/server'

// Mock asteroid data for development
const mockAsteroids = [
  {
    id: 1,
    name: "2024 AB1",
    diameter: 50,
    mass: 1.5e8,
    velocity: 15.2,
    close_approach_date: "2024-03-15",
    risk_level: "low"
  },
  {
    id: 2,
    name: "2024 CD2",
    diameter: 120,
    mass: 8.2e9,
    velocity: 22.1,
    close_approach_date: "2024-04-20",
    risk_level: "medium"
  },
  {
    id: 3,
    name: "2024 EF3",
    diameter: 200,
    mass: 2.1e10,
    velocity: 18.7,
    close_approach_date: "2024-05-10",
    risk_level: "high"
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  
  return NextResponse.json({
    list: mockAsteroids.slice(0, limit),
    total: mockAsteroids.length
  })
}
