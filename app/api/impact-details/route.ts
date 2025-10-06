import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: 'Asteroid name is required' }, { status: 400 })
    }

    // Mock impact calculation based on asteroid name
    const mockImpactData = {
      impact_energy: Math.random() * 1e15 + 1e12, // Random energy in Joules
      impact_energy_mt: Math.random() * 100 + 1, // Random energy in Megatons
      crater_depth_m: Math.random() * 500 + 50,
      blast_radius_km: Math.random() * 50 + 5,
      seismic_magnitude_mw: Math.random() * 3 + 4,
      displacement_m: Math.random() * 100 + 10,
      summary_text: `Asteroid ${name} would create a significant impact with ${Math.random() * 100 + 1} megatons of energy.`,
      energy_graph_data: [
        { name: 'Impact', value: Math.random() * 1e15 + 1e12 },
        { name: 'Hiroshima', value: 6.3e13 }
      ],
      impact_point: {
        lat: Math.random() * 180 - 90,
        lon: Math.random() * 360 - 180
      }
    }

    return NextResponse.json(mockImpactData)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
