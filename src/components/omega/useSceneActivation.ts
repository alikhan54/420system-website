/**
 * useSceneActivation — the shared scene-authority wiring every scene calls.
 *
 * Registers ONE center-based ScrollTrigger (top center → bottom center) which:
 *   - writes sceneState.index + within-scene progress (a ref, never React state)
 *   - calls onActivate(scene) so the DOM indicator updates
 *   - commits the scene atmosphere (palette crossfade + orb transition pulse)
 *   - fires the film-cut brightness pulse on act-boundary scenes
 *
 * Center ranges tile contiguously across normal AND pinned sections (the pin
 * spacer is part of the section's scroll footprint), so exactly one scene is
 * always active — no dead-zone gaps. This runs under reduced-motion too; only the
 * per-scene visual animation (declared inside each scene) is gated.
 */
import { useGSAP, ScrollTrigger } from '../../lib/gsapSetup'
import { sceneState } from '../../lib/sceneState'
import { setAtmosphere, triggerFilmCut } from './atmosphere'
import { PALETTES, type OmegaScene } from '../../design/scenePalette'
import type { RefObject } from 'react'

export function useSceneActivation(
  rootRef: RefObject<HTMLElement | null>,
  scene: OmegaScene,
  onActivate: (s: OmegaScene) => void,
) {
  const palette = PALETTES[scene.paletteKey]
  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      ScrollTrigger.create({
        trigger: root,
        start: 'top center',
        end: 'bottom center',
        invalidateOnRefresh: true,
        onToggle: (self) => {
          if (!self.isActive) return
          sceneState.index = scene.index
          sceneState.progress = self.progress // seed now → no dead-zone freeze on handoff
          onActivate(scene)
          setAtmosphere(palette)
          if (scene.actStart) triggerFilmCut()
        },
        onUpdate: (self) => {
          if (sceneState.index === scene.index) sceneState.progress = self.progress
        },
      })
    },
    { scope: rootRef, dependencies: [scene.index] },
  )
}
