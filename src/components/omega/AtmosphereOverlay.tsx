/**
 * AtmosphereOverlay.tsx — the "escape the dark template" texture stack, all
 * reading the scene CSS vars so they shift per atmosphere for free:
 *   - crossfading background (var(--scene-bg))   z -20  (behind the fixed canvas)
 *   - gradient-mesh aurora (var(--scene-accent)) z  -5  (glow over particles)
 *   - film grain (real feTurbulence rect)        z   0  (above canvas, below content)
 *   - vignette → scene-bg (never black)          z   0
 *   - scroll progress bar                         z  50
 *
 * Note: the research's grain snippet used `background-image:url(#filter)` which
 * does not actually apply an SVG filter — fixed here with a filtered <rect>.
 */
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsapSetup'

function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    // gate under reduced-motion (the base CSS !important transition rule cannot stop
    // a JS transform write, so the gate must live here, mirroring SceneShell).
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          // absolute scroll-position recipe — bulletproof page progress (a
          // documentElement 'bottom bottom' trigger mismeasures the end here).
          scrollTrigger: {
            start: 0,
            end: () => ScrollTrigger.maxScroll(window),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    })
  })
  return (
    <div
      ref={bar}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 3,
        width: '100%',
        transformOrigin: 'left center',
        transform: 'scaleX(0)',
        background: 'var(--scene-accent)',
        boxShadow: '0 0 12px var(--scene-glow)',
        zIndex: 50,
      }}
    />
  )
}

export function AtmosphereOverlay() {
  return (
    <>
      {/* crossfading background (the CSS transition on html[data-omega] smooths it) */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: -20, background: 'var(--scene-bg)' }} />

      {/* Dawn "the gradient is the hero" layer — opacity-crossfaded in on the dawn scene */}
      <div className="omega-dawn-layer" aria-hidden />

      {/* gradient-mesh aurora */}
      <div className="omega-aurora" aria-hidden />

      {/* film grain — a filtered rect actually renders the noise */}
      <svg
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ width: '100%', height: '100%', opacity: 0.06, mixBlendMode: 'overlay' }}
      >
        <filter id="omega-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#omega-grain)" />
      </svg>

      {/* vignette — edge color = scene-bg, NOT black */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'radial-gradient(120% 120% at 50% 50%, transparent 55%, var(--scene-bg) 100%)' }}
      />

      <ProgressBar />
    </>
  )
}
