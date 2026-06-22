/** Scene 04 — SHIFT. Cool blue · sphere re-forms from scatter · horizontal-pin, 3 panels. */
import { useMemo, useRef } from 'react'
import { gsap, useGSAP } from '../../../lib/gsapSetup'
import { useSceneActivation } from '../useSceneActivation'
import { COPY } from '../sceneCopy'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

export default function Scene04Shift({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)
  const panels = useMemo(() => COPY.shift.panels, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = ref.current!.querySelector('.s-shift-track') as HTMLElement
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            pin: true,
            scrub: 1,
            end: () => '+=' + (track.scrollWidth - window.innerWidth),
            snap: panels.length > 1 ? 1 / (panels.length - 1) : undefined,
            invalidateOnRefresh: true,
          },
        })
      })
    },
    { scope: ref, dependencies: [panels.length] },
  )

  return (
    <section
      ref={ref}
      data-scene={palette.dataScene}
      className="omega-scene s-shift-section relative h-screen overflow-hidden"
    >
      <div className="s-shift-track flex h-full w-max">
        {panels.map((p, i) => (
          <div key={i} className="s-shift-panel w-screen h-full grid place-items-center px-[9vw]">
            <div className="relative z-10 max-w-4xl">
              <p className="u-kicker mb-6" style={{ color: 'var(--scene-accent)', opacity: 0.7 }}>
                {String(i + 1).padStart(2, '0')} / {String(panels.length).padStart(2, '0')}
              </p>
              <h2
                className="omega-legible"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: i === panels.length - 1 ? 'clamp(2.4rem, 1rem + 5vw, 6rem)' : 'clamp(2rem, 1rem + 3.4vw, 4.4rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                  color: i === panels.length - 1 ? '#FFFFFF' : '#D6E2F2',
                }}
              >
                {i === panels.length - 1 ? (
                  <>
                    That's not software.
                    <br />
                    <span style={{ color: 'var(--scene-accent)' }}>That's a mind.</span>
                  </>
                ) : (
                  p
                )}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
