/**
 * scenePalette.ts — the CSS ↔ WebGL color bridge + the 8-palette atmosphere set.
 *
 * ⚠ CRITICAL: `new THREE.Color("oklch(...)")` DOES NOT WORK — THREE.Color.setStyle
 * only parses #hex / rgb() / hsl() / named colors. So this JS object is the ONE
 * source of truth: `hex` feeds three, `oklch` feeds CSS. WebGL reads this object,
 * never the DOM (DESIGN_SYSTEM §6.4).
 *
 * The 8 palettes are the atmosphere system from DESIGN_SYSTEM §2.2.
 */
import * as THREE from 'three'

export interface Palette {
  /** human label */
  name: string
  /** value used for the `data-scene` attribute + CSS [data-scene] rules */
  dataScene: string
  /** accent hex (feeds three) */
  hex: string
  /** the particle color fed to the orb (= hex, except light scenes use dark ink) */
  particleHex: string
  /** secondary glow hex */
  glow: string
  /** accent as OKLCH (feeds CSS) */
  oklch: string
  /** scene background (CSS) */
  bg: string
  /** scene mid surface (CSS) */
  mid: string
  /** text/neutral (CSS) */
  text: string
  /** light scene → orb must switch to NormalBlending + dark particles */
  light?: boolean
  /** palette has no accent on purpose (Graphite scaffold) → restrained orb */
  accentless?: boolean
  /** optional multi-stop background gradient (Dawn) */
  gradient?: string
}

const PALETTES_DEF = {
  /** Deep-Space Ink — home base: cold, infinite, calm. Reserve cyan for ONE element. */
  home: {
    name: 'Deep-Space Ink',
    dataScene: 'home',
    hex: '#6EE7FF',
    particleHex: '#6EE7FF',
    glow: '#6EE7FF',
    oklch: 'oklch(0.86 0.13 215)',
    bg: '#05060A',
    mid: '#0C0F18',
    text: '#C7CBD6',
  },
  /** Bioluminescent Teal — AI thinking: alive, deep-ocean phosphorescence. */
  think: {
    name: 'Bioluminescent Teal',
    dataScene: 'think',
    hex: '#14B8A6',
    particleHex: '#2DD4BF',
    glow: '#5EEAD4',
    oklch: 'oklch(0.72 0.13 178)',
    bg: '#04100F',
    mid: '#06201C',
    text: '#B8C8C4',
  },
  /** Ember Amber — AI acting: warmth, energy, consequence. Brief. */
  act: {
    name: 'Ember Amber',
    dataScene: 'act',
    hex: '#F97316',
    particleHex: '#FB923C',
    glow: '#FBBF24',
    oklch: 'oklch(0.72 0.18 47)',
    bg: '#120804',
    mid: '#2A1206',
    text: '#D6C3B4',
  },
  /** Graphite Neutral — scaffold: restraint, breathing room. NO accent. */
  graphite: {
    name: 'Graphite Neutral',
    dataScene: 'graphite',
    hex: '#8A909C',
    particleHex: '#AEB4C0',
    glow: '#8A909C',
    oklch: 'oklch(0.66 0.01 265)',
    bg: '#0F1115',
    mid: '#181B21',
    text: '#D8DCE3',
    accentless: true,
  },
  /** Ultraviolet — off-leash autonomy: mysterious, premium, synth-noir. */
  auto: {
    name: 'Ultraviolet',
    dataScene: 'auto',
    hex: '#8B5CF6',
    particleHex: '#A78BFA',
    glow: '#C084FC',
    oklch: 'oklch(0.62 0.20 295)',
    bg: '#0A0612',
    mid: '#1A0E2E',
    text: '#C4BCD4',
  },
  /** Sterile White-Out — clarity inversion: the ONE hard cut to near-white. */
  truth: {
    name: 'Sterile White-Out',
    dataScene: 'truth',
    hex: '#0EA5E9',
    particleHex: '#0C0F18', // dark particles on a light ground (NormalBlending)
    glow: '#0EA5E9',
    oklch: 'oklch(0.68 0.15 235)',
    bg: '#F4F6F8',
    mid: '#FFFFFF',
    text: '#0C0F18',
    light: true,
  },
  /** Neural Magenta — connection: electric intimacy, synapse-fire. */
  synapse: {
    name: 'Neural Magenta',
    dataScene: 'synapse',
    hex: '#EC4899',
    particleHex: '#F472B6',
    glow: '#F9A8D4',
    oklch: 'oklch(0.66 0.22 0)',
    bg: '#0E040B',
    mid: '#2A0820',
    text: '#D2BCC8',
  },
  /** Dawn Gradient — resolution/outro: hope, arrival, first light. */
  dawn: {
    name: 'Dawn Gradient',
    dataScene: 'dawn',
    hex: '#FBC78A',
    particleHex: '#FBC78A',
    glow: '#E8806B',
    oklch: 'oklch(0.84 0.09 70)',
    bg: '#1B1033',
    mid: '#6D3B7A',
    text: '#FFE3B3',
    gradient:
      'linear-gradient(180deg, #1B1033 0%, #6D3B7A 38%, #E8806B 72%, #FBC78A 100%)',
  },
} satisfies Record<string, Palette>

