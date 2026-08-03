/**
 * VideosPage — the public film hub at /videos and /videos/<slug>.
 *
 * One manifest (src/data/films.ts) drives everything. The page only ever reads
 * `publicFilms()` / `publicCollections()`, so a film that has not passed a
 * recorded leak scan cannot render here (PUBLIC-ELIGIBILITY LAW — see films.ts).
 *
 * Layout is inline-styled on purpose. The project's global UNLAYERED
 * `* { margin:0; padding:0 }` reset (index.css:31-35) beats Tailwind's layered
 * spacing utilities site-wide; the OMEGA pages only work because index.css
 * re-asserts a specific whitelist under html[data-omega]. Rather than depend on
 * that whitelist, this page styles layout directly and uses the cascade only for
 * hover/focus states, scoped under `.vh-` so nothing can leak to another route.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BRAND } from '../config/brand'
import {
  collectionBySlug,
  formatDuration,
  publicCollectionsByKind,
  publicFilms,
  type Film,
} from '../data/films'

const INK = '#05060A'
const SURFACE = '#0C0F18'
const TEXT = '#C7CBD6'
const MUTED = '#7C8496'
const HAIRLINE = 'rgba(255,255,255,0.09)'

interface Props {
  /** Slug from /videos/<slug>, or null at /videos. */
  slug: string | null
}

