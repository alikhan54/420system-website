/**
 * OMEGAOrb.tsx — the hypersensitive particle sphere (the OMEGA differentiation
 * anchor) AND the per-scene morphing entity. Lives inside a <Canvas>.
 *
 * Phase 2: ONE persistent particle system that smoothly transforms between four
 * named shapes (sphere · neural-mesh · directed-streams · scatter) as the story
 * scrolls — `mix(aMorphA, aMorphB, uMorph)` in the shader, both buffers sharing
 * the sphere's index ordering so every particle travels 1:1. It also reads its
 * scale / position / visibility / spin / hue per scene from SCENE_ORB.
 *
 * Props:
 *  - color       optional CSS hex; when set the orb is *controlled* (test page) —
 *                a static sphere, no scene morphing/directives.
 *  - distortion  0..1 turbulence amount (test page slider)
 *  - state       'idle' | 'thinking' | 'speaking' — modulates motion (test page)
 */
import { useMemo, useRef, useEffect } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { ORB_VERT, ORB_FRAG, CORE_VERT, CORE_FRAG } from './orbShaders'
import { buildMorphShapes, type MorphShapes, type MorphKey } from './morphShapes'
import { SCENE_ORB, DEPT_COLORS, orbForScene } from './orbDirectives'
import { sceneState } from '../../lib/sceneState'
import { THREE_COLORS, SCENE_SEQUENCE, PALETTES } from '../../design/scenePalette'

export type OrbState = 'idle' | 'thinking' | 'speaking'

export interface OMEGAOrbProps {
  particleCount?: number
  color?: string
  scale?: number
  distortion?: number
  reactive?: boolean
  state?: OrbState
  onClick?: () => void
}

const ORB_RADIUS = 2

/** Fibonacci sphere + the four morph shape buffers, memoized + disposed. */
function useParticleGeometry(count: number, radius = ORB_RADIUS) {
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const randoms = new Float32Array(count)
    const golden = Math.PI * (3 - Math.sqrt(5)) // golden angle ≈ 2.39996
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      positions[i * 3] = Math.cos(theta) * r * radius
      positions[i * 3 + 1] = y * radius
      positions[i * 3 + 2] = Math.sin(theta) * r * radius
      scales[i] = 0.5 + Math.random() * 1.5
      randoms[i] = Math.random()
    }
    const shapes = buildMorphShapes(count, radius, positions)

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    // morph A/B start as the sphere (own copies → independently mutable each scene)
    g.setAttribute('aMorphA', new THREE.BufferAttribute(Float32Array.from(positions), 3))
    g.setAttribute('aMorphB', new THREE.BufferAttribute(Float32Array.from(positions), 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    g.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
    return { geometry: g, shapes }
  }, [count, radius])

  useEffect(() => () => data.geometry.dispose(), [data])
  return data
}

/** per-state behaviour targets (test page only) */
const STATE_TUNING: Record<OrbState, { speed: number; breath: number; freq: number; spin: number; ampBoost: number }> = {
  idle: { speed: 0.12, breath: 0.03, freq: 0.55, spin: 0.035, ampBoost: 0 },
  thinking: { speed: 0.4, breath: 0.05, freq: 0.85, spin: 0.13, ampBoost: 0.06 },
  speaking: { speed: 0.22, breath: 0.07, freq: 0.6, spin: 0.06, ampBoost: 0.02 },
}

const damp = THREE.MathUtils.damp

