import { useEffect, useRef, useMemo, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { navigateToDemo } from '../utils/tracking'
import { usePrefersReducedMotion } from '../utils/animations'
import ScrubVideoScene from './ScrubVideoScene'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* Particle brain */
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

      const dist = Math.sqrt(pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2)
      const brightness = Math.max(0.5, 1.4 - dist / 3.5)
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
        size={0.022}
        vertexColors
        transparent
        opacity={0.8}
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
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial color="#00D4AA" transparent opacity={0.95} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshBasicMaterial color="#00D4AA" transparent opacity={0.13} blending={THREE.AdditiveBlending} />
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
  const showBrain = !reducedMotion
  const particleCount = isTablet ? 700 : 1200

  // Word-by-word stagger for "One System." and "Every Department."
  const lineVariants = (delay: number, withGlow = false) => ({
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      ...(withGlow && {
        textShadow: [
          '0 0 0px rgba(0,212,170,0)',
          '0 0 60px rgba(0,212,170,0.6)',
          '0 0 30px rgba(0,212,170,0.25)',
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
      height="180vh"
      opacity={0.4}
      overlay="linear-gradient(to right, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.65) 50%, rgba(5,5,5,0.4) 100%)"
    >
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 1280,
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '45fr 55fr',
          gap: 'clamp(2rem, 4vw, 4rem)',
          alignItems: 'center',
        }}
      >
        {/* LEFT — text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
            gap: '1.75rem',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            <motion.span {...lineVariants(0.4)} style={{ display: 'block', color: '#F0F0F5' }}>
              One System.
            </motion.span>
            <motion.span
              {...lineVariants(0.7, true)}
              className="gradient-text"
              style={{ display: 'block' }}
            >
              Every Department.
            </motion.span>
          </h1>

          <motion.p
            {...fadeIn(1.1)}
            style={{
              color: '#8A8F98',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              maxWidth: 520,
              margin: 0,
            }}
          >
            AI that thinks, decides, and executes &mdash; across your entire business.
          </motion.p>

          <motion.div
            {...fadeIn(1.4)}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}
          >
            <motion.button
              onClick={() => navigateToDemo('hero_start_free_trial')}
              whileHover={{ scale: 1.04, background: '#00E8BB', boxShadow: '0 0 30px rgba(0,212,170,0.35)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: '#00D4AA',
                color: '#050505',
                padding: '14px 28px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
            >
              Start Free Trial
            </motion.button>
            <motion.a
              href="tel:+14048192917"
              onClick={() => navigateToDemo('hero_call_ai')}
              whileHover={{ borderColor: '#00D4AA', color: '#F0F0F5' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'transparent',
                color: '#8A8F98',
                border: '1px solid #2A2A38',
                padding: '14px 24px',
                borderRadius: 8,
                fontWeight: 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#00D4AA',
                  animation: 'livePulse 1.6s ease-in-out infinite',
                  flexShrink: 0,
                  marginRight: '0.25rem',
                }}
              />
              Talk to our AI &rarr;
            </motion.a>
          </motion.div>
        </div>

        {/* RIGHT — R3F particle brain */}
        {showBrain && !isMobile && (
          <Suspense fallback={null}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1',
                maxHeight: '70vh',
              }}
            >
              <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                dpr={[1, 1.5]}
                style={{ background: 'transparent', pointerEvents: 'none' }}
              >
                <ambientLight intensity={0.5} />
                <ParticleBrain count={particleCount} />
                <Core />
              </Canvas>
            </div>
          </Suspense>
        )}
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,170,0.5); transform: scale(1); }
          50% { box-shadow: 0 0 0 6px rgba(0,212,170,0); transform: scale(1.2); }
        }
      `}</style>
    </ScrubVideoScene>
  )
}
