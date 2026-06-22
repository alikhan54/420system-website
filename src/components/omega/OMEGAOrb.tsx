/**
 * OMEGAOrb.tsx — the hypersensitive particle sphere (the OMEGA differentiation
 * anchor). Lives inside a <Canvas>. Built from the verified CODE_PATTERNS §R
 * reference: Fibonacci geometry (disposed), corrected gl_PointSize attenuation,
 * world-space mouse-gravity, scene-driven color lerp, breathing, simplex noise.
 *
 * Props:
 *  - particleCount  default 8000 desktop, auto-reduced to 4000 on mobile/touch
 *  - color          optional CSS hex; when set the orb is *controlled* (test page).
 *                   when omitted the orb reads the scene authority (cinematic page).
 *  - scale          overall scale multiplier (default 1)
 *  - distortion     0..1 turbulence amount (default 0.22)
 *  - reactive       enable mouse-gravity (default true; always off on touch)
 *  - state          'idle' | 'thinking' | 'speaking' — modulates behaviour
 *  - onClick        fires on orb click (also triggers a brightness ripple)
 */
import { useMemo, useRef, useEffect } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { ORB_VERT, ORB_FRAG, CORE_VERT, CORE_FRAG } from './orbShaders'
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

/** Fibonacci sphere geometry, memoized + disposed (raw geometry is not auto-disposed). */
function useParticleGeometry(count: number, radius = 2) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const targets = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const randoms = new Float32Array(count)
    const golden = Math.PI * (3 - Math.sqrt(5)) // golden angle ≈ 2.39996
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      const x = Math.cos(theta) * r * radius
      const z = Math.sin(theta) * r * radius
      positions[i * 3] = x
      positions[i * 3 + 1] = y * radius
      positions[i * 3 + 2] = z
      // no morph target yet (Phase 1) → target = position (uMorph stays ~0)
      targets[i * 3] = x
      targets[i * 3 + 1] = y * radius
      targets[i * 3 + 2] = z
      scales[i] = 0.5 + Math.random() * 1.5
      randoms[i] = Math.random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    g.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
    return g
  }, [count, radius])

  useEffect(() => () => geometry.dispose(), [geometry])
  return geometry
}

