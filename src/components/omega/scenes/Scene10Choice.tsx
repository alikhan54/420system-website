/** Scene 10 — CHOICE. Clean white · small orb top · 3 pricing cards, middle highlighted. */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../../lib/gsapSetup'
import { useSceneActivation } from '../useSceneActivation'
import { COPY } from '../sceneCopy'
import { Eyebrow } from '../sceneUi'
import { BRAND } from '../../../config/brand'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

export default function Scene10Choice({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.s-choice-card', {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: 'top 60%', once: true },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-scene={palette.dataScene}
      className="omega-scene relative min-h-screen flex flex-col justify-center px-6 py-28"
    >
      <div className="relative z-10 text-center mb-14 mt-[8vh]">
        <Eyebrow className="mb-4" color="#0D9488">
          {COPY.choice.eyebrow}
        </Eyebrow>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 1rem + 3.6vw, 4rem)',
            letterSpacing: '-0.025em',
            color: '#0C1016',
          }}
        >
          {COPY.choice.headline}
        </h2>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto grid gap-6 md:grid-cols-3 items-stretch">
        {COPY.choice.tiers.map((t) => (
          <div
            key={t.name}
            className="s-choice-card flex flex-col rounded-3xl p-7"
            style={{
              background: t.popular ? '#0C1016' : '#FFFFFF',
              color: t.popular ? '#EAF0F4' : '#0C1016',
              border: `1px solid ${t.popular ? '#0C1016' : 'rgba(12,16,22,0.12)'}`,
              boxShadow: t.popular ? '0 30px 80px -30px rgba(13,148,136,0.55)' : '0 12px 40px -24px rgba(12,16,22,0.25)',
              transform: t.popular ? 'translateY(-10px)' : 'none',
            }}
          >
            {t.popular && (
              <span className="u-kicker self-start mb-4 px-3 py-1 rounded-full" style={{ background: '#14B8A6', color: '#04140F' }}>
                Most Popular
              </span>
            )}
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>{t.name}</h3>
            <p className="u-kicker mt-1" style={{ color: t.popular ? '#7FD9CC' : '#0D9488' }}>
              {t.for}
            </p>
            <div className="mt-5 flex items-baseline gap-1">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', letterSpacing: '-0.03em' }}>{t.price}</span>
              <span className="u-kicker" style={{ opacity: 0.6 }}>{t.cadence}</span>
            </div>
            <ul className="mt-6 space-y-3 grow">
              {t.features.map((f) => (
                <li key={f} className="u-body flex gap-2" style={{ fontSize: '0.95rem', color: t.popular ? '#C7D2D0' : '#3C4654' }}>
                  <span style={{ color: '#14B8A6' }}>—</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={BRAND.url}
              target="_blank"
              rel="noreferrer"
              className="mt-7 text-center rounded-full py-3"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                letterSpacing: '0.06em',
                textDecoration: 'none',
                background: t.popular ? '#14B8A6' : 'transparent',
                color: t.popular ? '#04140F' : '#0D9488',
                border: t.popular ? 'none' : '1px solid rgba(13,148,136,0.4)',
              }}
            >
              Start free
            </a>
          </div>
        ))}
      </div>

      <p className="u-kicker text-center mt-10 relative z-10" style={{ color: '#5C6573' }}>
        {COPY.choice.note}
      </p>
    </section>
  )
}
