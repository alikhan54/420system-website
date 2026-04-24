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
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color="#0ACF83" transparent opacity={1} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#0ACF83" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  )
}

/* ─── Data rings ─── */
function DataRings() {
  const refs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)]
  useFrame(() => {
    if (refs[0].current) refs[0].current.rotation.y += 0.001
    if (refs[1].current) { refs[1].current.rotation.x += 0.0012; refs[1].current.rotation.y += 0.0008 }
    if (refs[2].current) refs[2].current.rotation.z += 0.0015
    if (refs[3].current) { refs[3].current.rotation.x += 0.0008; refs[3].current.rotation.z += 0.001 }
    if (refs[4].current) refs[4].current.rotation.y -= 0.0013
  })
  return (
    <>
      <mesh ref={refs[0]} rotation={[Math.PI * 0.3, 0, 0]}>
        <torusGeometry args={[2.8, 0.006, 8, 80]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.2} />
      </mesh>
      <mesh ref={refs[1]} rotation={[Math.PI * 0.5, Math.PI * 0.2, 0]}>
        <torusGeometry args={[3.2, 0.006, 8, 80]} />
        <meshBasicMaterial color="#0ACF83" transparent opacity={0.16} />
      </mesh>
      <mesh ref={refs[2]} rotation={[0, 0, Math.PI * 0.4]}>
        <torusGeometry args={[3.6, 0.005, 8, 80]} />
        <meshBasicMaterial color="#7B61FF" transparent opacity={0.12} />
      </mesh>
      <mesh ref={refs[3]} rotation={[Math.PI * 0.25, Math.PI * 0.3, 0]}>
        <torusGeometry args={[4.0, 0.004, 8, 80]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.1} />
      </mesh>
      <mesh ref={refs[4]} rotation={[Math.PI * 0.6, 0, Math.PI * 0.2]}>
        <torusGeometry args={[4.4, 0.003, 8, 80]} />
        <meshBasicMaterial color="#0ACF83" transparent opacity={0.08} />
      </mesh>
    </>
  )
}

/* ─── Particle Brain — bright, full-viewport, glowing ─── */
function ParticleBrain({ count = 2000 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const lineCount = count * 3

  const [positions, colors, linePositions, lineColors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const lPos = new Float32Array(lineCount * 2 * 3)
    const lCol = new Float32Array(lineCount * 2 * 3)
    const palette = [[0, 0.94, 1], [0.04, 0.81, 0.51], [0.48, 0.38, 1]]
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.2 + (Math.random() - 0.5) * 1.2
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      const distFromCore = Math.sqrt(pos[i*3]**2 + pos[i*3+1]**2 + pos[i*3+2]**2)
      const brightness = Math.max(0.5, 1.4 - distFromCore / 3.5)
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = Math.min(1, c[0] * brightness)
      col[i * 3 + 1] = Math.min(1, c[1] * brightness)
      col[i * 3 + 2] = Math.min(1, c[2] * brightness)
    }
    lPos.fill(0); lCol.fill(0)
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
            lColAttr.setXYZ(lineIdx * 2, 0, 0.94 * alpha * 0.4, alpha * 0.4)
            lColAttr.setXYZ(lineIdx * 2 + 1, 0, 0.94 * alpha * 0.4, alpha * 0.4)
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
        <pointsMaterial size={0.028} vertexColors transparent opacity={1} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </>
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

/* ─── Mouse-following light ─── */
function MouseLight() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    let tx = 0, ty = 0, x = 0, y = 0
    const handleMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    const tick = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      if (ref.current) ref.current.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', handleMove)
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', handleMove); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div
      ref={ref}
      className="fixed pointer-events-none"
      style={{
        zIndex: 2,
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 60%)',
        willChange: 'transform',
      }}
    />
  )
}

/* ─── Scroll chevron ─── */
function ScrollChevron() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ delay: 2.8, duration: 0.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <span className="text-[10px] font-mono tracking-[0.3em] text-text-muted uppercase">Scroll</span>
      <motion.svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#0ACF83" strokeWidth="1.5"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M6 9l6 6 6-6" />
      </motion.svg>
    </motion.div>
  )
}

