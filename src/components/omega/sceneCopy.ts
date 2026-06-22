/**
 * sceneCopy.ts — the verbatim story copy for all 11 scenes (the definitive
 * narrative). Brand-bound strings interpolate BRAND so the deferred rename stays
 * a one-file change. Everything here is content; all product-proof is
 * FABRICATED / ILLUSTRATIVE — no real customer names, no real tenant data.
 */
import { BRAND } from '../../config/brand'

export const COPY = {
  meet: {
    eyebrow: `${BRAND.name} · CORE INTELLIGENCE`,
    h1: 'Meet the mind',
    h2: 'running entire businesses.',
    sub: 'Not a tool. Not a SaaS. A living intelligence that runs sales, marketing, HR, and operations as one.',
    cta: `Talk to ${BRAND.name} →`,
  },
  origin: {
    eyebrow: 'THE ORIGIN',
    quote: `“I built ${BRAND.name} because I'd spent years automating other people's businesses — and hitting the gaps nobody else would solve. Meanwhile my own ran on 47 tabs at 2am. Replying to leads. Approving payroll. Chasing invoices. I wasn't a CEO — I was an assistant to my own company. So I built something to take it back.”`,
    attribution: '— Adeel, Founder',
  },
  mirror: {
    eyebrow: 'RIGHT NOW, WHILE YOU READ THIS',
    lines: [
      'Three leads went cold in the last hour.',
      'Your team waited 40 minutes for an answer you already knew.',
      'Two follow-ups you meant to send yesterday — still drafted.',
    ],
    closing: "You don't have a tool problem. You have a coordination problem.",
  },
  shift: {
    panels: [
      'What if every department shared one memory?',
      'What if your sales call knew what marketing promised, what ops delivered, what HR onboarded?',
      "That's not software. That's a mind.",
    ],
  },
  brains: {
    eyebrow: 'ONE INTELLIGENCE · FOUR DEPARTMENTS',
    depts: [
      { key: 'sales', label: 'Sales', hue: '#2DD4BF', body: 'Scores leads, sequences outreach, books calls — no CRM in the loop.' },
      { key: 'marketing', label: 'Marketing', hue: '#38BDF8', body: 'Researches, writes, schedules, and measures every campaign across channels.' },
      { key: 'hr', label: 'Human Resources', hue: '#818CF8', body: 'Onboards staff, runs payroll, answers every team question — a CHRO that never sleeps.' },
      { key: 'ops', label: 'Operations', hue: '#FBBF24', body: 'Inventory, vendors, reconciliation, exceptions — the work nobody wants to do.' },
    ],
  },
  feed: {
    eyebrow: 'LIVE · RIGHT NOW',
    headline: `What ${BRAND.name} is thinking.`,
    caption: 'Illustrative of real decision categories.',
  },
  day: {
    vignettes: [
      { time: '03:47', env: 'kitchen', line: "Tomorrow's prep list is already drafted. The owner sleeps." },
      { time: '09:12', env: 'office', line: "Today's call list is prioritized before the team arrives." },
      { time: '12:38', env: 'clinic', line: 'Three bookings matched to the right specialist automatically.' },
      { time: '20:22', env: 'site', line: 'A project estimate completed in 2 hours, reviewed over dinner.' },
    ],
  },
  proof: {
    eyebrow: 'THE PROOF',
    headline: 'Already running.',
    // Honest claims — breadth, not a fabricated count. No fixed numbers.
    stats: [
      { value: 'Any', unit: 'business', caption: 'Restaurants, fintech, accounting, gold, healthcare, real estate, even creators — the work is always the same.' },
      { value: 'Every', unit: 'department', caption: 'Sales, marketing, HR, and operations — one intelligence.' },
      { value: 'Always', unit: 'on', caption: "Autonomous, 24/7, whether you're in the room or not." },
    ],
  },
  exhale: {
    eyebrow: 'WHAT THIS GIVES YOU',
    lines: [
      'You sleep at night.',
      'Your team leaves at 5.',
      "You don't open Slack on Sunday.",
      "Your business runs whether you're in the room or not.",
    ],
    final: "That's not productivity software. That's freedom.",
  },
  choice: {
    eyebrow: 'THE CHOICE',
    headline: `Three ways to bring ${BRAND.name} in.`,
    tiers: [
      {
        name: 'Foundation', price: '$199', cadence: '/mo', popular: false,
        for: 'For solo founders',
        features: ['Sales + Marketing', 'Up to 1,000 contacts', 'Email + chat support'],
      },
      {
        name: 'Professional', price: '$499', cadence: '/mo', popular: true,
        for: 'For growing teams',
        features: ['All 4 modules', 'Up to 10,000 contacts', 'Voice AI + WhatsApp', 'Priority support'],
      },
      {
        name: 'Enterprise', price: '$1,999', cadence: '/mo', popular: false,
        for: 'For multi-site operators',
        features: ['Unlimited contacts', 'White-label', 'Dedicated infrastructure', 'Success manager'],
      },
    ],
    note: '14-day trial. No card to start.',
  },
  door: {
    eyebrow: 'THE DOOR',
    headline: 'Ready to meet your CEO?',
    sub: `One conversation. No demo deck. Just ${BRAND.name}.`,
    cta: `Talk to ${BRAND.name} →`,
    footerLinks: ['Privacy', 'Terms', 'Contact'],
    builtIn: 'BUILT IN KARACHI',
  },
} as const

