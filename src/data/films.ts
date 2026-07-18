/**
 * films.ts — the ONE manifest behind /videos and /videos/<slug>.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PUBLIC-ELIGIBILITY LAW (operator directive 2026-07-18, LOCKED, RETROACTIVE)
 *
 *   Only films shot on an approved FICTIONAL demo tenant (Veyra Robotics,
 *   Aurelia Estates, Cedarcrest, Ember & Oak, Northlight) — or on ZATE itself —
 *   may be published to a public, unauthenticated surface.
 *
 *   Any film showing a REAL client name is internal-only, retroactively,
 *   regardless of finish state. That covers BBQ Tonight, BSH, MNT Halan,
 *   Dubai Sports City, Marhama, Cosmique, Smart Ledger, Tend and the rest of
 *   the pre-2026-07-04 library — roughly 90% by volume of E:\video-library.
 *
 *   `isPublic` therefore DEFAULTS TO FALSE and is set true only after a
 *   leak scan for real-client names has passed and is recorded in `leakScan`.
 *   The page renders `publicFilms()` and nothing else, so an unreviewed film is
 *   structurally incapable of reaching a public page — not merely undisplayed.
 *
 *   Source of truth for the law: work/dept-film-suite/DEMO_TENANT_RULES.md
 *   Recon + blast radius:        work/video-hub/PHASE0_RECON.md
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Media lives in the public Supabase `media` bucket under our OWN `hub/` prefix
 * (CLIENT-ACTIVATION owns `academy/*` — untouched). Origin is a single constant
 * so re-pointing it later is a one-line change and never touches a component.
 */

const CDN = 'https://fncfbywkemsxwuiowxxe.supabase.co/storage/v1/object/public/media/hub'

export interface Film {
  id: string
  /** Card title. */
  title: string
  /** The film's own on-screen line — its title card, verbatim. */
  line: string
  /** One honest sentence about what you actually see. */
  blurb: string
  durationS: number
  /** Sampled from the film's own title card, so the UI inherits its palette. */
  accent: string
  /** Drives /videos/<slug>. A slug with no public film simply has no page. */
  tags: string[]
  /** Provenance — which demo tenant was on screen. Required by the law above. */
  tenant: string
  /** DEFAULT FALSE. Only a recorded leak scan may flip this. */
  isPublic: boolean
  leakScan?: string
  src: string
  poster: string
  /** 9:16 cut, where one exists. */
  srcVertical?: string
}

