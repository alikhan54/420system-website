/**
 * orbDirectives.ts — the per-scene 3D choreography for the ONE persistent orb.
 *
 * The orb reads these by `sceneState.index` (a module-level table, like the
 * palette sequence). On every scene change the orb triggers a morph from its
 * current shape to `morphTo` (or from `morphFrom` when a scene wants an explicit
 * starting shape, e.g. SHIFT assembling from scatter). Each frame it damps
 * scale / offset / visibility / spin toward the directive — so repositioning the
 * orb per scene is smooth, never a jump.
 *
 * Index order matches OMEGA_SCENES (scenePalette.ts):
 *   0 MEET · 1 ORIGIN · 2 MIRROR · 3 SHIFT · 4 FOUR BRAINS · 5 LIVE FEED
 *   6 A DAY · 7 PROOF · 8 EXHALE · 9 CHOICE · 10 DOOR
 */
import * as THREE from 'three'
import type { MorphKey } from './morphShapes'

export interface OrbDirective {
  /** the shape the orb morphs INTO when this scene activates */
  morphTo: MorphKey
  /** explicit starting shape (else: morph from wherever the orb currently is) */
  morphFrom?: MorphKey
  /** drive the morph by scroll progress (0→1) instead of auto-completing to 1 */
  morphByProgress?: boolean
  /** target overall scale */
  scale: number
  /** target world-space offset (camera @ z=6, fov45 → visible half-height ≈ 2.45) */
  x: number
  y: number
  /** target visibility 0→1 (0 = hidden, e.g. MIRROR is about the visitor) */
  alpha: number
  /** brightness multiplier (dims ORIGIN's "single light in a dark room") */
  intensity: number
  /** y-axis spin speed (rad/s) */
  spin: number
  /** FOUR BRAINS: cycle the orb hue through the 4 department colors by progress */
  colorCycle?: boolean
  /** DOOR: scale grows with scroll progress — the dolly into the intelligence */
  dolly?: boolean
}

const C = (n: number) => n // tiny alias for readability of the table below

export const SCENE_ORB: OrbDirective[] = [
  // 0 MEET — perfect sphere, centered, the resting intelligence
  { morphTo: 'sphere', scale: C(1.0), x: 0, y: 0, alpha: 1, intensity: 1, spin: 0.03 },
  // 1 ORIGIN — sphere contracts small + dims, upper-right (a single light, dark room)
  { morphTo: 'sphere', scale: 0.46, x: 2.35, y: 1.18, alpha: 0.92, intensity: 0.62, spin: 0.02 },
  // 2 MIRROR — hidden (this scene is about the visitor, not OMEGA)
  { morphTo: 'sphere', scale: 0.5, x: 0, y: 0, alpha: 0, intensity: 0.4, spin: 0.02 },
  // 3 SHIFT — re-forms from scattered particles → sphere, driven by scroll
  { morphTo: 'sphere', morphFrom: 'scatter', morphByProgress: true, scale: 1.0, x: 0, y: 0, alpha: 1, intensity: 1, spin: 0.04 },
  // 4 FOUR BRAINS — neural mesh, centered, rotating, hue cycles teal→ocean→indigo→amber
  { morphTo: 'mesh', scale: 1.08, x: 0, y: 0, alpha: 1, intensity: 1.05, spin: 0.16, colorCycle: true },
  // 5 LIVE FEED — directed streams, slightly back so the columns read
  { morphTo: 'streams', scale: 0.98, x: 0, y: 0, alpha: 0.92, intensity: 1.0, spin: 0.05 },
  // 6 A DAY — sphere, pulsing calmly (watching over), slightly smaller
  { morphTo: 'sphere', scale: 0.9, x: 0, y: 0.1, alpha: 1, intensity: 0.95, spin: 0.025 },
  // 7 PROOF — sphere, dark particles on white, upper-right so stats own the left
  { morphTo: 'sphere', scale: 0.72, x: 1.85, y: 0.75, alpha: 1, intensity: 1, spin: 0.03 },
  // 8 EXHALE — sphere, slow breathing (peace)
  { morphTo: 'sphere', scale: 0.96, x: 0, y: 0, alpha: 1, intensity: 0.9, spin: 0.02 },
  // 9 CHOICE — small, top, watching over the pricing (clear of the headline)
  { morphTo: 'sphere', scale: 0.34, x: 0, y: 2.05, alpha: 1, intensity: 1, spin: 0.03 },
  // 10 DOOR — sphere scales UP toward camera (you enter the intelligence)
  { morphTo: 'sphere', scale: 1.0, x: 0, y: 0, alpha: 1, intensity: 1, spin: 0.04, dolly: true },
]

/** FOUR BRAINS department hues (sRGB→linear), cycled across scene progress. */
export const DEPT_COLORS: THREE.Color[] = [
  new THREE.Color('#2DD4BF').convertSRGBToLinear(), // Sales — teal
  new THREE.Color('#38BDF8').convertSRGBToLinear(), // Marketing — ocean
  new THREE.Color('#818CF8').convertSRGBToLinear(), // HR — indigo
  new THREE.Color('#FBBF24').convertSRGBToLinear(), // Ops — amber
]

/** Resolve a directive for any scene index (clamped). */
export function orbForScene(index: number): OrbDirective {
  return SCENE_ORB[Math.max(0, Math.min(index, SCENE_ORB.length - 1))]
}
