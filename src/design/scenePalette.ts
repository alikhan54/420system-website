/**
 * scenePalette.ts — the CSS ↔ WebGL color bridge + the per-scene atmosphere set.
 *
 * ⚠ CRITICAL: `new THREE.Color("oklch(...)")` DOES NOT WORK — THREE.Color.setStyle
 * only parses #hex / rgb() / hsl() / named colors. So this JS object is the ONE
 * source of truth: `hex` feeds three, `oklch` feeds CSS. WebGL reads this object,
 * never the DOM (DESIGN_SYSTEM §6.4).
 *
 * Phase 2: the palette set is expanded to the 11-scene story (wine MIRROR, cool
 * SHIFT, terminal-green FEED, time-of-day A-DAY, pale EXHALE, white CHOICE, aurora
 * DOOR) on top of the original 8. Every value is OKLCH-tinted-black, never #000.
 */
import * as THREE from 'three'

export interface Palette {
  name: string
  dataScene: string
  hex: string
  particleHex: string
  glow: string
  oklch: string
  bg: string
  mid: string
  text: string
  light?: boolean
  accentless?: boolean
  gradient?: string
}

const PALETTES_DEF = {
  /** Deep-Space Ink — MEET: cold, infinite, calm. */
  home: {
    name: 'Deep-Space Ink', dataScene: 'home',
    hex: '#6EE7FF', particleHex: '#6EE7FF', glow: '#6EE7FF', oklch: 'oklch(0.86 0.13 215)',
    bg: '#05060A', mid: '#0C0F18', text: '#C7CBD6',
  },
  /** Ember Amber — ORIGIN: a single light in a dark room, warmth + memory. */
  act: {
    name: 'Ember Amber', dataScene: 'act',
    hex: '#F97316', particleHex: '#FB923C', glow: '#FBBF24', oklch: 'oklch(0.72 0.18 47)',
    bg: '#120804', mid: '#2A1206', text: '#D6C3B4',
  },
  /** Wine Red — MIRROR: anxiety, the cold leads, the unread follow-ups. */
  mirror: {
    name: 'Wine Red', dataScene: 'mirror',
    hex: '#E11D48', particleHex: '#FB7185', glow: '#FB7185', oklch: 'oklch(0.60 0.21 18)',
    bg: '#140609', mid: '#2A0A12', text: '#E8C5CC',
  },
  /** Cool Blue Dawn — SHIFT: the question turns, first cool light. */
  shift: {
    name: 'Cool Blue Dawn', dataScene: 'shift',
    hex: '#3B82F6', particleHex: '#60A5FA', glow: '#93C5FD', oklch: 'oklch(0.66 0.16 258)',
    bg: '#070D1A', mid: '#0E1A2E', text: '#C3D2E6',
  },
  /** Four Brains — neutral deep base; the ORB cycles its own department hues. */
  brains: {
    name: 'Four Brains', dataScene: 'brains',
    hex: '#22D3EE', particleHex: '#22D3EE', glow: '#67E8F9', oklch: 'oklch(0.80 0.13 200)',
    bg: '#06121A', mid: '#0C2030', text: '#BCD2DA',
  },
  /** Terminal Green — LIVE FEED: the machine thinking out loud. */
  feed: {
    name: 'Terminal Green', dataScene: 'feed',
    hex: '#22C55E', particleHex: '#4ADE80', glow: '#86EFAC', oklch: 'oklch(0.74 0.18 150)',
    bg: '#03100A', mid: '#06231A', text: '#B7D8C4',
  },
  /** Time-of-day — A DAY: base = night; the scene scrubs night→dawn→day→dusk. */
  day: {
    name: 'A Day', dataScene: 'day',
    hex: '#FBBF24', particleHex: '#FCD34D', glow: '#FCD34D', oklch: 'oklch(0.84 0.13 80)',
    bg: '#080B16', mid: '#141A2E', text: '#CBD2E0',
  },
  /** Sterile White-Out — PROOF: the one hard cut to near-white, dark particles. */
  truth: {
    name: 'Sterile White-Out', dataScene: 'truth',
    hex: '#0EA5E9', particleHex: '#0C0F18', glow: '#0EA5E9', oklch: 'oklch(0.62 0.15 235)',
    bg: '#F4F6F8', mid: '#FFFFFF', text: '#0C0F18', light: true,
  },
  /** Pale Aurora Teal — EXHALE: calm, breath, peace. */
  exhale: {
    name: 'Pale Aurora Teal', dataScene: 'exhale',
    hex: '#5EEAD4', particleHex: '#5EEAD4', glow: '#99F6E4', oklch: 'oklch(0.86 0.10 175)',
    bg: '#04130F', mid: '#0A241D', text: '#BFD8D0',
  },
  /** Clean White — CHOICE: pricing, contrast pop, dark particles. */
  choice: {
    name: 'Clean White', dataScene: 'choice',
    hex: '#0D9488', particleHex: '#0C1418', glow: '#14B8A6', oklch: 'oklch(0.58 0.11 185)',
    bg: '#F5F7F9', mid: '#FFFFFF', text: '#0C0F18', light: true,
  },
  /** Aurora Teal Night — DOOR: the dolly-in, arrival, the threshold. */
  door: {
    name: 'Aurora Teal Night', dataScene: 'door',
    hex: '#2DD4BF', particleHex: '#5EEAD4', glow: '#5EEAD4', oklch: 'oklch(0.80 0.13 178)',
    bg: '#03110F', mid: '#072420', text: '#BFE0D8',
  },

  // ---- original palettes kept for the orb test page color buttons ----
  think: {
    name: 'Bioluminescent Teal', dataScene: 'think',
    hex: '#14B8A6', particleHex: '#2DD4BF', glow: '#5EEAD4', oklch: 'oklch(0.72 0.13 178)',
    bg: '#04100F', mid: '#06201C', text: '#B8C8C4',
  },
  auto: {
    name: 'Ultraviolet', dataScene: 'auto',
    hex: '#8B5CF6', particleHex: '#A78BFA', glow: '#C084FC', oklch: 'oklch(0.62 0.20 295)',
    bg: '#0A0612', mid: '#1A0E2E', text: '#C4BCD4',
  },
  synapse: {
    name: 'Neural Magenta', dataScene: 'synapse',
    hex: '#EC4899', particleHex: '#F472B6', glow: '#F9A8D4', oklch: 'oklch(0.66 0.22 0)',
    bg: '#0E040B', mid: '#2A0820', text: '#D2BCC8',
  },
} satisfies Record<string, Palette>

