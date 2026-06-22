/** Scene 06 — LIVE FEED. Terminal green · directed streams · 3 tilted streaming columns. */
import { useMemo, useRef } from 'react'
import { useSceneActivation } from '../useSceneActivation'
import { COPY, FEED_LINES } from '../sceneCopy'
import { Eyebrow } from '../sceneUi'
import { PALETTES } from '../../../design/scenePalette'
import type { SceneProps } from './types'

const CAT_HUE: Record<string, string> = {
  SALES: '#2DD4BF',
  MARKETING: '#38BDF8',
  HR: '#A78BFA',
  OPS: '#FBBF24',
}

export default function Scene06LiveFeed({ scene, onActivate }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]
  useSceneActivation(ref, scene, onActivate)

  // split the ~40 lines into 3 columns
  const cols = useMemo(() => {
    const c: (typeof FEED_LINES)[] = [[], [], []]
    FEED_LINES.forEach((l, i) => c[i % 3].push(l))
    return c
  }, [])
  const durs = ['26s', '32s', '29s']

  return (
    <section
      ref={ref}
      data-scene={palette.dataScene}
      className="omega-scene relative h-screen overflow-hidden grid place-items-center"
    >
      {/* tilted multi-stream field behind the header */}
      <div className="s-feed-stage" aria-hidden>
        {cols.map((col, ci) => (
          <div key={ci} className="s-feed-col">
            <div className="s-feed-marquee" style={{ ['--feed-dur' as string]: durs[ci] }}>
              {[...col, ...col].map((l, i) => (
                <div key={i} className="s-feed-item">
                  <span style={{ color: CAT_HUE[l.cat] }}>[{l.cat}]</span>{' '}
                  <span style={{ color: '#9FE6BE' }}>{l.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* header */}
      <div className="relative z-10 text-center px-6">
        <Eyebrow className="mb-5">{COPY.feed.eyebrow}</Eyebrow>
        <h2
          className="omega-legible"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 1rem + 4.4vw, 5rem)',
            letterSpacing: '-0.02em',
            color: '#EAFBF1',
          }}
        >
          {COPY.feed.headline}
        </h2>
      </div>

      {/* caption */}
      <p className="u-kicker absolute bottom-8 left-1/2 -translate-x-1/2 z-10" style={{ color: '#7FC9A0', opacity: 0.7 }}>
        {COPY.feed.caption}
      </p>
    </section>
  )
}