export default function VideosPage({ slug }: Props) {
  const collection = slug ? collectionBySlug(slug) : undefined
  /** A slug we don't recognise falls back to the full hub — never an empty page. */
  const unknownSlug = Boolean(slug) && !collection

  const films = useMemo<Film[]>(
    () => (collection ? collection.films() : publicFilms()),
    [collection],
  )

  const [activeId, setActiveId] = useState(() => films[0]?.id ?? '')
  const active = films.find((f) => f.id === activeId) ?? films[0]
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  /** Only autoplay on an explicit user pick, never on first paint. */
  const shouldPlay = useRef(false)

  useEffect(() => {
    const title = collection
      ? `${collection.label} — ${BRAND.name} films`
      : `${BRAND.name} — see it run`
    const prev = document.title
    document.title = title
    document.documentElement.dataset.omega = '1'
    return () => {
      document.title = prev
      delete document.documentElement.dataset.omega
    }
  }, [collection])

  // Swap the source when the pick changes, then play (user-initiated only).
  useEffect(() => {
    const el = videoRef.current
    if (!el || !shouldPlay.current) return
    shouldPlay.current = false
    el.load()
    void el.play().catch(() => { /* autoplay blocked — poster + controls remain */ })
  }, [activeId])

  const pick = useCallback((id: string) => {
    shouldPlay.current = true
    setActiveId(id)
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  if (!active) {
    // Structurally unreachable while any film is public, but never render a broken page.
    return (
      <main style={{ minHeight: '100vh', background: INK, color: TEXT, display: 'grid', placeItems: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sans-omega)' }}>No films are published yet.</p>
      </main>
    )
  }

  const rest = films.filter((f) => f.id !== active.id)
  const typeCollections = publicCollectionsByKind('type')
  const industryCollections = publicCollectionsByKind('industry')
  const departmentCollections = publicCollectionsByKind('department')

  return (
    <main
      className="vh-root"
      style={{
        minHeight: '100vh',
        background: INK,
        color: TEXT,
        fontFamily: 'var(--font-sans-omega)',
        // The accent follows whichever film is on the stage.
        ['--vh-accent' as string]: active.accent,
      }}
    >
      <style>{CSS}</style>

      {/* ── header ─────────────────────────────────────────────────────── */}
      <header
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem', padding: 'clamp(0.75rem, 2.5vw, 1.5rem) clamp(1.25rem, 5vw, 4rem)',
          borderBottom: `1px solid ${HAIRLINE}`,
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(5,6,10,0.82)', backdropFilter: 'blur(14px)',
        }}
      >
        <a href="/" className="vh-brand" style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
            {BRAND.name}
          </span>
          <span className="vh-kicker" style={{ color: MUTED }}>films</span>
        </a>
        <a href={BRAND.app} className="vh-cta vh-cta--sm">Talk to {BRAND.name}</a>
      </header>

      {/* ── stage ──────────────────────────────────────────────────────── */}
      <section ref={stageRef} style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 4rem) 0', maxWidth: 1440, margin: '0 auto' }}>
        <p className="vh-kicker" style={{ color: 'var(--vh-accent)' }}>
          {collection ? collection.label : 'The films'}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 600,
            fontSize: 'clamp(2.25rem, 1.4rem + 3.4vw, 4.5rem)',
            lineHeight: 0.98, letterSpacing: '-0.035em',
            margin: '0.75rem 0 0', color: '#fff', maxWidth: '18ch',
          }}
        >
          {collection ? collection.blurb : 'Watch it actually run.'}
        </h1>
        <p style={{ margin: '1.1rem 0 0', maxWidth: '58ch', fontSize: '1.0625rem', lineHeight: 1.6, color: MUTED }}>
          {collection?.slug === 'founder-story'
            ? `The founder, on camera — not a screen recording, but nothing staged either.`
            : collection
              ? `Recorded from the live product — nothing staged, nothing mocked up.`
              : `Every film below is a screen recording of the real system doing real work. No mockups, no fake dashboards.`}
        </p>

        {unknownSlug && (
          <p
            style={{
              margin: '1.5rem 0 0', padding: '0.85rem 1.1rem', maxWidth: '62ch',
              fontSize: '0.9375rem', lineHeight: 1.55, color: TEXT,
              background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12,
            }}
          >
            We don't have a film cut for that yet — here's the full library instead.
          </p>
        )}

        {/* player — vertical cuts get a phone-width frame instead of stretching to full bleed */}
        <div
          style={{
            marginTop: 'clamp(1.75rem, 3vw, 2.75rem)',
            borderRadius: 18, overflow: 'hidden',
            border: `1px solid ${HAIRLINE}`,
            background: '#000',
            boxShadow: `0 40px 120px -40px color-mix(in oklab, var(--vh-accent) 45%, transparent)`,
            maxWidth: active.aspect === '9:16' ? 420 : undefined,
            marginLeft: active.aspect === '9:16' ? 'auto' : undefined,
            marginRight: active.aspect === '9:16' ? 'auto' : undefined,
          }}
        >
          <video
            ref={videoRef}
            key={active.id}
            poster={active.poster}
            controls
            playsInline
            preload="metadata"
            style={{
              display: 'block', width: '100%',
              aspectRatio: active.aspect === '9:16' ? '9 / 16' : '16 / 9',
              background: '#000',
            }}
          >
            <source src={active.src} type="video/mp4" />
            Your browser can't play this video.{' '}
            <a href={active.src} style={{ color: 'var(--vh-accent)' }}>Download it instead.</a>
          </video>
        </div>

        {/* now-playing meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.5rem 1rem', marginTop: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
            {active.title}
          </h2>
          <span className="vh-kicker" style={{ color: MUTED }}>{formatDuration(active.durationS)}</span>
          {active.srcVertical && (
            <a className="vh-quiet" href={active.srcVertical}>vertical cut ↓</a>
          )}
        </div>
        <p style={{ margin: '0.5rem 0 0', maxWidth: '62ch', color: MUTED, lineHeight: 1.6 }}>{active.blurb}</p>
      </section>

      {/* ── grid ───────────────────────────────────────────────────────── */}
      {rest.length > 0 && (
        <section style={{ padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.25rem, 5vw, 4rem) 0', maxWidth: 1440, margin: '0 auto' }}>
          <h2 className="vh-kicker" style={{ color: MUTED, marginBottom: '1.25rem' }}>
            {collection ? 'More in this set' : 'The full library'}
          </h2>
          <ul
            style={{
              listStyle: 'none', display: 'grid', gap: 'clamp(1rem, 2vw, 1.5rem)',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              margin: 0, padding: 0,
            }}
          >
            {rest.map((film) => (
              <li key={film.id}>
                <button
                  type="button"
                  className="vh-card"
                  onClick={() => pick(film.id)}
                  style={{ ['--vh-card-accent' as string]: film.accent }}
                  aria-label={`Play ${film.title} — ${formatDuration(film.durationS)}`}
                >
                  <span className="vh-thumb" style={{ aspectRatio: film.aspect === '9:16' ? '9 / 16' : '16 / 9' }}>
                    {/* Eager, deliberately: the whole library is ~1.1MB of posters and
                        they ARE this page's primary content. loading="lazy" also proved
                        unreliable here — the requests never fired even in-viewport. */}
                    <img
                      src={film.poster} alt="" decoding="async"
                      width={film.aspect === '9:16' ? 1080 : 1920}
                      height={film.aspect === '9:16' ? 1920 : 1080}
                    />
                    <span className="vh-play" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                    <span className="vh-dur">{formatDuration(film.durationS)}</span>
                  </span>
                  <span className="vh-meta">
                    <span className="vh-title">{film.title}</span>
                    <span className="vh-line">{film.line}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── filterable library: three independent axes, each its own row ── */}
      <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 5vw, 4rem) 0', maxWidth: 1440, margin: '0 auto' }}>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.75rem' }}>
          <a href="/videos" className="vh-chip" aria-current={!collection ? 'page' : undefined}>Everything</a>
        </nav>

        {typeCollections.length > 0 && (
          <>
            <h2 className="vh-kicker" style={{ color: MUTED, marginBottom: '0.75rem' }}>Type</h2>
            <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.75rem' }}>
              {typeCollections.map((c) => (
                <a key={c.slug} href={`/videos/${c.slug}`} className="vh-chip" aria-current={collection?.slug === c.slug ? 'page' : undefined}>
                  {c.label}
                </a>
              ))}
            </nav>
          </>
        )}

        {industryCollections.length > 0 && (
          <>
            <h2 className="vh-kicker" style={{ color: MUTED, marginBottom: '0.75rem' }}>Industry</h2>
            <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.75rem' }}>
              {industryCollections.map((c) => (
                <a key={c.slug} href={`/videos/${c.slug}`} className="vh-chip" aria-current={collection?.slug === c.slug ? 'page' : undefined}>
                  {c.label}
                </a>
              ))}
            </nav>
          </>
        )}

        {departmentCollections.length > 0 && (
          <>
            <h2 className="vh-kicker" style={{ color: MUTED, marginBottom: '0.75rem' }}>Department</h2>
            <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {departmentCollections.map((c) => (
                <a key={c.slug} href={`/videos/${c.slug}`} className="vh-chip" aria-current={collection?.slug === c.slug ? 'page' : undefined}>
                  {c.label}
                </a>
              ))}
            </nav>
          </>
        )}
      </section>

      {/* ── cta ────────────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1.25rem, 5vw, 4rem)', maxWidth: 1440, margin: '0 auto' }}>
        <div
          style={{
            borderRadius: 20, padding: 'clamp(2rem, 4vw, 3.5rem)',
            border: `1px solid ${HAIRLINE}`, background: SURFACE,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 'clamp(1.75rem, 1.2rem + 2vw, 3rem)',
              letterSpacing: '-0.03em', lineHeight: 1.02, color: '#fff', margin: 0, maxWidth: '16ch',
            }}
          >
            Seen enough? Go talk to it.
          </h2>
          <p style={{ margin: '0.9rem 0 1.75rem', maxWidth: '52ch', color: MUTED, lineHeight: 1.6 }}>
            {BRAND.tagline}
          </p>
          <a href={BRAND.app} className="vh-cta">Talk to {BRAND.name}</a>
        </div>
      </section>

      {/* ── footer ─────────────────────────────────────────────────────── */}
      <footer
        style={{
          padding: '2rem clamp(1.25rem, 5vw, 4rem) 3rem',
          borderTop: `1px solid ${HAIRLINE}`, maxWidth: 1440, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.5rem', alignItems: 'center',
          fontSize: '0.875rem', color: MUTED,
        }}
      >
        <a href="/" className="vh-quiet">← {BRAND.domain}</a>
        <span>Filmed on {BRAND.name}'s own demo workspace.</span>
      </footer>
    </main>
  )
}

