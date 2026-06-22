/** Scene 03 — MIRROR. Wine-red anxiety · orb HIDDEN · lines fall in from above. */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../../lib/gsapSetup'
import { useSceneActivation } from '../useSceneActivation'
import { COPY } from '../sceneCopy'
import { Eyebrow } from '../sceneUi'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

export default function Scene03Mirror({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.s-mirror-line', {
          y: -90,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.28,
          scrollTrigger: { trigger: ref.current, start: 'top 60%', once: true },
        })
        gsap.from('.s-mirror-close', {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 30%', once: true },
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
        <Eyebrow className="mb-12" color="var(--scene-accent)">
          {COPY.mirror.eyebrow}
        </Eyebrow>
        <div className="space-y-7">
          {COPY.mirror.lines.map((line) => (
            <p
              key={line}
              className="s-mirror-line u-display"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 1rem + 1.9vw, 2.4rem)',
                lineHeight: 1.25,
                color: '#E8C5CC',
              }}
            >
              {line}
            </p>
          ))}
        </div>
        <p
          className="s-mirror-close mt-16"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.9rem, 1rem + 3.2vw, 3.6rem)',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
          }}
        >
          You don't have a tool problem.
          <br />
          <span style={{ color: 'var(--scene-accent)' }}>You have a coordination problem.</span>
        </p>
      </div>
    </section>
  )
}