export function OMEGAOrb({
  particleCount = 8000,
  color,
  scale = 1,
  distortion = 0.22,
  reactive = true,
  state = 'idle',
  onClick,
}: OMEGAOrbProps) {
  const { size, viewport, pointer } = useThree()

  const tier = useMemo(() => {
    const touch = typeof window !== 'undefined' && (matchMedia('(hover: none)').matches || 'ontouchstart' in window)
    const reduced = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    return { touch, reduced }
  }, [])
  const count = tier.touch ? Math.min(4000, particleCount) : particleCount
  const gravityOn = reactive && !tier.touch && !tier.reduced

  const { geometry, shapes } = useParticleGeometry(count)
  const groupRef = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const mouseWorld = useRef(new THREE.Vector3())
  const targetColor = useRef(new THREE.Color())
  const ripple = useRef(0)
  const lastBlend = useRef<THREE.Blending>(THREE.AdditiveBlending)

  // orb-directive damping refs (the persistent transform state)
  const morphIndex = useRef(-1)
  const orbScale = useRef(color ? scale : SCENE_ORB[0].scale)
  const orbPos = useRef(new THREE.Vector3())
  const dirAlpha = useRef(color ? 1 : SCENE_ORB[0].alpha)
  const spin = useRef(color ? STATE_TUNING[state].spin : SCENE_ORB[0].spin)
  const entrance = useRef(0)

  const initialColor = useMemo(
    () => (color ? new THREE.Color(color).convertSRGBToLinear() : THREE_COLORS[SCENE_SEQUENCE[0]].clone()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 0.045 },
      uScale: { value: size.height * viewport.dpr },
      uMorph: { value: 0 },
      uBreath: { value: 0.03 },
      uNoiseAmp: { value: 0.16 },
      uNoiseFreq: { value: 0.55 },
      uNoiseSpeed: { value: 0.12 },
      uWave: { value: 0 },
      uMouse: { value: new THREE.Vector3() },
      uMouseRadius: { value: 1.6 },
      uMouseStrength: { value: tier.reduced ? 0 : 0.6 },
      uColor: { value: initialColor.clone() },
      uIntensity: { value: 1 },
      uAlpha: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const coreUniforms = useMemo(
    () => ({ uColor: { value: initialColor.clone() }, uIntensity: { value: 1 }, uAlpha: { value: 0 } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  /** swap the morph buffers: aMorphA ← current (or an explicit `from`), aMorphB ← `to`. */
  function applyMorph(to: MorphKey, from?: MorphKey) {
    const aA = geometry.getAttribute('aMorphA') as THREE.BufferAttribute
    const aB = geometry.getAttribute('aMorphB') as THREE.BufferAttribute
    const arrA = aA.array as Float32Array
    const arrB = aB.array as Float32Array
    const cur = uniforms.uMorph.value
    const src: MorphShapes = shapes
    if (from) {
      arrA.set(src[from])
    } else {
      // freeze the current interpolated positions → no snap on rapid scene flips
      for (let i = 0; i < arrA.length; i++) arrA[i] = arrA[i] + (arrB[i] - arrA[i]) * cur
    }
    arrB.set(src[to])
    aA.needsUpdate = true
    aB.needsUpdate = true
    uniforms.uMorph.value = 0
  }

  useFrame((stThree, delta) => {
    const u = uniforms
    const t = stThree.clock.elapsedTime
    const d = Math.min(delta, 0.05)
    u.uTime.value = t
    u.uScale.value = stThree.size.height * stThree.viewport.dpr
    entrance.current = damp(entrance.current, 1, 3, d)

    const tune = STATE_TUNING[state]
    const dist = Math.max(0, Math.min(1, distortion))
    const baseAmp = 0.03 + dist * 0.18
    u.uWave.value = damp(u.uWave.value, tier.reduced ? dist * 0.3 : dist, 4, d)

    // ---- mouse → world on z=0 plane; damped (hypersensitive yet smooth) ----
    if (gravityOn) {
      const px = pointer.x * (viewport.width / 2)
      const py = pointer.y * (viewport.height / 2)
      mouseWorld.current.lerp(new THREE.Vector3(px, py, 0), 1 - Math.exp(-8 * d))
    } else {
      mouseWorld.current.lerp(new THREE.Vector3(0, 0, 1000), 1 - Math.exp(-8 * d))
    }
    u.uMouse.value.copy(mouseWorld.current)

    // ---- per-scene orb directives (skipped on the controlled test page) ----
    let dirIntensity = 1
    let light = false
    if (color) {
      targetColor.current.set(color).convertSRGBToLinear()
      orbScale.current = damp(orbScale.current, scale, 4, d)
      spin.current = tune.spin
    } else {
      const idx = Math.max(0, Math.min(sceneState.index, SCENE_ORB.length - 1))
      const dir = orbForScene(idx)
      if (morphIndex.current !== idx) {
        applyMorph(dir.morphTo, dir.morphFrom)
        morphIndex.current = idx
      }
      // morph completion: by-progress (assemble) or auto-complete; reduced → instant
      const morphTarget = dir.morphByProgress ? Math.max(0, Math.min(1, sceneState.progress)) : 1
      u.uMorph.value = tier.reduced ? morphTarget : damp(u.uMorph.value, morphTarget, 3, d)

      const dolly = dir.dolly && !tier.reduced ? Math.max(0, sceneState.progress) * 4.2 : 0
      orbScale.current = damp(orbScale.current, dir.scale + dolly, 4, d)
      orbPos.current.x = damp(orbPos.current.x, dir.x, 5, d)
      orbPos.current.y = damp(orbPos.current.y, dir.y, 5, d)
      dirAlpha.current = damp(dirAlpha.current, dir.alpha, 5, d)
      spin.current = damp(spin.current, dir.spin, 3, d)
      dirIntensity = dir.intensity

      if (dir.colorCycle) {
        // cycle teal→ocean→indigo→amber across this scene's progress
        const p = Math.max(0, Math.min(1, sceneState.progress)) * (DEPT_COLORS.length - 1)
        const seg = Math.min(DEPT_COLORS.length - 2, Math.floor(p))
        targetColor.current.copy(DEPT_COLORS[seg]).lerp(DEPT_COLORS[seg + 1], p - seg)
      } else {
        const key = SCENE_SEQUENCE[idx]
        targetColor.current.copy(THREE_COLORS[key])
        light = !!PALETTES[key].light
      }
    }
    u.uColor.value.lerp(targetColor.current, 1 - Math.exp(-3 * d))

    // ---- light scene (White-Out / CHOICE): NormalBlending + dark particles ----
    const wantBlend = light ? THREE.NormalBlending : THREE.AdditiveBlending
    if (matRef.current && wantBlend !== lastBlend.current) {
      matRef.current.blending = wantBlend
      matRef.current.needsUpdate = true
      lastBlend.current = wantBlend
    }

    // ---- motion uniforms damped toward state targets ----
    u.uNoiseSpeed.value = damp(u.uNoiseSpeed.value, tier.reduced ? 0.01 : tune.speed, 4, d)
    u.uBreath.value = damp(u.uBreath.value, tier.reduced ? 0 : tune.breath, 4, d)
    u.uNoiseFreq.value = damp(u.uNoiseFreq.value, tune.freq, 4, d)
    u.uNoiseAmp.value = damp(u.uNoiseAmp.value, tier.reduced ? baseAmp * 0.3 : baseAmp + tune.ampBoost, 4, d)

    // ---- master alpha = entrance ramp × scene visibility ----
    u.uAlpha.value = entrance.current * dirAlpha.current

    // ---- intensity: scene dim × (base + state + transition + click ripple) ----
    ripple.current = damp(ripple.current, 0, 3, d)
    sceneState.transitioning = damp(sceneState.transitioning, 0, 2.5, d)
    const speakPulse = state === 'speaking' ? Math.abs(Math.sin(t * 7)) * 0.45 : 0
    const stateGlow = state === 'thinking' ? 0.18 : 0
    u.uIntensity.value = dirIntensity * (1 + stateGlow + speakPulse + sceneState.transitioning * 1.5 + ripple.current * 1.6)

    // ---- inner core glow (hidden on light scenes + when the orb is hidden) ----
    coreUniforms.uColor.value.copy(u.uColor.value)
    coreUniforms.uAlpha.value = light ? 0 : u.uAlpha.value
    coreUniforms.uIntensity.value =
      dirIntensity * (0.85 + sceneState.transitioning * 0.8 + ripple.current * 0.6 + speakPulse * 0.5)

    // ---- apply the persistent transform ----
    if (groupRef.current) {
      groupRef.current.scale.setScalar(orbScale.current)
      groupRef.current.position.set(orbPos.current.x, orbPos.current.y, 0)
      if (!tier.reduced) groupRef.current.rotation.y += spin.current * d
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    ripple.current = 1
    onClick?.()
  }

  return (
    <group ref={groupRef}>
      {/* inner core glow — an internal light source so the field reads as a lit volume */}
      <mesh frustumCulled={false}>
        <sphereGeometry args={[1.15, 48, 48]} />
        <shaderMaterial
          vertexShader={CORE_VERT}
          fragmentShader={CORE_FRAG}
          uniforms={coreUniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={matRef}
          vertexShader={ORB_VERT}
          fragmentShader={ORB_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* invisible hit sphere — reliable click target (points raycasting is finicky) */}
      <mesh onPointerDown={handleClick} scale={2.35}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
