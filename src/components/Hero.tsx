import { useEffect, useRef, useMemo, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { navigateToDemo } from '../utils/tracking'
import { useInView, useCountUp, usePrefersReducedMotion } from '../utils/animations'

/* ─── Glowing core ─── */
function GlowingCore() {
  const coreRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 2) * 0.15
      coreRef.current.scale.set(s, s, s)
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.1
      glowRef.current.scale.set(s, s, s)
    }
  })

  return (
    <>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshBasicMaterial color="#0ACF83" transparent opacity={0.95} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color="#0ACF83" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  )
}

/* ─── Data rings ─── */
function DataRings() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)
  const ring4 = useRef<THREE.Mesh>(null)
  const ring5 = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ring1.current) ring1.current.rotation.y += 0.001
    if (ring2.current) { ring2.current.rotation.x += 0.0012; ring2.current.rotation.y += 0.0008 }
    if (ring3.current) ring3.current.rotation.z += 0.0015
    if (ring4.current) { ring4.current.rotation.x += 0.0008; ring4.current.rotation.z += 0.001 }
    if (ring5.current) ring5.current.rotation.y -= 0.0013
  })

  return (
    <>
      <mesh ref={ring1} rotation={[Math.PI * 0.3, 0, 0]}>
        <torusGeometry args={[2.8, 0.005, 8, 80]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.15} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI * 0.5, Math.PI * 0.2, 0]}>
        <torusGeometry args={[3.2, 0.005, 8, 80]} />
        <meshBasicMaterial color="#0ACF83" transparent opacity={0.12} />
      </mesh>
      <mesh ref={ring3} rotation={[0, 0, Math.PI * 0.4]}>
        <torusGeometry args={[3.6, 0.004, 8, 80]} />
        <meshBasicMaterial color="#7B61FF" transparent opacity={0.1} />
      </mesh>
      <mesh ref={ring4} rotation={[Math.PI * 0.25, Math.PI * 0.3, 0]}>
        <torusGeometry args={[4.0, 0.004, 8, 80]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.08} />
      </mesh>
      <mesh ref={ring5} rotation={[Math.PI * 0.6, 0, Math.PI * 0.2]}>
        <torusGeometry args={[4.4, 0.003, 8, 80]} />
        <meshBasicMaterial color="#0ACF83" transparent opacity={0.06} />
      </mesh>
    </>
  )
}

/* ─── Particle Brain with distance-based brightness ─── */
function ParticleBrain({ count = 2000 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const lineCount = count * 3

  const [positions, colors, linePositions, lineColors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const lPos = new Float32Array(lineCount * 2 * 3)
    const lCol = new Float32Array(lineCount * 2 * 3)

    const palette = [
      [0, 0.94, 1],      // cyan
      [0.04, 0.81, 0.51], // emerald
      [0.48, 0.38, 1],    // violet
    ]

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.2 + (Math.random() - 0.5) * 1.2

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      // Brightness based on distance from core (closer = brighter)
      const distFromCore = Math.sqrt(pos[i*3]**2 + pos[i*3+1]**2 + pos[i*3+2]**2)
      const brightness = Math.max(0.3, 1.2 - distFromCore / 3.5)

      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c[0] * brightness
      col[i * 3 + 1] = c[1] * brightness
      col[i * 3 + 2] = c[2] * brightness
    }

    lPos.fill(0)
    lCol.fill(0)

    return [pos, col, lPos, lCol]
  }, [count, lineCount])

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
      const maxDist = 0.55

      for (let i = 0; i < count && lineIdx < lineCount; i += 2) {
        tempA.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
        tempA.applyMatrix4(meshRef.current.matrixWorld)

        for (let j = i + 1; j < Math.min(i + 15, count) && lineIdx < lineCount; j++) {
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
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
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
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
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

/* ─── Typing label ─── */
function TypingLabel() {
  const text = 'Autonomous AI Platform'
  const [displayed, setDisplayed] = useState('')
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) { setDisplayed(text); return }
    let i = 0
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) clearInterval(timer)
    }, 45)
    return () => clearInterval(timer)
  }, [reducedMotion])

  return (
    <span className="text-xs font-mono tracking-[0.2em] text-cyan uppercase">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  )
}

/* ─── Animated stat ─── */
function AnimatedStat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { ref, inView } = useInView(0.5)
  const count = useCountUp(value, inView)

  return (
    <div ref={ref} className="text-center">
      <div className="text-lg md:text-xl font-heading font-bold text-text">
        {label === 'Manual Labor' ? '$' : ''}{count}{suffix}
      </div>
      <div className="text-xs text-text-muted mt-0.5">{label}</div>
    </div>
  )
}

