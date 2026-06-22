/** Scene 01 — MEET. Deep-space ink · perfect sphere · title in the orb's center. */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../../lib/gsapSetup'
import { useSceneActivation } from '../useSceneActivation'
import { COPY } from '../sceneCopy'
import { Eyebrow, OmegaCTA } from '../sceneUi'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

export default function Scene01Meet({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.s-meet-rise', {
          yPercent: 60,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-scene={palette.dataScene}
      className="omega-scene relative min-h-screen grid place-items-center text-center px-6"
    >
      <div className="relative z-10 max-w-3xl mx-auto">
        <Eyebrow className="s-meet-rise mb-6">{COPY.meet.eyebrow}</Eyebrow>
        <h1 className="u-h1 omega-legible s-meet-rise" style={{ fontSize: 'clamp(2.75rem, 1rem + 6.5vw, 6rem)', color: '#EAF0F4' }}>
          {COPY.meet.h1}
          <br />
          <span style={{ color: 'var(--scene-accent)' }}>{COPY.meet.h2}</span>
        </h1>
        <p className="u-body s-meet-rise omega-legible mx-auto mt-8" style={{ color: '#C7CBD6', maxInlineSize: '52ch' }}>
          {COPY.meet.sub}
        </p>
        <div className="s-meet-rise mt-10 flex justify-center">
          <OmegaCTA label={COPY.meet.cta} center />
        </div>
      </div>
    </section>
  )
}
