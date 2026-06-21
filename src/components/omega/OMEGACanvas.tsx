/**
 * OMEGACanvas.tsx — the shared R3F stage for the OMEGA orb.
 *
 * One <Canvas> (DESIGN_SYSTEM §6.6: never 11 contexts). Provides:
 *  - dpr clamp [1,2] + a SINGLE adaptive governor (drei PerformanceMonitor)
 *  - a loading state (overlay until first frame; Suspense for future async meshes)
 *  - `fixed` mode → full-viewport canvas behind the DOM (cinematic page)
 *  - `contained` mode → fills its parent box (test page)
 *
 * frameloop stays 'always' (the living sphere has continuous ambient motion);
 * reduced-motion is handled *inside* the orb (motion damped to ~0, gravity off),
 * keeping only subtle color crossfades — a parallel design, not a freeze.
 */
import { Suspense, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor, Html, useProgress } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { BRAND } from '../../config/brand'

/** Pick ONE governor — PerformanceMonitor (do NOT also mount <AdaptiveDpr/>). */
function AdaptiveQuality() {
  const setDpr = useThree((s) => s.setDpr)
  return (
    <PerformanceMonitor
      onIncline={() => setDpr(2)}
      onDecline={() => setDpr(1)}
      flipflops={3}
      onFallback={() => setDpr(1)}
    />
  )
}

/** drei in-canvas loader (shows if any future asset suspends). */
function CanvasLoader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.3em', color: '#6EE7FF', whiteSpace: 'nowrap' }}>
        {Math.round(progress)}%
      </div>
    </Html>
  )
}

export interface OMEGACanvasProps {
  children: ReactNode
  fixed?: boolean
  className?: string
}

export function OMEGACanvas({ children, fixed = false, className }: OMEGACanvasProps) {
  const [ready, setReady] = useState(false)

  const wrapStyle: React.CSSProperties = fixed
    ? { position: 'fixed', inset: 0, zIndex: -10, pointerEvents: 'none' }
    : { position: 'absolute', inset: 0 }

  return (
    <div style={wrapStyle} className={className}>
      <Canvas
        dpr={[1, 2]}
        frameloop="always"
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent', pointerEvents: fixed ? 'none' : 'auto' }}
        onCreated={() => setReady(true)}
      >
        <AdaptiveQuality />
        <Suspense fallback={<CanvasLoader />}>{children}</Suspense>
      </Canvas>

      {/* first-paint loader overlay — fades once the GL context is live */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          pointerEvents: 'none',
          opacity: ready ? 0 : 1,
          transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#6EE7FF', opacity: 0.7 }}>
          {BRAND.name} · initializing
        </span>
      </div>
    </div>
  )
}
