/**
 * useSceneOrchestrator — page-level lifecycle for the cinematic experience.
 *
 *  - flags the route with `data-omega` so the scoped atmosphere CSS applies
 *    (and the existing landing page is left 100% untouched)
 *  - drives the global scroll progress (sceneState.global) via ONE trigger
 *  - refreshes ScrollTrigger once fonts load + after first paint (line boxes shift)
 *  - reconciles the active scene on scrollEnd — self-heals a hard SCROLL JUMP
 *    (scrollbar drag / anchor / browser restore-scroll) that lands inside a pinned
 *    section and would otherwise leave sceneState.index/atmosphere stale until the
 *    next scroll. Normal continuous scrolling is handled by per-scene onToggle;
 *    this only corrects when the two disagree, so it never fights the normal path.
 *
 * Per-scene index/progress + atmosphere are owned by each scene via
 * useSceneActivation; this hook only handles cross-cutting lifecycle.
 */
import { useEffect, type RefObject } from 'react'
import { ScrollTrigger, useGSAP } from '../../lib/gsapSetup'
import { sceneState } from '../../lib/sceneState'
import { setAtmosphere } from './atmosphere'
import { OMEGA_SCENES, PALETTES, type OmegaScene } from '../../design/scenePalette'

export function useSceneOrchestrator(
  rootRef: RefObject<HTMLElement | null>,
  onActivate?: (s: OmegaScene) => void,
) {
  useEffect(() => {
    const el = document.documentElement
    el.dataset.omega = '1'

    // CRITICAL: the per-scene pins insert pin-spacers that grow the document AFTER
    // their triggers are created. ScrollTrigger.refresh() must run once that final
    // (pin-expanded) layout settles, or every start/end is computed against the
    // short pre-pin height — compressing the scene ranges and killing the tail.
    const refresh = () => ScrollTrigger.refresh()
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(refresh)
    })
    const t = setTimeout(refresh, 400)
    window.addEventListener('load', refresh)

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      delete el.dataset.omega
      delete el.dataset.dawn
      delete el.dataset.omegaLight
      sceneState.index = 0
      sceneState.progress = 0
      sceneState.global = 0
      sceneState.transitioning = 0
    }
  }, [])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          sceneState.global = self.progress
        },
      })

      // self-healing reconciler: after any scroll settles, find the scene whose
      // section currently straddles the viewport centre (DOM order = scene index)
      // and force-commit it if the authority disagrees (post-jump correction).
      const reconcile = () => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>('.omega-scene'))
        const mid = window.innerHeight / 2
        let found = -1
        for (let i = 0; i < sections.length; i++) {
          const r = sections[i].getBoundingClientRect()
          if (r.top <= mid && r.bottom > mid) {
            found = i
            break
          }
        }
        if (found < 0 || found === sceneState.index) return
        const scene = OMEGA_SCENES[found]
        if (!scene) return
        sceneState.index = found
        const r = sections[found].getBoundingClientRect()
        sceneState.progress = Math.max(0, Math.min(1, (mid - r.top) / Math.max(1, r.bottom - r.top)))
        setAtmosphere(PALETTES[scene.paletteKey])
        onActivate?.(scene)
      }
      ScrollTrigger.addEventListener('scrollEnd', reconcile)

      document.fonts?.ready.then(() => ScrollTrigger.refresh())

      return () => ScrollTrigger.removeEventListener('scrollEnd', reconcile)
    },
    { scope: rootRef },
  )
}
