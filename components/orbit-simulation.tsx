"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

type NamedObject3D = THREE.Mesh & { userData: { label?: string } }

export function OrbitSimulation() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = Math.max(360, Math.floor(width * 0.56))

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 5, 12)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)
    const point = new THREE.PointLight(0xffffff, 1.2, 0, 2)
    point.position.set(5, 6, 4)
    scene.add(point)

    // Group to rotate with drag
    const world = new THREE.Group()
    scene.add(world)

    // Earth
    const earthGeo = new THREE.SphereGeometry(1.2, 48, 48)
    const earthMat = new THREE.MeshPhongMaterial({ color: 0x1e90ff, shininess: 40, specular: 0x2266aa })
    const earth = new THREE.Mesh(earthGeo, earthMat) as NamedObject3D
    earth.userData.label = "Earth"
    world.add(earth)

    // Moon
    const moonGeo = new THREE.SphereGeometry(0.34, 32, 32)
    const moonMat = new THREE.MeshPhongMaterial({ color: 0xb0b7c3, shininess: 10 })
    const moon = new THREE.Mesh(moonGeo, moonMat) as NamedObject3D
    moon.userData.label = "Moon"
    world.add(moon)

    // Moon orbit path
    const moonPath = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        new Array(256).fill(0).map((_, i) => {
          const t = (i / 256) * Math.PI * 2
          return new THREE.Vector3(Math.cos(t) * 3.2, 0, Math.sin(t) * 3.2)
        }),
      ),
      new THREE.LineBasicMaterial({ color: 0x42526b, transparent: true, opacity: 0.6 }),
    )
    world.add(moonPath)

    // Asteroids: try fetching from backend, otherwise generate locally
    const beltRadius = 5.4
    const asteroidMat = new THREE.MeshPhongMaterial({ color: 0x9aa4b2 })
    const asteroids: NamedObject3D[] = []

    const createAsteroid = (a: { r: number; theta: number; y?: number; size?: number; label?: string }) => {
      const size = a.size ?? 0.08
      const geo = new THREE.DodecahedronGeometry(size)
      const mesh = new THREE.Mesh(geo, asteroidMat) as NamedObject3D
      mesh.position.set(Math.cos(a.theta) * a.r, a.y ?? (Math.random() - 0.5) * 0.2, Math.sin(a.theta) * a.r)
      mesh.rotation.set(Math.random(), Math.random(), Math.random())
      mesh.userData.label = a.label ?? "Asteroid"
      world.add(mesh)
      asteroids.push(mesh)
    }

    // Fetch asteroids from backend
    fetch((window as any).__NEOTRACK_API_BASE__ ? `${(window as any).__NEOTRACK_API_BASE__}/api/asteroids` : "/api/asteroids")
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data ?? []
        if (data.length > 0) {
          data.forEach((a: any) => {
            createAsteroid({ r: a.r ?? beltRadius, theta: a.theta ?? Math.random() * Math.PI * 2, y: a.y ?? 0, size: a.size ?? 0.08, label: a.label })
          })
        } else {
          // fallback generate
          for (let i = 0; i < 60; i++) {
            const r = beltRadius + (Math.random() - 0.5) * 0.6
            const theta = Math.random() * Math.PI * 2
            const size = 0.06 + Math.random() * 0.12
            createAsteroid({ r, theta, size, label: `Asteroid ${i + 1}` })
          }
        }
      })
      .catch(() => {
        for (let i = 0; i < 60; i++) {
          const r = beltRadius + (Math.random() - 0.5) * 0.6
          const theta = Math.random() * Math.PI * 2
          const size = 0.06 + Math.random() * 0.12
          createAsteroid({ r, theta, size, label: `Asteroid ${i + 1}` })
        }
      })


    // Asteroid belt path line (visual hint)
    const belt = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        new Array(256).fill(0).map((_, i) => {
          const t = (i / 256) * Math.PI * 2
          return new THREE.Vector3(Math.cos(t) * beltRadius, 0, Math.sin(t) * beltRadius)
        }),
      ),
      new THREE.LineDashedMaterial({ color: 0x334155, scale: 1, dashSize: 0.2, gapSize: 0.1 }),
    )
    ;(belt.material as THREE.LineDashedMaterial).needsUpdate = true
    world.add(belt)

    // Interaction: drag rotate and wheel zoom
    let isDragging = false
    let prevX = 0
    let prevY = 0
    let worldRotY = 0
    let worldRotX = -0.1
    let distance = 12

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      prevX = e.clientX
      prevY = e.clientY
    }
    const onPointerUp = () => {
      isDragging = false
    }
    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevX
        const dy = e.clientY - prevY
        prevX = e.clientX
        prevY = e.clientY
        worldRotY += dx * 0.005
        worldRotX = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, worldRotX + dy * 0.003))
      }
      // Hover detection
      const rect = renderer.domElement.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      )
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects<THREE.Mesh>([earth, moon, ...asteroids], true)
      if (intersects.length > 0) {
        const obj = intersects[0].object as NamedObject3D
        setHovered(obj.userData.label || null)
        renderer.domElement.style.cursor = "pointer"
      } else {
        setHovered(null)
        renderer.domElement.style.cursor = "grab"
      }
    }
    const onWheel = (e: WheelEvent) => {
      distance += e.deltaY * 0.002
      distance = Math.max(6, Math.min(24, distance))
    }

    renderer.domElement.style.cursor = "grab"
    renderer.domElement.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true })

    const raycaster = new THREE.Raycaster()

    // Resize handling
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = Math.max(360, Math.floor(w * 0.56))
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(container)

    // Animation loop
    let raf = 0
    let t = 0
    const animate = () => {
      t += 0.01
      // Earth spin
      earth.rotation.y += 0.0025
      // Moon orbit
      moon.position.set(Math.cos(t) * 3.2, 0, Math.sin(t) * 3.2)
      // World rotation from drag
      world.rotation.set(worldRotX, worldRotY, 0)
      // Camera distance easing
      const camTarget = new THREE.Vector3(0, 0, distance)
      camera.position.lerp(new THREE.Vector3(0, 3, camTarget.z), 0.1)
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointermove", onPointerMove)
      renderer.domElement.removeEventListener("wheel", onWheel)
      container.removeChild(renderer.domElement)
      // Dispose resources
      earthGeo.dispose()
      earthMat.dispose()
      moonGeo.dispose()
      moonMat.dispose()
      asteroidMat.dispose()
      asteroids.forEach((a) => a.geometry.dispose())
      ;(moonPath.geometry as THREE.BufferGeometry).dispose()
      ;(moonPath.material as THREE.Material).dispose()
      ;(belt.geometry as THREE.BufferGeometry).dispose()
      ;(belt.material as THREE.Material).dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      className="relative w-full"
      ref={containerRef}
      role="img"
      aria-label="3D orbit of Earth, Moon, and asteroid belt"
    >
      {/* Hover info */}
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-[color:rgba(0,0,0,0.4)] px-2 py-1 text-xs text-[var(--color-foreground)] backdrop-blur-md">
        {hovered ? hovered : "Hover objects for details"}
      </div>
      {/* Decorative parallax stars on top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 opacity-40 blur-2xl"
        style={{
          background:
            "radial-gradient(80px 80px at 60% 50%, var(--color-accent) 0%, transparent 70%), radial-gradient(110px 110px at 30% 50%, var(--color-primary) 0%, transparent 75%)",
        }}
      />
    </div>
  )
}