/* ─── Code ticker ─── */
function CodeTicker() {
  const snippets = [
    'lead.score > 80 → route.sales',
    'campaign.launch → auto',
    'hire.onboard → 24hrs',
    'customer.reply → ai.respond',
    'invoice.overdue → dunning.start',
    'meeting.booked → calendar.sync',
    'signal.detected → strategy.pivot',
    'agent.analyze → action.execute',
    'metrics.daily → dashboard.refresh',
    'anomaly.found → alert.ops',
  ]
  const ticker = [...snippets, ...snippets, ...snippets].join('  •  ')

  return (
    <div className="w-full overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}>
      <div
        className="whitespace-nowrap font-mono text-xs text-text-muted"
        style={{
          opacity: 0.15,
          animation: 'tickerScroll 40s linear infinite',
          display: 'inline-block',
        }}
      >
        {ticker}
      </div>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}

/* ─── Gradient fallback ─── */
function CanvasFallback() {
  return (
    <div className="fixed inset-0" style={{
      zIndex: 0,
      background: 'radial-gradient(ellipse 40% 40% at 50% 50%, rgba(0,240,255,0.05) 0%, transparent 70%)',
    }} />
  )
}

/* ─── Hero Section ─── */
export default function Hero() {
  const [screenWidth, setScreenWidth] = useState(1024)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const check = () => setScreenWidth(window.innerWidth)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const isMobile = screenWidth < 768
  const isTablet = screenWidth < 1024
  const particleCount = isMobile ? 0 : isTablet ? 1000 : 2000

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.12, delayChildren: 0.3 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  }

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: '8rem', paddingBottom: '4rem' }}
    >
      {!isMobile ? (
        <Suspense fallback={<CanvasFallback />}>
          <div className="fixed inset-0" style={{ zIndex: 0 }}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 60 }}
              dpr={[1, 1.5]}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.5} />
              <ParticleBrain count={particleCount} />
              <GlowingCore />
              <DataRings />
            </Canvas>
          </div>
        </Suspense>
      ) : (
        <CanvasFallback />
      )}

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(2,0,8,0.3) 0%, #020008 65%)',
        }}
      />

      <motion.div
        className="relative flex flex-col items-center text-center max-w-[840px] mx-auto px-6"
        style={{ zIndex: 10, gap: '2rem' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-cyan/40" />
          <TypingLabel />
          <div className="h-px w-8 bg-cyan/40" />
        </motion.div>

        <motion.h1 variants={itemVariants}
          className="font-[800] leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}
        >
          <span className="text-text">One System.</span>
          <br />
          <span
            className="gradient-text"
            style={{
              textShadow: '0 0 60px rgba(0,240,255,0.4)',
              filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.2))',
            }}
          >
            Every Department.
          </span>
        </motion.h1>

        <motion.p variants={itemVariants}
          className="text-base md:text-lg text-text-muted max-w-[560px] mx-auto leading-relaxed"
        >
          The 420 System replaces your entire software stack with a single autonomous AI
          platform. Sales, marketing, HR, and operations — all managed by AI that thinks,
          decides, and executes.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={() => navigateToDemo('hero_start_free_trial')}
            className="px-8 py-3.5 rounded-lg font-medium text-sm text-bg cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #00F0FF, #0ACF83)' }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,240,255,0.3)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Start Free Trial
          </motion.button>
          <motion.button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-lg font-medium text-sm text-text-muted border border-card-border cursor-pointer bg-transparent"
            whileHover={{ borderColor: 'rgba(240,235,248,0.3)', color: '#F0EBF8' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            See the Architecture
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants}
          className="flex items-center justify-center flex-wrap" style={{ gap: '2.5rem' }}
        >
          <AnimatedStat value={6} label="Industries" />
          <div className="w-px h-8 bg-card-border hidden sm:block" />
          <AnimatedStat value={100} label="Autonomous" suffix="%" />
          <div className="w-px h-8 bg-card-border hidden sm:block" />
          <AnimatedStat value={0} label="Manual Labor" />
          <div className="w-px h-8 bg-card-border hidden sm:block" />
          <AnimatedStat value={24} label="AI Operations" suffix="/7" />
        </motion.div>

        {/* Code ticker */}
        <motion.div variants={itemVariants} className="w-full max-w-[900px] mt-4">
          <CodeTicker />
        </motion.div>
      </motion.div>
    </section>
  )
}
