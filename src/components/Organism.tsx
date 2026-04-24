import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'

const nodes = [
  { label: 'Sales', color: '#00F0FF', angle: 0, speed: 0.4, radius: 2.0 },
  { label: 'Marketing', color: '#0ACF83', angle: Math.PI * 0.5, speed: 0.3, radius: 2.4 },
  { label: 'HR', color: '#7B61FF', angle: Math.PI, speed: 0.35, radius: 2.0 },
  { label: 'Ops', color: '#00F0FF', angle: Math.PI * 1.5, speed: 0.28, radius: 2.4 },
]

function Core() {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.y = t * 0.3
      const s = 1 + Math.sin(t * 2) * 0.1
      ref.current.scale.set(s, s, s)
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.15
      glowRef.current.scale.set(s, s, s)
    }
  })
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.8} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshBasicMaterial color="#0ACF83" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

function OrbitNode({
  node, phaseOffset, onHover, hovered,
}: { node: typeof nodes[0]; phaseOffset: number; onHover: (label: string | null) => void; hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const lineRef = useRef<THREE.Line>(null)

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
    return g
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const angle = phaseOffset + t * node.speed
    const x = Math.cos(angle) * node.radius
    const z = Math.sin(angle) * node.radius
    const y = Math.sin(angle * 2) * 0.3

    if (groupRef.current) groupRef.current.position.set(x, y, z)
    if (sphereRef.current) {
      const target = hovered ? 1.5 : 1
      sphereRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1)
    }
    if (lineRef.current && lineRef.current.geometry.attributes.position) {
      const posAttr = lineRef.current.geometry.attributes.position as THREE.BufferAttribute
      posAttr.setXYZ(0, 0, 0, 0)
      posAttr.setXYZ(1, x, y, z)
      posAttr.needsUpdate = true
      const mat = lineRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.15 + Math.sin(t * 3 + phaseOffset) * 0.1 + (hovered ? 0.2 : 0)
    }
  })

  return (
    <>
      <primitive
        object={new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: node.color, transparent: true, opacity: 0.15 }))}
        ref={lineRef}
      />
      <group
        ref={groupRef}
        onPointerOver={(e) => { e.stopPropagation(); onHover(node.label); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { onHover(null); document.body.style.cursor = 'auto' }}
      >
        <mesh ref={sphereRef}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color={node.color} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </>
  )
}

function OrbitalScene() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 400, aspectRatio: '1' }}>
      <Canvas camera={{ position: [0, 1.5, 5.5], fov: 55 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <Core />
        {nodes.map((node) => (
          <OrbitNode
            key={node.label}
            node={node}
            phaseOffset={node.angle}
            onHover={setHovered}
            hovered={hovered === node.label}
          />
        ))}
      </Canvas>
      <div className="absolute inset-0 pointer-events-none">
        {nodes.map((node, i) => {
          const anglePos = [
            { top: '15%', right: '10%' },
            { bottom: '15%', right: '10%' },
            { bottom: '15%', left: '10%' },
            { top: '15%', left: '10%' },
          ][i]
          const active = hovered === node.label
          return (
            <div
              key={node.label}
              className="absolute text-xs font-mono transition-all duration-300"
              style={{
                ...anglePos,
                color: node.color,
                opacity: active ? 1 : 0.5,
                textShadow: active ? `0 0 12px ${node.color}` : 'none',
                letterSpacing: '0.1em',
              }}
            >
              {node.label.toUpperCase()}
            </div>
          )
        })}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="text-[10px] font-mono font-bold text-cyan tracking-[0.2em]"
          style={{ textShadow: '0 0 10px #00F0FF', transform: 'translateY(60px)' }}
        >
          CORE
        </div>
      </div>
    </div>
  )
}

export default function Organism() {
  const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

  return (
    <section id="how-it-works" className="relative" style={{ zIndex: 2, padding: '8rem 0' }}>
      {/* Drawing line at top */}
      <motion.div
        className="absolute top-0 left-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(10,207,131,0.6), rgba(0,240,255,0.6), transparent)',
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0, width: '100%' }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      <div className="max-w-[1200px] mx-auto" style={{ paddingLeft: 'max(2rem, 5vw)', paddingRight: 'max(2rem, 5vw)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ paddingLeft: '0.5rem' }}
          >
            <span className="text-[11px] font-mono tracking-[0.3em] text-emerald uppercase mb-4 block">
              // The Architecture
            </span>
            <h2
              className="font-[800] leading-[1.1] mb-6 text-text"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}
            >
              A living organism,
              <br />
              <span className="gradient-text">not a tool collection.</span>
            </h2>
            <p
              className="leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: '560px' }}
            >
              Traditional SaaS forces you to connect dozens of disconnected tools. The 420
              System is a unified intelligence — every module shares context, learns from
              every interaction, and autonomously coordinates across departments. It
              doesn't just automate tasks. It thinks, adapts, and evolves.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <OrbitalScene />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
