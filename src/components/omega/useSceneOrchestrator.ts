/**
 * useSceneOrchestrator — page-level lifecycle for the cinematic experience.
 *
 *  - flags the route with `data-omega` so the scoped atmosphere CSS applies
 *    (and the existing landing page is left 100% untouched)
 *  - drives the global scroll progress (sceneState.global) via ONE trigger
 *  - refreshes ScrollTrigger once fonts load + after first paint (line boxes shift)
 *
 * Per-scene index/progress + atmosphere are owned by each <SceneShell>; this
 * hook only handles cross-cutting lifecycle.
 */
import { useEffect, type RefObject } from 'react'
import { ScrollTrigger, useGSAP } from '../../lib/gsapSetup'
import { sceneState } from '../../lib/sceneState'

export function useSceneOrchestrator(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = document.documentElement
    el.dataset.omega = '1'

    // CRITICAL: the per-scene pins insert pin-spacers that grow the document AFTER
    // their triggers are created. ScrollTrigger.refresh() must run once that final
    // (pin-expanded) layout settles, or every start/end is computed against the
    // short pre-pin height — compressing the scene ranges and killing the tail.
    // A single early refresh races the pin layout, so refresh across several settle
    // points (double-rAF, a short timeout, and window load for late fonts/canvas).
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
      // reset shared authority so a later mount starts clean
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
        invalidateOnRefresh: true, // recompute against pin-expanded document height
        onUpdate: (self) => {
          sceneState.global = self.progress
        },
      })
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
    },
    { scope: rootRef },
  )
}
