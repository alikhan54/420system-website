/** Scene 05 — FOUR BRAINS. Neural mesh · pin · 4 dept callouts light as the orb hue lands. */
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../../lib/gsapSetup'
import { useSceneActivation } from '../useSceneActivation'
import { sceneState } from '../../../lib/sceneState'
import { COPY } from '../sceneCopy'
import { Eyebrow } from '../sceneUi'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

export default function Scene05FourBrains({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)
  const depts = COPY.brains.depts

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const rows = gsap.utils.toArray<HTMLElement>('.s-brain-row', ref.current!)
        ScrollTrigger.create({
          trigger: ref.current,
          start: 'top top',
          end: '+=320%',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: () => {
            const active = Math.min(rows.length - 1, Math.floor(Math.max(0, sceneState.progress) * rows.length))
            rows.forEach((r, i) => gsap.set(r, { opacity: i === active ? 1 : 0.26, x: i === active ? 0 : -10 }))
          },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-scene={palette.dataScene}
      className="omega-scene relative h-screen overflow-hidden flex items-center"
    >
      <div className="relative z-10 w-full max-w-[40rem] pl-[8vw] pr-6">
        <Eyebrow className="mb-10">{COPY.brains.eyebrow}</Eyebrow>
        <div className="space-y-8">
          {depts.map((d) => (
            <div key={d.key} className="s-brain-row">
              <div className="flex items-baseline gap-4">
                <span
                  aria-hidden
                  style={{ width: 10, height: 10, borderRadius: 999, background: d.hue, boxShadow: `0 0 16px ${d.hue}`, flex: 'none' }}
                />
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.6rem, 1rem + 2.2vw, 2.8rem)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: d.hue,
                  }}
                >
                  {d.label}
                </h3>
              </div>
              <p className="u-body omega-legible mt-2 pl-[26px]" style={{ color: '#CFE0E6', maxInlineSize: '40ch' }}>
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
