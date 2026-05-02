import { useEffect, useRef, useMemo, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { navigateToDemo } from '../utils/tracking'
import { usePrefersReducedMotion } from '../utils/animations'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* ─── LAYER 4a: Particle brain ─── */
function ParticleBrain({ count = 600 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      [0.0, 0.831, 0.667],   // teal #00D4AA
      [0.0, 0.706, 0.847],   // ocean #00B4D8
      [0.388, 0.4, 0.945],   // indigo #6366F1
    ]
    const weights = [0.7, 0.9, 1.0]

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.2 + (Math.random() - 0.5) * 1.2
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      const dist = Math.sqrt(pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2)
      // Brighter falloff — center particles glow strongest
      const brightness = Math.max(0.7, 1.6 - dist / 3.5)
      const rand = Math.random()
      const ci = rand < weights[0] ? 0 : rand < weights[1] ? 1 : 2
      const c = palette[ci]
      col[i * 3] = Math.min(1, c[0] * brightness)
      col[i * 3 + 1] = Math.min(1, c[1] * brightness)
      col[i * 3 + 2] = Math.min(1, c[2] * brightness)
    }
    return [pos, col]
  }, [count])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.y = t * 0.05 + mouseRef.current.x * 0.3
    meshRef.current.rotation.x = mouseRef.current.y * 0.2
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
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── LAYER 4b: Glowing core (intense emissive) ─── */
function Core() {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const auraRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      const s = 1 + Math.sin(t * 2) * 0.18
      ref.current.scale.set(s, s, s)
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.12
      glowRef.current.scale.set(s, s, s)
    }
    if (auraRef.current) {
      const s = 1 + Math.sin(t * 1) * 0.08
      auraRef.current.scale.set(s, s, s)
    }
  })

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={2} color="#00D4AA" distance={5} />
      <mesh ref={ref}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color="#00FFCC" transparent opacity={1} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#00D4AA" transparent opacity={0.22} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={auraRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#00B4D8" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  )
}