/** Every film we know about. Public or not — the filter is `isPublic`. */
const FILMS: Film[] = [
  {
    id: 'apex',
    title: 'APEX',
    line: 'You built a company. Now it runs itself.',
    blurb:
      'The flagship. One company, one day, six departments — and the intelligence running underneath all of it.',
    durationS: 73.6,
    accent: '#6EE7FF',
    tags: ['flagship'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/apex.mp4`,
    poster: `${CDN}/poster/apex.jpg`,
    srcVertical: `${CDN}/video/apex-9x16.mp4`,
  },
  {
    id: 'platform',
    title: 'One Intelligence',
    line: 'Six departments. One intelligence.',
    blurb:
      'How the departments stop being separate tools and start behaving as a single system.',
    durationS: 79.3,
    accent: '#A78BFA',
    tags: ['flagship'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/platform.mp4`,
    poster: `${CDN}/poster/platform.jpg`,
    srcVertical: `${CDN}/video/platform-9x16.mp4`,
  },
  {
    id: 'sales',
    title: 'Sales',
    line: 'It works your whole pipeline.',
    blurb: 'Scores every lead, writes the follow-up, and fires at the right time — while nothing goes cold.',
    durationS: 73.3,
    accent: '#0C6C50',
    tags: ['department', 'sales'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/sales.mp4`,
    poster: `${CDN}/poster/sales.jpg`,
  },
  {
    id: 'marketing',
    title: 'Marketing',
    line: 'It runs your whole brand.',
    blurb: 'Plans, writes and publishes on-brand — every post, every channel, while you sleep.',
    durationS: 66.5,
    accent: '#C81E5D',
    tags: ['department', 'marketing'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/marketing.mp4`,
    poster: `${CDN}/poster/marketing.jpg`,
  },
  {
    id: 'communications',
    title: 'Communications',
    line: 'It reads. It replies.',
    blurb: 'Every channel in one inbox — WhatsApp, email, voice and SMS — answered in seconds.',
    durationS: 66.4,
    accent: '#B55308',
    tags: ['department', 'communications'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/communications.mp4`,
    poster: `${CDN}/poster/communications.jpg`,
  },
  {
    id: 'operations',
    title: 'Operations',
    line: 'It watches every shelf.',
    blurb: 'Inventory, supply chain and reorder points — caught before anything runs out.',
    durationS: 66.4,
    accent: '#34617E',
    tags: ['department', 'operations'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/operations.mp4`,
    poster: `${CDN}/poster/operations.jpg`,
  },
  {
    id: 'finance',
    title: 'Finance',
    line: 'It reconciles every cent.',
    blurb: 'Cash position, receivables and collections — reconciled continuously, not at month end.',
    durationS: 66.6,
    accent: '#D2AF37',
    tags: ['department', 'finance'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/finance.mp4`,
    poster: `${CDN}/poster/finance.jpg`,
  },
  {
    id: 'people',
    title: 'People',
    line: 'It finds the right people.',
    blurb: 'Sources, screens and ranks every candidate — and keeps the pipeline warm.',
    durationS: 66.5,
    accent: '#167A72',
    tags: ['department', 'people', 'hr'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/people.mp4`,
    poster: `${CDN}/poster/people.jpg`,
  },
  {
    id: 'liv-meet',
    title: 'Meet the Organization Brain',
    line: 'This is my team.',
    blurb:
      'The live constellation — every lead, customer and conversation as one breathing map. Recorded from the real page, not rebuilt.',
    durationS: 62.1,
    accent: '#67E8F9',
    tags: ['living'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/liv-meet.mp4`,
    poster: `${CDN}/poster/liv-meet.jpg`,
  },
  {
    id: 'liv-work',
    title: 'Watch It Work',
    line: 'Launch a campaign.',
    blurb: 'One instruction, and the brain lights up across departments to carry it out.',
    durationS: 48.8,
    accent: '#A78BFA',
    tags: ['living'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/liv-work.mp4`,
    poster: `${CDN}/poster/liv-work.jpg`,
  },
  {
    id: 'cinema-reel',
    title: 'The Reel',
    line: 'OMEGA, in twenty seconds.',
    blurb: 'The short cut — if you only have twenty seconds, watch this one.',
    durationS: 22.1,
    accent: '#6EE7FF',
    tags: ['flagship'],
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/cinema-reel.mp4`,
    poster: `${CDN}/poster/cinema-reel.jpg`,
  },

  // ── Held back. Real films, deliberately not public. Do NOT flip without the operator. ──
  // Vertical films (real_estate on Aurelia Estates, hospital on Cedarcrest) are consent-clean
  // but carry open flags: the RE trilogy ships with placeholder music pending a swap, and
  // HLT_SHOW_V3's look was superseded in V4 with its audio remux awaiting a founder listen.
  // The whole pre-2026-07-04 client library (BBQ, BSH, MNT Halan, DSC, Marhama, Cosmique,
  // Smart Ledger, Tend) is permanently internal under the law at the top of this file and is
  // therefore not listed here at all.
]

/** THE ONLY accessor a public page may use. Enforces the law in code. */
export function publicFilms(): Film[] {
  return FILMS.filter((f) => f.isPublic)
}

export function filmById(id: string): Film | undefined {
  return publicFilms().find((f) => f.id === id)
}

/** Films carrying a tag — public only, by construction. */
export function filmsByTag(tag: string): Film[] {
  return publicFilms().filter((f) => f.tags.includes(tag))
}

export interface Collection {
  slug: string
  label: string
  blurb: string
  tag: string
}

/**
 * /videos/<slug>. A collection only renders if it has at least one PUBLIC film —
 * so a slug never becomes an empty page making a promise we can't keep.
 *
 * Department slugs are live today. Industry slugs (real-estate, hospital,
 * restaurant, …) intentionally have no entry yet: their films are either held
 * or, in the restaurant case, were never cut on a fictional tenant. They get
 * added here the moment a film clears — the page machinery already supports it.
 */
const COLLECTIONS: Collection[] = [
  { slug: 'sales',          label: 'Sales',          blurb: 'How OMEGA works a pipeline end to end.',        tag: 'sales' },
  { slug: 'marketing',      label: 'Marketing',      blurb: 'How OMEGA runs a brand end to end.',            tag: 'marketing' },
  { slug: 'communications', label: 'Communications', blurb: 'Every channel, one inbox, answered.',           tag: 'communications' },
  { slug: 'operations',     label: 'Operations',     blurb: 'Stock, supply chain and the things that slip.', tag: 'operations' },
  { slug: 'finance',        label: 'Finance',        blurb: 'Cash, receivables and continuous reconciliation.', tag: 'finance' },
  { slug: 'people',         label: 'People',         blurb: 'Sourcing, screening and ranking, continuously.', tag: 'people' },
  { slug: 'flagship',       label: 'The Flagship',   blurb: 'The full OMEGA story.',                          tag: 'flagship' },
  { slug: 'living',         label: 'The Living System', blurb: 'The organization brain, recorded live.',      tag: 'living' },
]

/** Only collections that actually have a public film behind them. */
export function publicCollections(): Collection[] {
  return COLLECTIONS.filter((c) => filmsByTag(c.tag).length > 0)
}

export function collectionBySlug(slug: string): Collection | undefined {
  return publicCollections().find((c) => c.slug === slug)
}

export function formatDuration(seconds: number): string {
  // floor, not round — matches how the native player renders the same file
  // (73.63s shows as 1:13, not 1:14).
  const total = Math.floor(seconds)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
