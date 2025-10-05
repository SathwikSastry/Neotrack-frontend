"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei" // removed Stars import
import { TextureLoader, type Mesh } from "three"

/**
 * Earth model component
 * - Uses a high-segment sphere and an Earth texture
 * - Rotates gently to convey motion
 */
function Earth() {
  const earthRef = useRef<Mesh>(null)
  const texture = useLoader(TextureLoader, "/assets/3d/texture_earth.jpg") // sample asset available by default

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.25 // gentle rotation
    }
  })

  return (
    <mesh ref={earthRef} scale={1.2}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} />
    </mesh>
  )
}

/**
 * EarthHero
 * - Self-contained Canvas for the Hero area
 * - Locked zoom/pan so it stays decorative and smooth
 */
export default function EarthHero() {
  return (
    <div className="relative h-56 w-full md:h-72 lg:h-80">
      <Canvas camera={{ position: [0, 0, 2.6], fov: 45 }} dpr={[1, 2]}>
        {/* Soft lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 2, 2]} intensity={1.2} />
        {/* Earth model */}
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        {/* Removed <Stars .../> which used a custom ShaderMaterial causing the VALIDATE_STATUS error */}
        <Environment preset="night" />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  )
}
