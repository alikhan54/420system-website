import { useEffect, useRef, useMemo, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { navigateToDemo } from '../utils/tracking'
import { useInView, useCountUp, usePrefersReducedMotion } from '../utils/animations'
import VideoScene from './VideoScene'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* Particle brain — sits between video and text */
function ParticleBrain({ count = 1200 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    // 70% teal, 20% ocean blue, 10% indigo
    const palette = [
      [0.0, 0.831, 0.667],   // #00D4AA teal
      [0.0, 0.706, 0.847],   // #00B4D8 ocean
      [0.388, 0.4, 0.945],   // #6366F1 indigo
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

/* Glowing core */
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

/* Animated stat with count-up */
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

/* Scroll indicator */
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ delay: 2.6, duration: 0.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      style={{ zIndex: 20 }}
    >
      <span className="text-[10px] font-mono tracking-[0.4em] uppercase" style={{ color: '#4A4F58' }}>
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
    <VideoScene
      src="/videos/hero-bg.mp4"
      parallaxIntensity={0.3}
      scaleRange={[1.15, 1]}
      rotateOnScroll
      direction="up"
      minHeight="100vh"
      padding="6rem 1.5rem 4rem"
      overlay="linear-gradient(to bottom, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0.85) 100%)"
    >
      {/* Particle brain — between video and content */}
      {showBrain && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
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

      {/* Content — above the brain */}
      <div
        className="relative w-full flex flex-col items-center text-center mx-auto"
        style={{ zIndex: 10, maxWidth: 900, gap: '2rem', minHeight: '88vh', justifyContent: 'center', display: 'flex' }}
      >
        <motion.div {...fadeIn(0.3)} className="flex items-center justify-center gap-3">
          <div className="h-px w-8" style={{ background: 'rgba(0,212,170,0.3)' }} />
          <span className="text-[11px] font-mono uppercase" style={{ color: '#00D4AA', letterSpacing: '0.4em' }}>
            Autonomous AI Platform
          </span>
          <div className="h-px w-8" style={{ background: 'rgba(0,212,170,0.3)' }} />
        </motion.div>

        <h1 className="font-[800]" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          <motion.span {...titleAnim(0.6)} className="block" style={{ color: '#F0F0F5' }}>
            One System.
          </motion.span>
          <motion.span {...titleAnim(0.9, true)} className="block gradient-text" style={{ display: 'inline-block' }}>
            Every Department.
          </motion.span>
        </h1>

        <motion.p {...fadeIn(1.2)} className="max-w-[600px] mx-auto" style={{ color: '#8A8F98', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Sales, marketing, HR, and operations &mdash; all managed by AI that thinks, decides, and executes.
        </motion.p>

        <motion.div {...fadeIn(1.6)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={() => navigateToDemo('hero_start_free_trial')}
            whileHover={{ scale: 1.04, background: '#00E8BB', boxShadow: '0 0 30px rgba(0,212,170,0.35)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-lg font-medium text-sm cursor-pointer border-none"
            style={{ background: '#00D4AA', color: '#050505', transition: 'background 0.2s' }}
          >
            Start Free Trial
          </motion.button>
          <motion.button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ borderColor: '#00D4AA', color: '#F0F0F5' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-lg font-medium text-sm cursor-pointer bg-transparent"
            style={{ color: '#8A8F98', border: '1px solid #2A2A38' }}
          >
            See the Architecture
          </motion.button>
        </motion.div>

        <motion.div {...fadeIn(2.0)} className="flex items-center justify-center flex-wrap" style={{ gap: '2.5rem' }}>
          <AnimatedStat value={6} label="INDUSTRIES" />
          <div className="w-px h-8 hidden sm:block" style={{ background: '#1A1A24' }} />
          <AnimatedStat value={100} label="AUTONOMOUS" suffix="%" />
          <div className="w-px h-8 hidden sm:block" style={{ background: '#1A1A24' }} />
          <AnimatedStat value={0} label="MANUAL LABOR" prefix="$" />
          <div className="w-px h-8 hidden sm:block" style={{ background: '#1A1A24' }} />
          <AnimatedStat value={24} label="AI OPERATIONS" suffix="/7" />
        </motion.div>
      </div>

      <ScrollIndicator />
    </VideoScene>
  )
}
