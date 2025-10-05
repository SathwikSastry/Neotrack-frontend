"use client"

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function latLonToCartesian(lat: number, lon: number, radius = 1.0) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return [x, y, z]
}

function Marker({ lat, lon, size = 0.02, color = 'orange', name }: any) {
  const ref = useRef<any>()
  return (
    <mesh ref={ref} position={latLonToCartesian(lat, lon, 1.01)}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial emissive={new THREE.Color(color)} color={color} />
      <Html distanceFactor={10} position={[0, size + 0.02, 0]}>
        <div style={{ color: 'white', fontSize: 10, textAlign: 'center', pointerEvents: 'none' }}>{name}</div>
      </Html>
    </mesh>
  )
}

export default function MeteoriteGlobe({ items }: { items: any[] }) {
  const earthTexture = useRef<any>()

  useEffect(() => {
    // preload if necessary
  }, [])

  return (
    <div style={{ height: 420 }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color={'#07203c'} metalness={0.1} roughness={0.8} />
        </mesh>
        {items.slice(0, 12).map((it, i) => (
          <Marker key={i} lat={Number(it.geolocation.latitude)} lon={Number(it.geolocation.longitude)} size={Math.max(0.01, (it.crater_diameter_km || 0) * 0.02)} color={it.is_hazardous ? '#ff4d4f' : '#00bfff'} name={it.name} />
        ))}
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>
    </div>
  )
}
