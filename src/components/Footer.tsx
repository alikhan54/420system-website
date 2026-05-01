import { useEffect, useState, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '../utils/animations'

/* ─── Full-width particle cluster ─── */
function FooterParticles() {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const count = 250

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [[0.0, 0.831, 0.667], [0.0, 0.706, 0.847], [0.388, 0.4, 0.945]]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
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
    meshRef.current.rotation.y = t * 0.03 + mouseRef.current.x * 0.3
    meshRef.current.rotation.x = mouseRef.current.y * 0.15
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── Typewriter tagline ─── */
function TypewriterTagline() {
  const fullText = 'One brain. Every department. Infinite leverage.'
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
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
    }, 35)
    return () => clearInterval(interval)
  }, [started, reducedMotion])

  return (
    <div
      ref={ref}
      className="font-mono text-xs md:text-sm tracking-[0.15em] text-center mb-8 min-h-[1.5rem]"
      style={{ color: '#00D4AA', opacity: 0.85 }}
    >
      {displayed}
      {started && displayed.length < fullText.length && <span className="animate-pulse">|</span>}
    </div>
  )
}

/* ─── Zate Systems typewriter (existing behavior) ─── */
function ZateBrand() {
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
      className="relative overflow-hidden"
      style={{ zIndex: 2, paddingTop: '4rem', paddingBottom: '2.5rem', background: '#050505', borderTop: '1px solid #1A1A24' }}
    >
      {/* Full-width particle scene */}
      {showCanvas && (
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]} style={{ background: 'transparent' }}>
              <ambientLight intensity={0.4} />
              <FooterParticles />
            </Canvas>
          </Suspense>
        </div>
      )}

      {/* Top gradient line */}
      <div
        className="absolute left-0 right-0 top-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(0,180,216,0.4), transparent)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 md:px-12" style={{ zIndex: 2 }}>
        <TypewriterTagline />

        {/* Live AI banner — single line */}
        <div className="flex justify-center items-center mb-8" style={{ gap: '0.6rem' }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#00D4AA',
              animation: 'livePulse 1.6s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4A4F58' }}>
            24/7 AI:
          </span>
          <a
            href="tel:+14048192917"
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              fontFamily: 'monospace',
              color: '#8A8F98',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00D4AA')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8F98')}
          >
            +1 (404) 819-2917
          </a>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#4A4F58' }}>
            <span>&copy; 2026</span>
            <span className="font-heading font-bold">
              <span style={{ color: '#00D4AA' }}>4</span>
              <span style={{ color: '#00B4D8' }}>20</span>
            </span>
            <span>System</span>
          </div>

          <div className="flex items-center gap-6 text-sm" style={{ color: '#8A8F98' }}>
            <a href="#" className="transition-colors" style={{ color: '#8A8F98' }}
               onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F5')}
               onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8F98')}>Privacy</a>
            <a href="#" className="transition-colors" style={{ color: '#8A8F98' }}
               onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F5')}
               onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8F98')}>Terms</a>
            <a href="mailto:ai@zatesystems.com" className="transition-colors" style={{ color: '#8A8F98' }}
               onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F5')}
               onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8F98')}>
              ai@zatesystems.com
            </a>
            <span className="hidden md:inline" style={{ color: '#2A2A38' }}>|</span>
            <a
              href="https://zatesystems.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 transition-colors"
              style={{ color: '#8A8F98' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#00D4AA')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8F98')}
            >
              <span className="text-xs">Built by</span>
              <ZateBrand />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
