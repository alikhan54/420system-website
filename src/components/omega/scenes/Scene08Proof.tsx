/** Scene 08 — PROOF. White flip (hard cut) · dark-particle sphere upper-right · big stat blocks. */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../../lib/gsapSetup'
import { useSceneActivation } from '../useSceneActivation'
import { COPY } from '../sceneCopy'
import { Eyebrow } from '../sceneUi'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

export default function Scene08Proof({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.s-proof-stat', {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.16,
          scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true },
        })
        // gentle parallax drift on the numbers
        gsap.to('.s-proof-num', {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-scene={palette.dataScene}
      className="omega-scene relative min-h-screen flex items-center"
    >
      <div className="relative z-10 w-full max-w-[46rem] omega-inset py-24">
        <Eyebrow className="mb-5" color="#0A6E62">
          {COPY.proof.eyebrow}
        </Eyebrow>
        <h2
          className="mb-14"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 1rem + 5.5vw, 6rem)',
            letterSpacing: '-0.025em',
            lineHeight: 0.98,
            color: '#0C1016',
          }}
        >
          {COPY.proof.headline}
        </h2>

        <div className="space-y-10">
          {COPY.proof.stats.map((s) => (
            <div key={s.unit} className="s-proof-stat border-t pt-6" style={{ borderColor: 'rgba(12,16,22,0.14)' }}>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  className="s-proof-num"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.6rem, 1rem + 5vw, 5rem)',
                    letterSpacing: '-0.03em',
                    lineHeight: 0.9,
                    color: '#0C1016',
                  }}
                >
                  {s.value}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 1rem + 0.8vw, 1.6rem)', color: '#0A6E62' }}>
                  {s.unit}
                </span>
              </div>
              <p className="u-body mt-2" style={{ color: '#3C4654', maxInlineSize: '40ch' }}>
                {s.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
