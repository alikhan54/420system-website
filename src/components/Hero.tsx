import { useEffect, useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { navigateToDemo } from '../utils/tracking'

/* ─── Particle Brain ─── */
function ParticleBrain() {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const count = 1500
  const lineCount = count * 3

  const [positions, colors, linePositions, lineColors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const lPos = new Float32Array(lineCount * 2 * 3)
    const lCol = new Float32Array(lineCount * 2 * 3)

    const palette = [
      [0, 0.94, 1],
      [0.04, 0.81, 0.51],
      [0.48, 0.38, 1],
    ]

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.2 + (Math.random() - 0.5) * 1.2

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c[0]
      col[i * 3 + 1] = c[1]
      col[i * 3 + 2] = c[2]
    }

    lPos.fill(0)
    lCol.fill(0)

    return [pos, col, lPos, lCol]
  }, [])

  const lineRef = useRef<THREE.LineSegments>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    meshRef.current.rotation.y = t * 0.05 + mouseRef.current.x * 0.3
    meshRef.current.rotation.x = mouseRef.current.y * 0.2

    if (lineRef.current) {
      const posAttr = meshRef.current.geometry.attributes.position
      const lGeo = lineRef.current.geometry
      const lPosAttr = lGeo.attributes.position as THREE.BufferAttribute
      const lColAttr = lGeo.attributes.color as THREE.BufferAttribute
      let lineIdx = 0

      const tempA = new THREE.Vector3()
      const tempB = new THREE.Vector3()
      const maxDist = 0.65

      for (let i = 0; i < count && lineIdx < lineCount; i++) {
        tempA.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
        tempA.applyMatrix4(meshRef.current.matrixWorld)

        for (let j = i + 1; j < Math.min(i + 20, count) && lineIdx < lineCount; j++) {
          tempB.set(posAttr.getX(j), posAttr.getY(j), posAttr.getZ(j))
          tempB.applyMatrix4(meshRef.current.matrixWorld)

          const dist = tempA.distanceTo(tempB)
          if (dist < maxDist) {
            const alpha = 1 - dist / maxDist

            lPosAttr.setXYZ(lineIdx * 2, tempA.x, tempA.y, tempA.z)
            lPosAttr.setXYZ(lineIdx * 2 + 1, tempB.x, tempB.y, tempB.z)

            lColAttr.setXYZ(lineIdx * 2, 0, 0.94 * alpha * 0.3, alpha * 0.3)
            lColAttr.setXYZ(lineIdx * 2 + 1, 0, 0.94 * alpha * 0.3, alpha * 0.3)

            lineIdx++
          }
        }
      }

      for (let i = lineIdx; i < lineCount; i++) {
        lPosAttr.setXYZ(i * 2, 0, 0, 0)
        lPosAttr.setXYZ(i * 2 + 1, 0, 0, 0)
      }

      lPosAttr.needsUpdate = true
      lColAttr.needsUpdate = true
      lGeo.setDrawRange(0, lineIdx * 2)
    }
  })

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={lineCount * 2}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lineCount * 2}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  )
}

/* ─── Stats item ─── */
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-lg md:text-xl font-heading font-bold text-text">{value}</div>
      <div className="text-xs text-text-muted mt-0.5">{label}</div>
    </div>
  )
}

/* ─── Hero Section ─── */
export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const children = el.querySelectorAll('.hero-anim')
    gsap.fromTo(
      children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      },
    )
  }, [])

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: '8rem', paddingBottom: '4rem' }}
    >
      {/* Three.js Background — fixed, hidden on mobile */}
      {!isMobile && (
        <div className="fixed inset-0" style={{ zIndex: 0 }}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            dpr={[1, 1.5]}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.5} />
            <ParticleBrain />
          </Canvas>
        </div>
      )}

      {/* Radial gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, #020008 70%)',
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative flex flex-col items-center text-center max-w-[840px] mx-auto px-6"
        style={{ zIndex: 10, gap: '2rem' }}
      >
        {/* Label */}
        <div className="hero-anim flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-cyan/40" />
          <span className="text-xs font-mono tracking-[0.2em] text-cyan uppercase">
            Autonomous AI Platform
          </span>
          <div className="h-px w-8 bg-cyan/40" />
        </div>

        {/* Heading */}
        <h1 className="hero-anim font-[800] leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}
        >
          <span className="text-text">One System.</span>
          <br />
          <span className="gradient-text">Every Department.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-anim text-base md:text-lg text-text-muted max-w-[560px] mx-auto leading-relaxed">
          The 420 System replaces your entire software stack with a single autonomous AI
          platform. Sales, marketing, HR, and operations — all managed by AI that thinks,
          decides, and executes.
        </p>

        {/* Buttons */}
        <div className="hero-anim flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigateToDemo('hero_start_free_trial')}
            className="px-8 py-3.5 rounded-lg font-medium text-sm text-bg cursor-pointer border-none transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00F0FF, #0ACF83)',
            }}
          >
            Start Free Trial
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-lg font-medium text-sm text-text-muted border border-card-border hover:border-text-muted/40 hover:text-text transition-all duration-300 cursor-pointer bg-transparent"
          >
            See the Architecture
          </button>
        </div>

        {/* Stats */}
        <div className="hero-anim flex items-center justify-center flex-wrap" style={{ gap: '2.5rem' }}>
          <StatItem value="6" label="Industries" />
          <div className="w-px h-8 bg-card-border hidden sm:block" />
          <StatItem value="100%" label="Autonomous" />
          <div className="w-px h-8 bg-card-border hidden sm:block" />
          <StatItem value="$0" label="Manual Labor" />
          <div className="w-px h-8 bg-card-border hidden sm:block" />
          <StatItem value="24/7" label="AI Operations" />
        </div>
      </div>
    </section>
  )
}