const CSS = `
.vh-root ::selection { background: var(--vh-accent); color: #05060A; }
/* Bare links inherit body colour. SPECIFICITY TRAP: a plain ".vh-root a" is
   (0,1,1) and would BEAT single-class rules like .vh-cta (0,1,0), making the
   CTA render light-on-accent instead of dark-on-accent. The :not([class])
   guard keeps this rule from matching any classed component at all. */
.vh-root a:not([class]) { color: inherit; }
.vh-root *:focus-visible {
  outline: 2px solid var(--vh-accent);
  outline-offset: 3px;
  border-radius: 6px;
}
.vh-kicker {
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase;
  margin: 0;
}
.vh-brand:hover span:first-child { color: var(--vh-accent); }
.vh-brand span:first-child { transition: color 200ms var(--ease-power3-out, ease); }

/* CTA */
.vh-cta {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.85rem 1.6rem; border-radius: 999px;
  background: var(--vh-accent); color: #05060A;
  font-weight: 600; font-size: 0.9375rem; text-decoration: none;
  transition: transform 200ms var(--ease-power3-out, ease), filter 200ms ease;
  white-space: nowrap;
}
.vh-cta--sm { padding: 0.55rem 1.1rem; font-size: 0.8125rem; }
.vh-cta:hover { transform: translateY(-2px); filter: brightness(1.08); }

.vh-quiet {
  font-size: 0.8125rem; color: #7C8496; text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.18); padding-bottom: 1px;
  transition: color 180ms ease, border-color 180ms ease;
}
.vh-quiet:hover { color: var(--vh-accent); border-color: var(--vh-accent); }

/* chips */
.vh-chip {
  display: inline-flex; align-items: center; padding: 0.5rem 0.95rem;
  border-radius: 999px; border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.02); color: #C7CBD6;
  font-size: 0.875rem; text-decoration: none;
  transition: border-color 180ms ease, color 180ms ease, background 180ms ease;
}
.vh-chip:hover { border-color: var(--vh-accent); color: #fff; }
.vh-chip[aria-current="page"] {
  border-color: var(--vh-accent); color: #05060A; background: var(--vh-accent); font-weight: 600;
}

/* cards */
.vh-card {
  display: block; width: 100%; text-align: left; cursor: pointer;
  background: none; border: 0; padding: 0; color: inherit; font: inherit;
}
.vh-thumb {
  display: block; position: relative; overflow: hidden;
  border-radius: 14px; border: 1px solid rgba(255,255,255,0.09);
  background: #000; aspect-ratio: 16 / 9;
}
.vh-thumb img {
  display: block; width: 100%; height: 100%; object-fit: cover;
  transition: transform 500ms var(--ease-power3-out, ease), opacity 300ms ease;
}
.vh-card:hover .vh-thumb { border-color: var(--vh-card-accent); }
.vh-card:hover .vh-thumb img { transform: scale(1.035); }

.vh-play {
  position: absolute; inset: auto auto 0.7rem 0.7rem;
  display: grid; place-items: center; width: 36px; height: 36px;
  border-radius: 999px; background: rgba(5,6,10,0.72); color: #fff;
  backdrop-filter: blur(8px); opacity: 0;
  transform: translateY(4px);
  transition: opacity 220ms ease, transform 220ms var(--ease-power3-out, ease), background 220ms ease;
}
.vh-card:hover .vh-play, .vh-card:focus-visible .vh-play { opacity: 1; transform: none; }
.vh-card:hover .vh-play { background: var(--vh-card-accent); color: #05060A; }

.vh-dur {
  position: absolute; inset: auto 0.7rem 0.7rem auto;
  padding: 0.2rem 0.45rem; border-radius: 6px;
  background: rgba(5,6,10,0.72); backdrop-filter: blur(8px);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.6875rem; letter-spacing: 0.04em; color: #C7CBD6;
}

.vh-meta { display: block; padding-top: 0.85rem; }
.vh-title {
  display: block; font-family: var(--font-display); font-size: 1.0625rem;
  font-weight: 600; letter-spacing: -0.015em; color: #fff;
}
.vh-line { display: block; margin-top: 0.2rem; font-size: 0.9375rem; color: #7C8496; line-height: 1.45; }
.vh-card:hover .vh-title { color: var(--vh-card-accent); }
.vh-title { transition: color 200ms ease; }

@media (prefers-reduced-motion: reduce) {
  .vh-root *, .vh-root *::before, .vh-root *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
  .vh-card:hover .vh-thumb img { transform: none; }
}
`
