/**
 * atmosphere.ts — shared scene-atmosphere control.
 *
 *  - setAtmosphere(p): commit the page to a palette by writing the registered
 *    @property color vars (the CSS transition smooths the crossfade) + the Dawn
 *    gradient layer, and pulse the orb's transition energy.
 *  - triggerFilmCut(): a brief brightness veil on act boundaries — "cut", not
 *    "fade". Gated behind reduced-motion. Operates on the page's #omega-cut div.
 */
import { gsap } from '../../lib/gsapSetup'
import { sceneState } from '../../lib/sceneState'
import type { Palette } from '../../design/scenePalette'

export function setAtmosphere(p: Palette) {
  const root = document.documentElement
  root.style.setProperty('--scene-bg', p.bg)
  root.style.setProperty('--scene-accent', p.hex)
  root.style.setProperty('--scene-glow', p.glow)
  root.style.setProperty('--scene-mid', p.mid)
  if (p.gradient) {
    root.style.setProperty('--scene-gradient', p.gradient)
    root.dataset.dawn = '1'
  } else {
    root.dataset.dawn = ''
  }
  // light scenes (PROOF / CHOICE) → flip the fixed chrome to dark so it stays legible.
  root.dataset.omegaLight = p.light ? '1' : ''
  // brighten the sphere on each scene cut (decayed back to 0 inside the orb).
  sceneState.transitioning = 1
}

/** A short brightness pulse — the film cut at an act boundary. */
export function triggerFilmCut() {
  // read reduced-motion live so a runtime OS-setting toggle is respected
  if (typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const el = document.getElementById('omega-cut')
  if (!el) return
  gsap.killTweensOf(el)
  gsap.fromTo(
    el,
    { opacity: 0.5 },
    { opacity: 0, duration: 0.55, ease: 'power2.out' },
  )
}
