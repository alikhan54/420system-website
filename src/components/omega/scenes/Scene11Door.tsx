/** Scene 11 — DOOR. Aurora teal night · sphere dollies up to fill screen · CTA in the orb's center + footer. */
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../../lib/gsapSetup'
import { useSceneActivation } from '../useSceneActivation'
import { COPY } from '../sceneCopy'
import { Eyebrow, OmegaCTA } from '../sceneUi'
import { BRAND } from '../../../config/brand'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

export default function Scene11Door({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cta = ref.current!.querySelector('.s-door-cta') as HTMLElement
        const clamp = gsap.utils.clamp(0, 1)
        ScrollTrigger.create({
          trigger: '.s-door-stage',
          start: 'top top',
          end: '+=180%',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const o = clamp((self.progress - 0.22) / 0.45)
            gsap.set(cta, { opacity: o, y: (1 - o) * 26 })
          },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} data-scene={palette.dataScene} className="omega-scene relative">
      {/* pinned dolly stage — the CTA materializes in the orb's center as it scales up */}
      <div className="s-door-stage relative h-screen grid place-items-center text-center px-6 overflow-hidden">
        <div className="s-door-cta relative z-10 max-w-2xl mx-auto">
          <Eyebrow className="mb-6">{COPY.door.eyebrow}</Eyebrow>
          <h2
            className="omega-legible"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 1rem + 5vw, 5.5rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1,
              color: '#EAFBF6',
            }}
          >
            {COPY.door.headline}
          </h2>
          <p className="u-body omega-legible mx-auto mt-6" style={{ color: '#C7E0D8', maxInlineSize: '40ch' }}>
            {COPY.door.sub}
          </p>
          <div className="mt-9 flex justify-center">
            <OmegaCTA label={COPY.door.cta} center />
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="relative z-10 px-[8vw] py-12 flex flex-wrap items-center justify-between gap-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-5">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '-0.02em', color: '#EAFBF6' }}>{BRAND.name}</span>
          <span className="u-kicker" style={{ color: 'var(--scene-accent)', opacity: 0.8 }}>{COPY.door.builtIn}</span>
        </div>
        <div className="flex items-center gap-6">
          {COPY.door.footerLinks.map((l) => (
            <a key={l} href={BRAND.url} target="_blank" rel="noreferrer" className="u-kicker" style={{ color: '#9FC4BA', textDecoration: 'none' }}>
              {l}
            </a>
          ))}
        </div>
      </footer>
    </section>
  )
}