export type PaletteKey = keyof typeof PALETTES_DEF
/** Exposed with the full Palette type so optional fields (light/accentless/gradient) are visible. */
export const PALETTES: Record<PaletteKey, Palette> = PALETTES_DEF
export const PALETTE_KEYS = Object.keys(PALETTES) as PaletteKey[]

/**
 * Pre-build three Colors ONCE (hex parses fine; oklch never reaches three).
 * convertSRGBToLinear so the additive glow matches the CSS, not washed out —
 * paired with `#include <colorspace_fragment>` on output in the fragment shader.
 */
export const THREE_COLORS: Record<PaletteKey, THREE.Color> = Object.fromEntries(
  PALETTE_KEYS.map((k) => [
    k,
    new THREE.Color(PALETTES[k].particleHex).convertSRGBToLinear(),
  ]),
) as Record<PaletteKey, THREE.Color>

/** One scene definition for the 11-scene scaffold. */
export interface OmegaScene {
  index: number
  /** scene title shown in the placeholder + indicator */
  name: string
  act: string
  paletteKey: PaletteKey
  /** scroll behaviour proven by the scaffold */
  mode: 'normal' | 'pin' | 'horizontal' | 'time-scrub'
}

/**
 * The 11-scene → 5-act arc (DESIGN_SYSTEM §5). All 8 palettes appear; the four
 * scroll modes (normal / pin / horizontal / time-scrub) are all exercised.
 */
export const OMEGA_SCENES: OmegaScene[] = [
  { index: 0, name: 'Hero', act: 'I — Awakening', paletteKey: 'home', mode: 'normal' },
  { index: 1, name: 'Premise', act: 'I — Awakening', paletteKey: 'home', mode: 'normal' },
  { index: 2, name: 'Reasoning', act: 'II — Thinking', paletteKey: 'think', mode: 'pin' },
  { index: 3, name: 'Memory', act: 'II — Thinking', paletteKey: 'think', mode: 'normal' },
  { index: 4, name: 'Deploy', act: 'III — Acting', paletteKey: 'act', mode: 'pin' },
  { index: 5, name: 'Scale', act: 'III — Acting', paletteKey: 'graphite', mode: 'horizontal' },
  { index: 6, name: 'Off-leash', act: 'IV — Autonomy', paletteKey: 'auto', mode: 'normal' },
  { index: 7, name: 'Truth', act: 'IV — Autonomy', paletteKey: 'truth', mode: 'time-scrub' },
  { index: 8, name: 'Synapse', act: 'V — Connection & Arrival', paletteKey: 'synapse', mode: 'normal' },
  { index: 9, name: 'Network', act: 'V — Connection & Arrival', paletteKey: 'synapse', mode: 'pin' },
  { index: 10, name: 'CTA', act: 'V — Connection & Arrival', paletteKey: 'dawn', mode: 'normal' },
]

/** palette key per scene index — the orb reads this to pick its color. */
export const SCENE_SEQUENCE: PaletteKey[] = OMEGA_SCENES.map((s) => s.paletteKey)

/** Resolve a scene index → its palette (clamped). */
export function paletteForScene(index: number): Palette {
  const key = SCENE_SEQUENCE[Math.max(0, Math.min(index, SCENE_SEQUENCE.length - 1))]
  return PALETTES[key]
}
