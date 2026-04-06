import { useEffect, useState, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '../utils/animations'

/* ─── Footer particle cluster ─── */
function FooterParticles() {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const count = 150

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      [0, 0.94, 1],
      [0.04, 0.81, 0.51],
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c[0]
      col[i * 3 + 1] = c[1]
      col[i * 3 + 2] = c[2]
    }
    return [pos, col]
  }, [])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.ty = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05
    mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05
    meshRef.current.rotation.y = t * 0.05 + mouseRef.current.x * 0.5
    meshRef.current.rotation.x = mouseRef.current.y * 0.3
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── Typewriter for "Built by Zate Systems" ─── */
function TypewriterBrand() {
  const fullText = 'Zate Systems'
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) { setDisplayed(fullText); return }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started, reducedMotion])

  useEffect(() => {
    if (!started || reducedMotion) return
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(fullText.slice(0, ++i))
      if (i >= fullText.length) clearInterval(interval)
    }, 70)
    return () => clearInterval(interval)
  }, [started, reducedMotion])

  return (
    <span ref={ref} className="font-heading font-bold text-sm">
      {displayed}
      {started && displayed.length < fullText.length && <span className="animate-pulse">|</span>}
    </span>
  )
}

export default function Footer() {
  const [screenWidth, setScreenWidth] = useState(1024)

  useEffect(() => {
    const check = () => setScreenWidth(window.innerWidth)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const showCanvas = screenWidth >= 768

  return (
    <footer
      className="relative border-t border-card-border py-12 px-6 md:px-12 overflow-hidden"
      style={{ zIndex: 2 }}
    >
      {/* Mini Three.js scene — background */}
      {showCanvas && (
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 4], fov: 60 }} dpr={[1, 1.5]} style={{ background: 'transparent' }}>
              <ambientLight intensity={0.4} />
              <FooterParticles />
            </Canvas>
          </Suspense>
        </div>
      )}

      <div className="relative max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4" style={{ zIndex: 2 }}>
        <div className="flex items-center gap-1.5 text-sm text-text-muted">
          <span>&copy; 2026</span>
          <span className="font-heading font-bold">
            <span className="text-cyan">4</span>
            <span className="text-emerald">20</span>
          </span>
          <span>System</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-text-muted">
          <a href="#" className="hover:text-text transition-colors">Privacy</a>
          <a href="#" className="hover:text-text transition-colors">Terms</a>
          <a href="mailto:ai@zatesystems.com" className="hover:text-text transition-colors">ai@zatesystems.com</a>
          <span className="text-text-muted/40">|</span>
          <a
            href="https://zatesystems.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-text-muted hover:text-emerald transition-colors"
          >
            <span className="text-xs">Built by</span>
            <TypewriterBrand />
          </a>
        </div>
      </div>
    </footer>
  )
}
