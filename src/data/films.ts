/**
 * films.ts — the ONE manifest behind /videos, /videos/<type>, /videos/<industry>
 * and the legacy per-department /videos/<department> pages.
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
 *   It also covers a small set of government-ministry pitch assets that are
 *   not listed anywhere in this file, by name or otherwise — those stay
 *   private pitch material for their intended recipients only, permanently.
 *
 *   `isPublic` therefore DEFAULTS TO FALSE and is set true only after a
 *   leak scan for real-client names has passed and is recorded in `leakScan`.
 *   The page renders `publicFilms()` and nothing else, so an unreviewed film is
 *   structurally incapable of reaching a public page — not merely undisplayed.
 *
 *   Source of truth for the law: work/dept-film-suite/DEMO_TENANT_RULES.md
 *   Recon + blast radius:        work/video-hub/PHASE0_RECON.md
 *   2026-08-04 taxonomy pass:    work/video-hub/PHASE1_TAXONOMY.md
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Media lives in the public Supabase `media` bucket under our OWN `hub/` prefix
 * (CLIENT-ACTIVATION owns `academy/*` — untouched). Origin is a single constant
 * so re-pointing it later is a one-line change and never touches a component.
 */

const CDN = 'https://fncfbywkemsxwuiowxxe.supabase.co/storage/v1/object/public/media/hub'

/** TYPE — what kind of film this is. Every public film has exactly one. */
export type FilmType =
  | 'flagship-ads'
  | 'founder-story'
  | 'how-to'
  | 'explainers'
  | 'department-films'
  | 'industry-films'

/** INDUSTRY — which business this film shows OMEGA running. Every public film has exactly one. */
export type Industry =
  | 'healthcare'
  | 'government'
  | 'restaurant-hospitality'
  | 'retail'
  | 'finance'
  | 'real-estate'
  | 'construction'
  | 'tech'

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
  /** Drives the legacy per-department /videos/<slug> pages. */
  tags: string[]
  /** Required taxonomy — see FilmType above. */
  type: FilmType
  /** Required taxonomy — see Industry above. */
  industry: Industry
  /** Provenance — which demo tenant (or ZATE itself) was on screen. Required by the law above. */
  tenant: string
  /** DEFAULT FALSE. Only a recorded leak scan may flip this. */
  isPublic: boolean
  leakScan?: string
  src: string
  poster: string
  /** 9:16 cut, where one exists as a SEPARATE download alongside a 16:9 primary. */
  srcVertical?: string
  /** Native aspect ratio of `src` itself. Omit for the default 16:9. */
  aspect?: '16:9' | '9:16'
}