function CanvasFallback() {
  return (
    <div className="fixed inset-0" style={{
      zIndex: 0,
      background: 'radial-gradient(ellipse 40% 40% at 50% 50%, rgba(0,240,255,0.05) 0%, transparent 70%)',
    }} />
  )
}

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
  const particleCount = isMobile ? 0 : isTablet ? 1200 : 2000

  const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: '8rem', paddingBottom: '4rem' }}
    >
      {!isMobile ? (
        <Suspense fallback={<CanvasFallback />}>
          <div className="fixed inset-0" style={{ zIndex: 0 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]} style={{ background: 'transparent' }}>
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

      {/* Lighter overlay — brain is the star */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(2,0,8,0.1) 0%, rgba(2,0,8,0.7) 55%, #020008 85%)',
        }}
      />

      {!isMobile && !reducedMotion && <MouseLight />}

      {/* Content — choreographed reveal */}
      <div className="relative flex flex-col items-center text-center max-w-[840px] mx-auto px-6" style={{ zIndex: 10, gap: '2rem' }}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
          className="flex items-center justify-center gap-3"
        >
          <div className="h-px w-8 bg-cyan/40" />
          <span className="text-xs font-mono tracking-[0.3em] text-emerald uppercase">
            Autonomous AI Platform
          </span>
          <div className="h-px w-8 bg-cyan/40" />
        </motion.div>

        {/* Title — line-by-line choreography */}
        <h1 className="font-[800] leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)', letterSpacing: '-0.03em' }}>
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
            className="block text-text"
          >
            One System.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3, ease: EASE }}
            className="block gradient-text"
            style={{ display: 'inline-block' }}
          >
            Every
          </motion.span>{' '}
          <motion.span
            initial={{ opacity: 0, y: 60, textShadow: '0 0 0px rgba(0,240,255,0)' }}
            animate={{
              opacity: 1,
              y: 0,
              textShadow: [
                '0 0 0px rgba(0,240,255,0)',
                '0 0 80px rgba(0,240,255,0.8)',
                '0 0 40px rgba(0,240,255,0.4)',
              ],
            }}
            transition={{
              delay: 1.0,
              duration: 0.6,
              ease: EASE,
              textShadow: { delay: 1.3, duration: 1.4, times: [0, 0.4, 1] },
            }}
            className="block gradient-text"
            style={{ display: 'inline-block' }}
          >
            Department.
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.5, ease: EASE }}
          className="text-base md:text-lg max-w-[560px] mx-auto"
          style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}
        >
          The 420 System replaces your entire software stack with a single autonomous AI
          platform. Sales, marketing, HR, and operations — all managed by AI that thinks,
          decides, and executes.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 2.1 } },
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={() => navigateToDemo('hero_start_free_trial')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,240,255,0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-lg font-medium text-sm text-bg cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #00F0FF, #0ACF83)' }}
          >
            Start Free Trial
          </motion.button>
          <motion.button
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ borderColor: 'rgba(240,235,248,0.3)', color: '#F0EBF8' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-lg font-medium text-sm text-text-muted border border-card-border cursor-pointer bg-transparent"
          >
            See the Architecture
          </motion.button>
        </motion.div>

        {/* Stats — stagger left to right */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 2.4 } },
          }}
          className="flex items-center justify-center flex-wrap"
          style={{ gap: '2.5rem' }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }}>
            <AnimatedStat value={6} label="Industries" />
          </motion.div>
          <div className="w-px h-8 bg-card-border hidden sm:block" />
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }}>
            <AnimatedStat value={100} label="Autonomous" suffix="%" />
          </motion.div>
          <div className="w-px h-8 bg-card-border hidden sm:block" />
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }}>
            <AnimatedStat value={0} label="Manual Labor" />
          </motion.div>
          <div className="w-px h-8 bg-card-border hidden sm:block" />
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }}>
            <AnimatedStat value={24} label="AI Operations" suffix="/7" />
          </motion.div>
        </motion.div>
      </div>

      <ScrollChevron />
    </section>
  )
}
