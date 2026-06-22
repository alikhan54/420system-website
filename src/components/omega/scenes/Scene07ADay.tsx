/** Scene 07 — A DAY. Time-scrub (12am→11pm) · sphere pulsing · 4 abstract gradient vignettes. */
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../../lib/gsapSetup'
import { useSceneActivation } from '../useSceneActivation'
import { COPY } from '../sceneCopy'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

const ENV_CLASS: Record<string, string> = {
  kitchen: 's-day-kitchen',
  office: 's-day-office',
  clinic: 's-day-clinic',
  site: 's-day-site',
}
// noon clinic is the bright vignette → dark text
const DARK_TEXT = new Set(['clinic'])

export default function Scene07ADay({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)
  const vignettes = COPY.day.vignettes

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const frames = gsap.utils.toArray<HTMLElement>('.s-day-frame', ref.current!)
        const tl = gsap.timeline({ paused: true })
        frames.forEach((f, i) => {
          if (i === 0) return
          tl.to(frames[i - 1], { opacity: 0, ease: 'none' }, i - 1)
          tl.to(f, { opacity: 1, ease: 'none' }, '<')
        })
        ScrollTrigger.create({
          trigger: ref.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => tl.progress(self.progress),
        })
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-scene={palette.dataScene}
      className="omega-scene relative h-screen overflow-hidden"
    >
      {vignettes.map((v, i) => {
        const dark = DARK_TEXT.has(v.env)
        return (
          <div
            key={v.time}
            className={`s-day-frame ${ENV_CLASS[v.env]} absolute inset-0`}
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <div className="absolute left-[8vw] bottom-[14vh] z-10 max-w-xl">
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(2.6rem, 1rem + 6vw, 6rem)',
                  letterSpacing: '-0.01em',
                  color: dark ? '#0C1016' : '#FFFFFF',
                  textShadow: dark ? 'none' : '0 2px 30px rgba(0,0,0,0.5)',
                }}
              >
                {v.time}
              </div>
              <p
                className="mt-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.3rem, 1rem + 1.5vw, 2.1rem)',
                  lineHeight: 1.25,
                  color: dark ? '#1A2230' : '#EAF0F4',
                  textShadow: dark ? 'none' : '0 1px 22px rgba(0,0,0,0.5)',
                  maxInlineSize: '24ch',
                }}
              >
                {v.line}
              </p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