/* ─── LAYER 4c: Three orbital rings ─── */
function OrbitalRings() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ring1.current) ring1.current.rotation.y += 0.0015
    if (ring2.current) {
      ring2.current.rotation.x += 0.001
      ring2.current.rotation.y += 0.0008
    }
    if (ring3.current) {
      ring3.current.rotation.z += 0.0012
      ring3.current.rotation.x += 0.0005
    }
  })

  return (
    <>
      <mesh ref={ring1} rotation={[Math.PI * 0.3, 0, 0]}>
        <torusGeometry args={[2.8, 0.005, 8, 80]} />
        <meshBasicMaterial color="#00D4AA" transparent opacity={0.25} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI * 0.5, Math.PI * 0.2, 0]}>
        <torusGeometry args={[3.3, 0.005, 8, 80]} />
        <meshBasicMaterial color="#00B4D8" transparent opacity={0.18} />
      </mesh>
      <mesh ref={ring3} rotation={[0, 0, Math.PI * 0.4]}>
        <torusGeometry args={[3.8, 0.004, 8, 80]} />
        <meshBasicMaterial color="#6366F1" transparent opacity={0.13} />
      </mesh>
    </>
  )
}

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const [screenWidth, setScreenWidth] = useState(1024)

  useEffect(() => {
    const check = () => setScreenWidth(window.innerWidth)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const isMobile = screenWidth < 768
  const isTablet = screenWidth < 1024
  const showBrain = !reducedMotion // even mobile gets a tiny brain
  const particleCount = isMobile ? 250 : isTablet ? 400 : 600

  /* Choreographed entrance via Framer Motion (lightweight, no GSAP needed for this) */
  const fadeIn = (delay: number, y = 20) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : y },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reducedMotion ? 0 : delay, duration: reducedMotion ? 0.01 : 0.6, ease: EASE },
  })

  const titleAnim = (delay: number) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 60 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reducedMotion ? 0 : delay, duration: reducedMotion ? 0.01 : 0.6, ease: EASE },
  })

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '6rem 1.5rem 4rem',
        background: '#030308', // LAYER 1: deepest base
      }}
    >
      {/* LAYER 2: Drifting radial orbs */}
      {!reducedMotion && (
        <>
          <div
            className="hero-orb-1"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 1,
              background: 'radial-gradient(circle 600px at 30% 40%, rgba(0,212,170,0.07), transparent 70%)',
              animation: 'heroOrb1Drift 30s ease-in-out infinite',
            }}
          />
          <div
            className="hero-orb-2"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 1,
              background: 'radial-gradient(circle 500px at 70% 60%, rgba(99,102,241,0.06), transparent 70%)',
              animation: 'heroOrb2Drift 25s ease-in-out infinite',
            }}
          />
          <div
            className="hero-orb-3"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 1,
              background: 'radial-gradient(circle 400px at 50% 30%, rgba(0,180,216,0.05), transparent 70%)',
              animation: 'heroOrb3Pulse 20s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* LAYER 3: Subtle grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 100%)',
        }}
      />

      {/* LAYER 4: R3F particle brain + core + rings */}
      {showBrain && (
        <Suspense fallback={null}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: EASE }}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 3,
            }}
          >
            <Canvas
              camera={{ position: [0, 0, 5], fov: 60 }}
              dpr={[1, 1.5]}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.4} />
              <ParticleBrain count={particleCount} />
              <Core />
              <OrbitalRings />
            </Canvas>
          </motion.div>
        </Suspense>
      )}

      {/* Vignette overlay — improves text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 4,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(3,3,8,0.1) 0%, rgba(3,3,8,0.7) 80%)',
        }}
      />

      {/* LAYER 5: Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 900,
          gap: '1.75rem',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            margin: 0,
          }}
        >
          <motion.span {...titleAnim(0.8)} style={{ display: 'block', color: '#F0F0F5' }}>
            One System.
          </motion.span>
          <span style={{ display: 'block' }}>
            <motion.span
              {...titleAnim(1.1)}
              className="hero-glow-pulse"
              style={{
                display: 'inline-block',
                color: '#00D4AA',
                textShadow: '0 0 80px rgba(0,212,170,0.5), 0 0 160px rgba(0,212,170,0.2)',
              }}
            >
              Every
            </motion.span>{' '}
            <motion.span
              {...titleAnim(1.4)}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #00D4AA 0%, #00B4D8 50%, #6366F1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Department.
            </motion.span>
          </span>
        </h1>

        <motion.p
          {...fadeIn(2.0)}
          style={{
            fontSize: '1.05rem',
            color: '#8A8F98',
            lineHeight: 1.8,
            maxWidth: 540,
            margin: 0,
          }}
        >
          The world&rsquo;s first fully autonomous AI platform. Sales, marketing, HR, and operations &mdash; unified as one intelligence.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.1, delayChildren: reducedMotion ? 0 : 2.3 } },
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '0.5rem',
          }}
        >
          <motion.button
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={() => navigateToDemo('hero_start_free_trial')}
            whileHover={{ scale: 1.04, background: '#00E8BB', boxShadow: '0 0 40px rgba(0,212,170,0.45)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: '#00D4AA',
              color: '#050505',
              padding: '15px 36px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s',
              boxShadow: '0 0 30px rgba(0,212,170,0.25)',
            }}
          >
            Start Free Trial
          </motion.button>
          <motion.a
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: EASE }}
            href="tel:+14048192917"
            onClick={() => navigateToDemo('hero_call_ai')}
            whileHover={{ borderColor: '#00D4AA', color: '#F0F0F5' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'transparent',
              color: '#8A8F98',
              border: '1px solid #2A2A38',
              padding: '15px 36px',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#00D4AA',
                animation: 'livePulse 1.6s ease-in-out infinite',
              }}
            />
            Talk to our AI &rarr;
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2.6, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#4A4F58' }}>
          Scroll
        </span>
        <motion.svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#00D4AA" strokeWidth="1.5"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>

      <style>{`
        @keyframes heroOrb1Drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(8%, -3%); }
        }
        @keyframes heroOrb2Drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-6%, -8%); }
        }
        @keyframes heroOrb3Pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        @keyframes heroGlowPulse {
          0% { text-shadow: 0 0 80px rgba(0,212,170,0.8), 0 0 160px rgba(0,212,170,0.4); }
          100% { text-shadow: 0 0 80px rgba(0,212,170,0.5), 0 0 160px rgba(0,212,170,0.2); }
        }
        .hero-glow-pulse {
          animation: heroGlowPulse 2s ease-out 1.5s 1 both;
        }
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,170,0.5); transform: scale(1); }
          50% { box-shadow: 0 0 0 6px rgba(0,212,170,0); transform: scale(1.2); }
        }
      `}</style>
    </section>
  )
}
