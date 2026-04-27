import { useEffect, useRef, useMemo, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { navigateToDemo } from '../utils/tracking'
import { useInView, useCountUp, usePrefersReducedMotion } from '../utils/animations'
import ScrubVideoScene from './ScrubVideoScene'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* Particle brain — sits between video and text */
function ParticleBrain({ count = 1200 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      [0.0, 0.831, 0.667],
      [0.0, 0.706, 0.847],
      [0.388, 0.4, 0.945],
    ]
    const weights = [0.7, 0.9, 1.0]

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.2 + (Math.random() - 0.5) * 1.2
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      const distFromCore = Math.sqrt(pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2)
      const brightness = Math.max(0.5, 1.4 - distFromCore / 3.5)

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
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Core() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15
    ref.current.scale.set(s, s, s)
  })
  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshBasicMaterial color="#00D4AA" transparent opacity={0.95} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color="#00D4AA" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  )
}

function AnimatedStat({ value, label, suffix = '', prefix = '' }: {
  value: number; label: string; suffix?: string; prefix?: string
}) {
  const { ref, inView } = useInView(0.5)
  const count = useCountUp(value, inView)
  return (
    <div ref={ref} className="text-center">
      <div className="font-heading font-bold" style={{ color: '#F0F0F5', fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums' }}>
        {prefix}{count}{suffix}
      </div>
      <div className="text-xs mt-1" style={{ color: '#4A4F58', letterSpacing: '0.1em' }}>{label}</div>
    </div>
  )
}

function ScrollIndicator() {
  return (
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
  const showBrain = !isMobile && !reducedMotion
  const particleCount = screenWidth < 1024 ? 700 : 1200

  const titleAnim = (delay: number, withGlow = false) => ({
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      ...(withGlow && {
        textShadow: [
          '0 0 0px rgba(0,212,170,0)',
          '0 0 80px rgba(0,212,170,0.7)',
          '0 0 40px rgba(0,212,170,0.3)',
        ],
      }),
    },
    transition: {
      delay: reducedMotion ? 0 : delay,
      duration: reducedMotion ? 0.01 : 0.7,
      ease: EASE,
      ...(withGlow && {
        textShadow: { delay: delay + 0.3, duration: 1.4, times: [0, 0.4, 1] },
      }),
    },
  })

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reducedMotion ? 0 : delay, duration: reducedMotion ? 0.01 : 0.6, ease: EASE },
  })

  return (
    <ScrubVideoScene
      src="/videos/hero-bg.mp4"
      height="200vh"
      opacity={0.5}
      overlay="linear-gradient(to bottom, rgba(5,5,5,0.25) 0%, rgba(5,5,5,0.85) 100%)"
    >
      {/* Particle brain — between video and text (z-index 5) */}
      {showBrain && (
        <Suspense fallback={null}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 60 }}
              dpr={[1, 1.5]}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.5} />
              <ParticleBrain count={particleCount} />
              <Core />
            </Canvas>
          </div>
        </Suspense>
      )}

      {/* Content (z-index 10) */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '2rem',
          padding: '0 1.5rem',
        }}
      >
        <motion.div {...fadeIn(0.3)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <div style={{ height: 1, width: 32, background: 'rgba(0,212,170,0.3)' }} />
          <span style={{ fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', color: '#00D4AA', letterSpacing: '0.4em' }}>
            Autonomous AI Platform
          </span>
          <div style={{ height: 1, width: 32, background: 'rgba(0,212,170,0.3)' }} />
        </motion.div>

        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          <motion.span {...titleAnim(0.6)} style={{ display: 'block', color: '#F0F0F5' }}>
            One System.
          </motion.span>
          <motion.span
            {...titleAnim(0.9, true)}
            className="gradient-text"
            style={{ display: 'inline-block' }}
          >
            Every Department.
          </motion.span>
        </h1>

        <motion.p {...fadeIn(1.2)} style={{ color: '#8A8F98', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 600 }}>
          Sales, marketing, HR, and operations &mdash; all managed by AI that thinks, decides, and executes.
        </motion.p>

        <motion.div {...fadeIn(1.6)} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <motion.button
            onClick={() => navigateToDemo('hero_start_free_trial')}
            whileHover={{ scale: 1.04, background: '#00E8BB', boxShadow: '0 0 30px rgba(0,212,170,0.35)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: '#00D4AA',
              color: '#050505',
              padding: '14px 32px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Start Free Trial
          </motion.button>
          <motion.button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ borderColor: '#00D4AA', color: '#F0F0F5' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'transparent',
              color: '#8A8F98',
              border: '1px solid #2A2A38',
              padding: '14px 32px',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            See the Architecture
          </motion.button>
        </motion.div>

        <motion.div {...fadeIn(2.0)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '2.5rem' }}>
          <AnimatedStat value={6} label="INDUSTRIES" />
          <div style={{ width: 1, height: 32, background: '#1A1A24' }} className="hidden sm:block" />
          <AnimatedStat value={100} label="AUTONOMOUS" suffix="%" />
          <div style={{ width: 1, height: 32, background: '#1A1A24' }} className="hidden sm:block" />
          <AnimatedStat value={0} label="MANUAL LABOR" prefix="$" />
          <div style={{ width: 1, height: 32, background: '#1A1A24' }} className="hidden sm:block" />
          <AnimatedStat value={24} label="AI OPERATIONS" suffix="/7" />
        </motion.div>
      </div>

      <ScrollIndicator />
    </ScrubVideoScene>
  )
}
