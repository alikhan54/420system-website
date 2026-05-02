import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../utils/animations'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

const nodes = [
  { label: 'Sales', color: '#00D4AA', angle: 0, speed: 0.4, radius: 2.0 },
  { label: 'Marketing', color: '#00B4D8', angle: Math.PI * 0.5, speed: 0.3, radius: 2.4 },
  { label: 'HR', color: '#6366F1', angle: Math.PI, speed: 0.35, radius: 2.0 },
  { label: 'Ops', color: '#00D4AA', angle: Math.PI * 1.5, speed: 0.28, radius: 2.4 },
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
        <meshBasicMaterial color="#00D4AA" wireframe transparent opacity={0.85} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial color="#00D4AA" transparent opacity={0.18} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.85, 24, 24]} />
        <meshBasicMaterial color="#00B4D8" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

function OrbitNode({
  node, phaseOffset, onHover, hovered,
}: { node: typeof nodes[0]; phaseOffset: number; onHover: (l: string | null) => void; hovered: boolean }) {
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
      mat.opacity = 0.18 + Math.sin(t * 3 + phaseOffset) * 0.1 + (hovered ? 0.2 : 0)
    }
  })

  return (
    <>
      <primitive
        object={new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({ color: node.color, transparent: true, opacity: 0.18 })
        )}
        ref={lineRef}
      />
      <group
        ref={groupRef}
        onPointerOver={(e) => { e.stopPropagation(); onHover(node.label); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { onHover(null); document.body.style.cursor = 'auto' }}
      >
        <mesh ref={sphereRef}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial color={node.color} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.22} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </>
  )
}

function OrbitalScene() {
  const [hovered, setHovered] = useState<string | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480, margin: '0 auto', aspectRatio: '1' }}>
      {/* Radial glow BEHIND canvas — creates depth */}
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(0,212,170,0.07) 0%, rgba(0,180,216,0.03) 40%, transparent 70%)',
          filter: 'blur(20px)',
          zIndex: 0,
        }}
      />
      <Canvas camera={{ position: [0, 1.5, 6] }} dpr={[1, 1.5]} style={{ position: 'relative', zIndex: 1 }}>
        <Environment preset="night" />
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00D4AA" />
        <pointLight position={[-5, -3, 2]} intensity={0.5} color="#00B4D8" />

        <Float speed={reducedMotion ? 0 : 1.5} floatIntensity={reducedMotion ? 0 : 0.4} rotationIntensity={0.3}>
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
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>

      {/* CSS labels on top */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {nodes.map((node, i) => {
          const pos = [
            { top: '12%', right: '10%' },
            { bottom: '12%', right: '10%' },
            { bottom: '12%', left: '10%' },
            { top: '12%', left: '10%' },
          ][i]
          const active = hovered === node.label
          return (
            <div
              key={node.label}
              style={{
                position: 'absolute',
                ...pos,
                fontSize: '0.65rem',
                fontFamily: 'monospace',
                letterSpacing: '0.18em',
                color: node.color,
                opacity: active ? 1 : 0.45,
                textShadow: active ? `0 0 14px ${node.color}` : 'none',
                transition: 'opacity 0.3s ease, text-shadow 0.3s ease',
              }}
            >
              {node.label.toUpperCase()}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Solution() {
  return (
    <section
      id="how-it-works"
      style={{
        background: '#050505',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '6rem 0',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Drawing line at top */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 1,
          width: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(0,180,216,0.4), transparent)',
          transformOrigin: 'left',
          pointerEvents: 'none',
          zIndex: 5,
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 45fr) minmax(0, 55fr)',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'center',
        }}
        className="solution-grid"
      >
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#00D4AA',
              marginBottom: '1rem',
              display: 'block',
            }}
          >
            // How It Works
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: '#F0F0F5',
              marginBottom: '1.5rem',
            }}
          >
            A living organism,
            <br />
            <span style={{ color: '#00D4AA' }}>not a tool collection.</span>
          </h2>
          <p style={{ color: '#8A8F98', lineHeight: 1.8, maxWidth: 420, margin: 0 }}>
            Every module shares context, learns from every interaction, and autonomously
            coordinates across departments. It thinks, adapts, and evolves.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <OrbitalScene />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .solution-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