/** per-state behaviour targets (damped toward each frame) */
const STATE_TUNING: Record<OrbState, { speed: number; breath: number; freq: number; spin: number; ampBoost: number }> = {
  idle: { speed: 0.12, breath: 0.03, freq: 0.55, spin: 0.035, ampBoost: 0 },
  thinking: { speed: 0.4, breath: 0.05, freq: 0.85, spin: 0.13, ampBoost: 0.06 },
  speaking: { speed: 0.22, breath: 0.07, freq: 0.6, spin: 0.06, ampBoost: 0.02 },
}

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

  // capability tiers (DESIGN_SYSTEM §6.8) — auto-reduce + disable gravity on touch.
  const tier = useMemo(() => {
    const touch = typeof window !== 'undefined' && (matchMedia('(hover: none)').matches || 'ontouchstart' in window)
    const reduced = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    return { touch, reduced }
  }, [])
  const count = tier.touch ? Math.min(4000, particleCount) : particleCount
  const gravityOn = reactive && !tier.touch && !tier.reduced

  const geometry = useParticleGeometry(count, 2)
  const groupRef = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const mouseWorld = useRef(new THREE.Vector3())
  const targetColor = useRef(new THREE.Color())
  const ripple = useRef(0)
  const lastBlend = useRef<THREE.Blending>(THREE.AdditiveBlending)

  const initialColor = useMemo(
    () => (color ? new THREE.Color(color).convertSRGBToLinear() : THREE_COLORS[SCENE_SEQUENCE[0]].clone()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // ⚠ build uniforms ONCE (empty deps). Re-creating would disconnect useFrame.
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

  // separate uniforms for the inner core glow (color/intensity mirrored each frame).
  const coreUniforms = useMemo(
    () => ({ uColor: { value: initialColor.clone() }, uIntensity: { value: 1 }, uAlpha: { value: 0 } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((stThree, delta) => {
    const u = uniforms
    const t = stThree.clock.elapsedTime
    const d = Math.min(delta, 0.05) // clamp big tab-switch deltas
    u.uTime.value = t
    u.uScale.value = stThree.size.height * stThree.viewport.dpr

    // entrance: particle "assembly" alpha ramp 0→1 over ~1.4s
    u.uAlpha.value = THREE.MathUtils.damp(u.uAlpha.value, 1, 3, d)

    const tune = STATE_TUNING[state]
    const dist = Math.max(0, Math.min(1, distortion))
    // capped radial turbulence — bounded so the sphere never scatters apart; the bulk
    // of "distortion" is the COHERENT travelling surface wave (uWave) in the shader.
    const baseAmp = 0.03 + dist * 0.18
    u.uWave.value = THREE.MathUtils.damp(u.uWave.value, tier.reduced ? dist * 0.3 : dist, 4, d)

    // ---- mouse → world on z=0 plane; damped (hypersensitive yet smooth) ----
    if (gravityOn) {
      const px = pointer.x * (viewport.width / 2)
      const py = pointer.y * (viewport.height / 2)
      mouseWorld.current.lerp(new THREE.Vector3(px, py, 0), 1 - Math.exp(-8 * d))
    } else {
      mouseWorld.current.lerp(new THREE.Vector3(0, 0, 1000), 1 - Math.exp(-8 * d))
    }
    u.uMouse.value.copy(mouseWorld.current)

    // ---- color: controlled (prop) or scene authority ----
    let light = false
    if (color) {
      targetColor.current.set(color).convertSRGBToLinear()
    } else {
      const key = SCENE_SEQUENCE[Math.max(0, Math.min(sceneState.index, SCENE_SEQUENCE.length - 1))]
      targetColor.current.copy(THREE_COLORS[key])
      light = !!PALETTES[key].light
    }
    u.uColor.value.lerp(targetColor.current, 1 - Math.exp(-3 * d))

    // ---- light scene (White-Out): NormalBlending + dark particles (DESIGN_SYSTEM §6.5) ----
    const wantBlend = light ? THREE.NormalBlending : THREE.AdditiveBlending
    if (matRef.current && wantBlend !== lastBlend.current) {
      matRef.current.blending = wantBlend
      matRef.current.needsUpdate = true
      lastBlend.current = wantBlend
    }

    // ---- motion uniforms damped toward state targets ----
    u.uNoiseSpeed.value = THREE.MathUtils.damp(u.uNoiseSpeed.value, tier.reduced ? 0.01 : tune.speed, 4, d)
    u.uBreath.value = THREE.MathUtils.damp(u.uBreath.value, tier.reduced ? 0 : tune.breath, 4, d)
    u.uNoiseFreq.value = THREE.MathUtils.damp(u.uNoiseFreq.value, tune.freq, 4, d)
    u.uNoiseAmp.value = THREE.MathUtils.damp(u.uNoiseAmp.value, tier.reduced ? baseAmp * 0.3 : baseAmp + tune.ampBoost, 4, d)
    u.uMorph.value = THREE.MathUtils.damp(u.uMorph.value, sceneState.progress, 4, d)

    // ---- intensity: base + state + scene transition + click ripple ----
    ripple.current = THREE.MathUtils.damp(ripple.current, 0, 3, d)
    // decay the scene-cut transition energy (SceneShell sets it to 1 on each activate)
    sceneState.transitioning = THREE.MathUtils.damp(sceneState.transitioning, 0, 2.5, d)
    const speakPulse = state === 'speaking' ? Math.abs(Math.sin(t * 7)) * 0.45 : 0
    const stateGlow = state === 'thinking' ? 0.18 : 0
    u.uIntensity.value = 1 + stateGlow + speakPulse + sceneState.transitioning * 1.5 + ripple.current * 1.6

    // ---- inner core glow: mirrors the orb colour; hidden on the light White-Out scene
    // (additive glow over near-white would be invisible / muddy). ----
    coreUniforms.uColor.value.copy(u.uColor.value)
    coreUniforms.uAlpha.value = light ? 0 : u.uAlpha.value
    coreUniforms.uIntensity.value =
      0.85 + sceneState.transitioning * 0.8 + ripple.current * 0.6 + speakPulse * 0.5

    // ---- gentle scene-/state-driven rotation (group transform; gravity stays world-correct) ----
    if (groupRef.current && !tier.reduced) groupRef.current.rotation.y += tune.spin * d
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    ripple.current = 1
    onClick?.()
  }

  return (
    <group ref={groupRef} scale={scale}>
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
