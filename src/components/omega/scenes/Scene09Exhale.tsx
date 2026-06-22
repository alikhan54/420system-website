/** Scene 09 — EXHALE. Pale aurora teal · sphere slow breathing · generous space, each line its own fade. */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../../lib/gsapSetup'
import { useSceneActivation } from '../useSceneActivation'
import { COPY } from '../sceneCopy'
import { Eyebrow } from '../sceneUi'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

export default function Scene09Exhale({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.s-exhale-line', ref.current!).forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 26,
            duration: 1.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          })
        })
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-scene={palette.dataScene}
      className="omega-scene relative grid place-items-center text-center px-6 py-[22vh]"
      style={{ minHeight: '150vh' }}
    >
      <div className="relative z-10 max-w-2xl mx-auto">
        <Eyebrow className="s-exhale-line mb-16">{COPY.exhale.eyebrow}</Eyebrow>
        <div className="space-y-[12vh]">
          {COPY.exhale.lines.map((line) => (
            <p
              key={line}
              className="s-exhale-line omega-legible"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 1rem + 2.4vw, 3rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.015em',
                color: '#DDEBE6',
              }}
            >
              {line}
            </p>
          ))}
          <p
            className="s-exhale-line"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 1rem + 3.6vw, 4rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: 'var(--scene-accent)',
            }}
          >
            That's not productivity software.
            <br />
            That's freedom.
          </p>
        </div>
      </div>
    </section>
  )
}