export type PaletteKey = keyof typeof PALETTES_DEF
export const PALETTES: Record<PaletteKey, Palette> = PALETTES_DEF
export const PALETTE_KEYS = Object.keys(PALETTES) as PaletteKey[]

/** Pre-build three Colors ONCE (hex parses fine; oklch never reaches three). */
export const THREE_COLORS: Record<PaletteKey, THREE.Color> = Object.fromEntries(
  PALETTE_KEYS.map((k) => [k, new THREE.Color(PALETTES[k].particleHex).convertSRGBToLinear()]),
) as Record<PaletteKey, THREE.Color>

/** One scene of the 11-scene story. */
export interface OmegaScene {
  index: number
  /** scene short name (content, fine to hardcode — not the brand) */
  name: string
  act: string
  paletteKey: PaletteKey
  mode: 'normal' | 'pin' | 'horizontal' | 'time-scrub'
  /** fires the film-cut brightness pulse on enter (act boundaries) */
  actStart?: boolean
}

/**
 * THE STORY — 11 scenes (definitive). The orb is ONE persistent entity morphing
 * sphere → mesh → streams → sphere across these as you scroll. Orb 3D directives
 * live in orbDirectives.ts (index-aligned); copy lives in sceneCopy.ts.
 */
export const OMEGA_SCENES: OmegaScene[] = [
  { index: 0,  name: 'Meet',       act: 'I',   paletteKey: 'home',   mode: 'normal',     actStart: true },
  { index: 1,  name: 'Origin',     act: 'I',   paletteKey: 'act',    mode: 'normal' },
  { index: 2,  name: 'Mirror',     act: 'II',  paletteKey: 'mirror', mode: 'normal',     actStart: true },
  { index: 3,  name: 'Shift',      act: 'II',  paletteKey: 'shift',  mode: 'horizontal' },
  { index: 4,  name: 'Four Brains',act: 'III', paletteKey: 'brains', mode: 'pin',        actStart: true },
  { index: 5,  name: 'Live Feed',  act: 'III', paletteKey: 'feed',   mode: 'normal' },
  { index: 6,  name: 'A Day',      act: 'IV',  paletteKey: 'day',    mode: 'time-scrub', actStart: true },
  { index: 7,  name: 'Proof',      act: 'IV',  paletteKey: 'truth',  mode: 'normal',     actStart: true },
  { index: 8,  name: 'Exhale',     act: 'IV',  paletteKey: 'exhale', mode: 'normal' },
  { index: 9,  name: 'Choice',     act: 'V',   paletteKey: 'choice', mode: 'normal',     actStart: true },
  { index: 10, name: 'Door',       act: 'V',   paletteKey: 'door',   mode: 'pin',        actStart: true },
]

/** palette key per scene index — the orb reads this to pick its color. */
export const SCENE_SEQUENCE: PaletteKey[] = OMEGA_SCENES.map((s) => s.paletteKey)

export function paletteForScene(index: number): Palette {
  const key = SCENE_SEQUENCE[Math.max(0, Math.min(index, SCENE_SEQUENCE.length - 1))]
  return PALETTES[key]
}