/** ~40 illustrative streaming decisions for the LIVE FEED (mix of 4 categories). */
export const FEED_LINES: { cat: 'SALES' | 'MARKETING' | 'HR' | 'OPS'; text: string }[] = [
  { cat: 'SALES', text: 'Scoring inbound lead — 87/100, high intent, booking demo' },
  { cat: 'MARKETING', text: 'Drafting LinkedIn post — angle: post-purchase retention' },
  { cat: 'HR', text: 'Approving leave request — valid notice, balance OK' },
  { cat: 'OPS', text: 'Reorder triggered — stock at 12%, vendor notified' },
  { cat: 'SALES', text: 'Sequencing 3-touch follow-up — no reply in 48h' },
  { cat: 'OPS', text: 'Invoice reconciled — matched PO #4471, cleared' },
  { cat: 'MARKETING', text: 'A/B subject line picked — variant B +18% open' },
  { cat: 'HR', text: 'Onboarding checklist sent — new hire, day-one access' },
  { cat: 'SALES', text: 'Demo booked — Tue 3pm, calendar invite issued' },
  { cat: 'OPS', text: 'Exception flagged — shipment delayed, customer alerted' },
  { cat: 'MARKETING', text: 'Campaign measured — CPL down 22% week over week' },
  { cat: 'HR', text: 'Payroll run queued — 14 staff, taxes calculated' },
  { cat: 'SALES', text: 'Lead deprioritized — 19/100, low fit, nurturing later' },
  { cat: 'OPS', text: 'Vendor quote compared — 3 bids, lowest selected' },
  { cat: 'MARKETING', text: 'Blog brief generated — topic: cost of slow follow-up' },
  { cat: 'HR', text: 'Policy question answered — remote stipend, cited handbook' },
  { cat: 'SALES', text: 'Quote sent — tier matched to usage, 14-day expiry' },
  { cat: 'OPS', text: 'Stock forecast updated — reorder point raised for SKU-22' },
  { cat: 'MARKETING', text: 'Newsletter scheduled — Thu 8am, segment: trial users' },
  { cat: 'HR', text: 'Interview slot proposed — candidate + hiring manager synced' },
  { cat: 'SALES', text: 'Objection detected on call — pricing; sending case study' },
  { cat: 'OPS', text: 'Refund processed — within policy, ledger updated' },
  { cat: 'MARKETING', text: 'Ad creative rotated — fatigue at 3.1 frequency' },
  { cat: 'HR', text: 'Birthday reminder routed — team channel, 2 days out' },
  { cat: 'SALES', text: 'CRM hygiene — duplicate contact merged, history kept' },
  { cat: 'OPS', text: 'Low-margin order flagged for review — 4% vs 18% target' },
  { cat: 'MARKETING', text: 'SEO gap found — competitor ranks for "after-hours leads"' },
  { cat: 'HR', text: 'Timesheet anomaly — overtime spike, manager notified' },
  { cat: 'SALES', text: 'Warm intro drafted — mutual connection identified' },
  { cat: 'OPS', text: 'Supplier risk noted — single-source part, alt sourced' },
  { cat: 'MARKETING', text: 'Webinar follow-up sent — 41 attendees, replay linked' },
  { cat: 'HR', text: 'Offer letter generated — band-matched, awaiting sign-off' },
  { cat: 'SALES', text: 'Renewal flagged — contract ends in 30 days, outreach set' },
  { cat: 'OPS', text: 'Cash position summarized — runway steady, no action' },
  { cat: 'MARKETING', text: 'Landing copy rewritten — clarity pass, CTA above fold' },
  { cat: 'HR', text: 'PTO balance reconciled — accruals applied, all green' },
  { cat: 'SALES', text: 'Lost-deal reason logged — budget; re-engage next quarter' },
  { cat: 'OPS', text: 'Delivery route optimized — 2 stops merged, ETA earlier' },
  { cat: 'MARKETING', text: 'Testimonial requested — happy customer, NPS 9' },
  { cat: 'HR', text: 'Compliance check passed — training current for all staff' },
]
