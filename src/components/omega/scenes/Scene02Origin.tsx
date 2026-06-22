/** Scene 02 — ORIGIN. Ember · sphere contracts small upper-right · quote LEFT. */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../../lib/gsapSetup'
import { useSceneActivation } from '../useSceneActivation'
import { COPY } from '../sceneCopy'
import { Eyebrow } from '../sceneUi'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

export default function Scene02Origin({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.s-origin-rise', {
          yPercent: 30,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true },
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
      {/* asymmetric: text hugs the left, orb sits upper-right (orb directive) */}
      <div className="relative z-10 w-full max-w-[44rem] omega-inset">
        <Eyebrow className="s-origin-rise mb-8">{COPY.origin.eyebrow}</Eyebrow>
        <blockquote
          className="u-display s-origin-rise omega-legible"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 1rem + 2.4vw, 3.1rem)',
            lineHeight: 1.18,
            letterSpacing: '-0.015em',
            color: '#F1E4D6',
          }}
        >
          {COPY.origin.quote}
        </blockquote>
        <p className="u-kicker s-origin-rise mt-8" style={{ color: 'var(--scene-accent)' }}>
          {COPY.origin.attribution}
        </p>
      </div>
    </section>
  )
}