/** Every film we know about. Public or not — the filter is `isPublic`. */
const FILMS: Film[] = [
  // ── Founder story — featured first: the human entry point. ──
  {
    id: 'founder',
    title: 'Why I Built OMEGA',
    line: "Five or six tools. That don't talk.",
    blurb: 'The founder, on the actual problem OMEGA exists to fix — shot vertical, meant to be watched on a phone.',
    durationS: 49.0,
    accent: '#8B7CF6',
    tags: [],
    type: 'founder-story',
    industry: 'tech',
    tenant: 'ZATE Systems (founder)',
    isPublic: true,
    leakScan: '2026-08-04 — frame review (6 samples across the runtime), zero real-client names, zero other-company material',
    src: `${CDN}/video/founder-omega.mp4`,
    poster: `${CDN}/poster/founder-omega.jpg`,
    aspect: '9:16',
  },

  {
    id: 'apex',
    title: 'APEX',
    line: 'You built a company. Now it runs itself.',
    blurb:
      'The flagship. One company, one day, six departments — and the intelligence running underneath all of it.',
    durationS: 73.6,
    accent: '#6EE7FF',
    tags: ['flagship'],
    type: 'flagship-ads',
    industry: 'tech',
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
    blurb: 'How the departments stop being separate tools and start behaving as a single system.',
    durationS: 79.3,
    accent: '#A78BFA',
    tags: ['flagship'],
    type: 'flagship-ads',
    industry: 'tech',
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/platform.mp4`,
    poster: `${CDN}/poster/platform.jpg`,
    srcVertical: `${CDN}/video/platform-9x16.mp4`,
  },
  {
    id: 'investor-vision',
    title: 'Investor Vision',
    line: 'Every company is about to run an AI workforce.',
    blurb: "ZATE's own pitch for OMEGA — built the same way every client film is: real screens, real product, nothing staged.",
    durationS: 101.9,
    accent: '#A78BFA',
    tags: ['flagship'],
    type: 'flagship-ads',
    industry: 'tech',
    tenant: 'ZATE Systems (own content, illustrated on the Aurelia Estates + Veyra Robotics fictional demos)',
    isPublic: true,
    leakScan: '2026-08-04 — frame review (7 samples), synthetic demo figures throughout (no real financials, no real client names)',
    src: `${CDN}/video/zate-investor-vision.mp4`,
    poster: `${CDN}/poster/zate-investor-vision.jpg`,
  },
  {
    id: 'sales',
    title: 'Sales',
    line: 'It works your whole pipeline.',
    blurb: 'Scores every lead, writes the follow-up, and fires at the right time — while nothing goes cold.',
    durationS: 73.3,
    accent: '#0C6C50',
    tags: ['department', 'sales'],
    type: 'department-films',
    industry: 'tech',
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
    type: 'department-films',
    industry: 'tech',
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
    type: 'department-films',
    industry: 'tech',
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
    type: 'department-films',
    industry: 'tech',
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
    type: 'department-films',
    industry: 'tech',
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
    type: 'department-films',
    industry: 'tech',
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
    type: 'explainers',
    industry: 'tech',
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
    type: 'explainers',
    industry: 'tech',
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
    type: 'flagship-ads',
    industry: 'tech',
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-07-18 — frame review, zero real-client names',
    src: `${CDN}/video/cinema-reel.mp4`,
    poster: `${CDN}/poster/cinema-reel.jpg`,
  },

  // ── Industry films — a vertical shown end to end on one fictional tenant. ──
  // ── Industry films — the vertical set. Each is ONE business, ONE journey, shot end to end on
  //    its own approved fictional tenant. Every product frame in these five carries the
  //    "DEMO DATA · FICTIONAL TENANT" chip and a tenant watermark, build-gated, so a viewer can
  //    never mistake a seeded record for a real one. That gate is why these five are public and
  //    the earlier clinic-northlight.mp4 cut is not — see work/video-hub/RECLEAR.md.
  //
  //    ⚠ `accent` below is CHOSEN, not sampled. The field's doc comment describes the department
  //    films, which open on a full-bleed colour title card; these are letterboxed product captures
  //    with no such card. Two attempts to extract a colour automatically returned the same value
  //    for all five films — first the shared demo chip, then the shared intro word — so the honest
  //    thing is to pick per film and say so rather than record a "sampled" value that never was.
  {
    id: 're-aurelia',
    title: 'Aurelia Estates',
    line: 'One board. Every stage.',
    blurb:
      'One Dubai property deal from first enquiry to transfer — the RERA forms, the commission and the board that tracks all of it.',
    durationS: 72.1,
    accent: '#818CF8',
    tags: [],
    type: 'industry-films',
    industry: 'real-estate',
    tenant: 'Aurelia Estates (fictional demo)',
    isPublic: true,
    leakScan:
      '2026-08-24 — re-cleared. Source data scanned with the fixed all-tenant scanner (no table-prefix pattern, both slug and UUID keys); frames re-read at 1 per 3.8s (19 frames, 26% coverage). Demo chip + tenant watermark present on every product frame, build-gated.',
    src: `${CDN}/video/re-aurelia.mp4`,
    poster: `${CDN}/poster/re-aurelia.jpg`,
    aspect: '9:16',
  },
  {
    id: 'thornwick',
    title: 'Thornwick Estimating',
    line: 'Measured by machine. Signed by a person.',
    blurb:
      "A contractor's take-off priced in ninety seconds, then checked line by line by a human before it counts.",
    durationS: 57.8,
    accent: '#FBBF24',
    tags: [],
    type: 'industry-films',
    industry: 'construction',
    tenant: 'Thornwick Estimating (fictional demo)',
    isPublic: true,
    leakScan:
      '2026-08-24 — re-cleared. Source data scanned with the fixed all-tenant scanner; frames re-read at 1 per 3.9s (15 frames, 26% coverage). Demo chip + tenant watermark on every product frame, build-gated.',
    src: `${CDN}/video/thornwick.mp4`,
    poster: `${CDN}/poster/thornwick.jpg`,
    aspect: '9:16',
  },
  {
    id: 'marhama',
    title: 'Marhama',
    line: 'The AI priced fifteen line items. Who checks its work?',
    blurb:
      'A UAE fit-out bid, taken off in AED by the AI and priced to the fils — then approved line by line before it enters the estimate.',
    durationS: 54.1,
    accent: '#D97706',
    tags: [],
    type: 'industry-films',
    industry: 'construction',
    tenant: 'Marhama (fictional demo)',
    isPublic: true,
    leakScan:
      '2026-08-26 — cleared before first publish. Source data scanned with the fixed all-tenant scanner (0 findings over 294 columns / 92 values / 25 plate strings; every contact field NULL by design). Frame-level scan added: every engine-authored overlay string (chapters/labels/callouts/hooks/endcard/position pill) scanned with the same detector (0 findings), plus a 28-tile contact sheet sampled at 1 per 1.9s from the DELIVERED file and reviewed directly — no OCR on this box, same method as the rest of this set. Demo chip + chapter label + position pill + journey spine confirmed present on all 14 product frames, measured on the delivered artifact itself, not the pre-mux build. Crossfilm identity check run with this tenant IN the published hub scope (4 distinct identity values, 0 collisions). Built on an isolated demo tenant (marhama-estimating-demo) — the real Marhama account was never touched.',
    src: `${CDN}/video/marhama.mp4`,
    poster: `${CDN}/poster/marhama.jpg`,
    aspect: '9:16',
  },
  {
    id: 'ashvale',
    title: 'Ashvale Recovery Partners',
    line: 'Every attempt on the record.',
    blurb:
      'A collections desk working one overdue account through to settlement — every call, every promise and every rule that governs them, logged.',
    durationS: 109.3,
    accent: '#FB923C',
    tags: [],
    type: 'industry-films',
    industry: 'finance',
    tenant: 'Ashvale Recovery Partners (fictional demo)',
    isPublic: true,
    leakScan:
      '2026-08-24 — re-cleared. Source data scanned with the fixed all-tenant scanner; frames re-read at 1 per 3.9s (28 frames, 26% coverage). Demo chip + tenant watermark on every product frame, build-gated.',
    src: `${CDN}/video/ashvale.mp4`,
    poster: `${CDN}/poster/ashvale.jpg`,
    aspect: '9:16',
  },
  {
    id: 'halvern',
    title: 'Halvern Jewellers',
    line: 'Gold moved three times this week.',
    blurb:
      "A jeweller's book when the metal price moves faster than the quote — repricing, stock by weight, and a trial balance that still closes.",
    durationS: 107.0,
    accent: '#E5C07B',
    tags: [],
    type: 'industry-films',
    industry: 'retail',
    tenant: 'Halvern Jewellers (fictional demo)',
    isPublic: true,
    leakScan:
      '2026-08-24 — re-cleared. Source data scanned with the fixed all-tenant scanner; frames re-read at 1 per 4.0s (27 frames, 25% coverage). Demo chip + tenant watermark on every product frame, build-gated.',
    src: `${CDN}/video/halvern.mp4`,
    poster: `${CDN}/poster/halvern.jpg`,
    aspect: '9:16',
  },
  {
    id: 'northlight',
    title: 'Northlight Clinic',
    line: 'One patient. One morning.',
    blurb:
      'One patient from front desk to visit closed — vitals, chart, consult, dispensary — and the six people who all have to know the same thing.',
    durationS: 105.5,
    accent: '#5EEAD4',
    tags: [],
    type: 'industry-films',
    industry: 'healthcare',
    tenant: 'Northlight Clinic (fictional demo)',
    isPublic: true,
    leakScan:
      '2026-08-24 — re-cleared, and REPLACES the earlier clinic-northlight.mp4 cut, which is held (see RECLEAR.md). Patient contact details are masked at render time and never written to the tenant; the seeded-demo chip is build-gated onto all 28 product beats. Frames re-read at 1 per 3.9s (27 frames, 26% coverage).',
    src: `${CDN}/video/northlight-clinic.mp4`,
    poster: `${CDN}/poster/northlight-clinic.jpg`,
    aspect: '9:16',
  },

  // ── How-to — the first entry in the tutorial shelf. ──
  {
    id: 'how-to-sequences',
    title: 'Building a Sequence',
    line: 'Add touchpoints to your outreach sequence.',
    blurb: 'A real screen recording of building a multi-step outreach sequence in OMEGA, start to finish.',
    durationS: 234.7,
    accent: '#34D399',
    tags: [],
    type: 'how-to',
    industry: 'tech',
    tenant: 'Veyra Robotics (fictional demo)',
    isPublic: true,
    leakScan: '2026-08-04 — frame review, zero real-client names (synthetic sequence content only)',
    src: `${CDN}/video/sequences-tutorial.mp4`,
    poster: `${CDN}/poster/sequences-tutorial.jpg`,
  },

  // ── Held back. Real films, deliberately not public. Do NOT flip without the operator. ──
  // Cedarcrest Hospital (healthcare, fictional-tenant-cleared): the founder rejected the
  // HLT_SHOW_V3 audio twice for metallic tick/chime transients; a re-mixed audio2 cut shipped
  // 2026-07-09 under a HARD STOP for a founder listen before going further. No record of that
  // listen having happened — stays held.
  // Aurelia Estates real-estate trilogy (Capabilities/FieldGuide, fictional-tenant-cleared):
  // ships with a SYNTH placeholder music bed pending a licensed swap, never done as of the last
  // audit. Not release quality — stays held.
  // ONE MIND + THE FLOOR NEVER SLEEPS (Vox-style explainers, Veyra Robotics, all quality gates
  // already PASS): the founder's own note on this work is "NEXT (founder-gated): review → ...
  // → hub publish" — hub publish was explicitly the last, gated step, not yet exercised. These
  // are the strongest remaining candidate for the Explainers shelf and technically ready — held
  // only on that outstanding sign-off, not on any law or quality issue.
  // The whole pre-2026-07-04 real-client library (BBQ, BSH, MNT Halan, DSC, Marhama, Cosmique,
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

/** Films carrying a department tag — public only, by construction. */
export function filmsByTag(tag: string): Film[] {
  return publicFilms().filter((f) => f.tags.includes(tag))
}

export function filmsByType(type: FilmType): Film[] {
  return publicFilms().filter((f) => f.type === type)
}

export function filmsByIndustry(industry: Industry): Film[] {
  return publicFilms().filter((f) => f.industry === industry)
}

export interface Collection {
  slug: string
  label: string
  blurb: string
  kind: 'type' | 'industry' | 'department'
  films: () => Film[]
}

/**
 * /videos/<slug> for TYPE — "what kind of film is this". Always registered;
 * a type with zero cleared films simply renders the honest empty-state fallback
 * (see VideosPage's `unknownSlug` handling), never a broken or missing page.
 */
const TYPE_COLLECTIONS: Collection[] = [
  { slug: 'flagship-ads', label: 'Flagship Ads', blurb: 'The pitch, cut for the timeline.', kind: 'type', films: () => filmsByType('flagship-ads') },
  { slug: 'founder-story', label: 'Founder Story', blurb: 'Why this exists, from the person who built it.', kind: 'type', films: () => filmsByType('founder-story') },
  { slug: 'how-to', label: 'How-To', blurb: 'Step-by-step walkthroughs of the real product.', kind: 'type', films: () => filmsByType('how-to') },
  { slug: 'explainers', label: 'Explainers', blurb: 'How the intelligence actually works, taught plainly.', kind: 'type', films: () => filmsByType('explainers') },
  { slug: 'department-films', label: 'Department Films', blurb: 'Each department, on its own.', kind: 'type', films: () => filmsByType('department-films') },
  { slug: 'industry-films', label: 'Industry Films', blurb: 'OMEGA built for one specific business.', kind: 'type', films: () => filmsByType('industry-films') },
]

/**
 * /videos/<slug> for INDUSTRY — "which business is this shown on". Always
 * registered for the same honest-fallback reason as TYPE_COLLECTIONS above.
 * Slugs are deliberately distinct from the legacy department slugs below
 * (e.g. financial-services here vs. finance for the Finance department film) —
 * those are two different dimensions of the same word and must not collide.
 */
const INDUSTRY_COLLECTIONS: Collection[] = [
  { slug: 'healthcare', label: 'Healthcare', blurb: 'Clinics and hospitals running on OMEGA.', kind: 'industry', films: () => filmsByIndustry('healthcare') },
  { slug: 'government', label: 'Government', blurb: 'Public-sector deployments.', kind: 'industry', films: () => filmsByIndustry('government') },
  { slug: 'restaurant-hospitality', label: 'Restaurant & Hospitality', blurb: 'Restaurants, hotels and hospitality brands.', kind: 'industry', films: () => filmsByIndustry('restaurant-hospitality') },
  { slug: 'retail', label: 'Retail', blurb: 'Retail and e-commerce operations.', kind: 'industry', films: () => filmsByIndustry('retail') },
  { slug: 'financial-services', label: 'Financial Services', blurb: 'Finance and accounting operations.', kind: 'industry', films: () => filmsByIndustry('finance') },
  { slug: 'real-estate', label: 'Real Estate', blurb: 'Brokerages and property teams.', kind: 'industry', films: () => filmsByIndustry('real-estate') },
  { slug: 'construction', label: 'Construction', blurb: 'Contractors, estimating and the cost of a wrong take-off.', kind: 'industry', films: () => filmsByIndustry('construction') },
  { slug: 'tech', label: 'Tech', blurb: 'Software and technology companies.', kind: 'industry', films: () => filmsByIndustry('tech') },
]

/**
 * /videos/<slug> for DEPARTMENT — the original, finer-grained "which OMEGA
 * module" browse. Unchanged from before the type/industry pass; kept for the
 * existing links into it.
 */
const DEPARTMENT_COLLECTIONS: Collection[] = [
  { slug: 'sales',          label: 'Sales',          blurb: 'How OMEGA works a pipeline end to end.',        kind: 'department', films: () => filmsByTag('sales') },
  { slug: 'marketing',      label: 'Marketing',      blurb: 'How OMEGA runs a brand end to end.',            kind: 'department', films: () => filmsByTag('marketing') },
  { slug: 'communications', label: 'Communications', blurb: 'Every channel, one inbox, answered.',           kind: 'department', films: () => filmsByTag('communications') },
  { slug: 'operations',     label: 'Operations',     blurb: 'Stock, supply chain and the things that slip.', kind: 'department', films: () => filmsByTag('operations') },
  { slug: 'finance',        label: 'Finance',        blurb: 'Cash, receivables and continuous reconciliation.', kind: 'department', films: () => filmsByTag('finance') },
  { slug: 'people',         label: 'People',         blurb: 'Sourcing, screening and ranking, continuously.', kind: 'department', films: () => filmsByTag('people') },
  { slug: 'flagship',       label: 'The Flagship',   blurb: 'The full OMEGA story.',                          kind: 'department', films: () => filmsByTag('flagship') },
  { slug: 'living',         label: 'The Living System', blurb: 'The organization brain, recorded live.',      kind: 'department', films: () => filmsByTag('living') },
]

const ALL_COLLECTIONS: Collection[] = [...TYPE_COLLECTIONS, ...INDUSTRY_COLLECTIONS, ...DEPARTMENT_COLLECTIONS]

/** Only collections (of any kind) that actually have a public film behind them. */
export function publicCollections(): Collection[] {
  return ALL_COLLECTIONS.filter((c) => c.films().length > 0)
}

export function publicCollectionsByKind(kind: Collection['kind']): Collection[] {
  return publicCollections().filter((c) => c.kind === kind)
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
