/**
 * CinematicV4Page.tsx — the 11-scene scaffold (Phase 1: placeholders only).
 *
 * Proves the engine: ONE persistent orchestrator-driven orb (fixed canvas),
 * a scene indicator + scroll progress bar, and 11 <SceneShell> placeholders —
 * one per scene of the 5-act arc — each with its palette atmosphere and scroll
 * mode (normal / pin / horizontal / time-scrub). No real copy or visuals yet.
 */
import { useEffect, useRef, useState } from 'react'
import { OMEGA_SCENES, type OmegaScene } from '../design/scenePalette'
import { SceneShell } from '../components/omega/SceneShell'
import { OMEGACanvas } from '../components/omega/OMEGACanvas'
import { OMEGAOrb } from '../components/omega/OMEGAOrb'
import { AtmosphereOverlay } from '../components/omega/AtmosphereOverlay'
import { useSceneOrchestrator } from '../components/omega/useSceneOrchestrator'
import { BRAND } from '../config/brand'

const pad = (i: number) => String(i + 1).padStart(2, '0')

export default function CinematicV4Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<OmegaScene>(OMEGA_SCENES[0])
  useSceneOrchestrator(rootRef)

  useEffect(() => {
    const prev = document.title
    document.title = `${BRAND.name} — Living System`
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <>
      <AtmosphereOverlay />

      {/* the single persistent orb — fixed, behind the DOM, orchestrator-driven */}
      <OMEGACanvas fixed>
        <OMEGAOrb reactive state="idle" />
      </OMEGACanvas>

      {/* top-left brand mark + back link */}
      <header
        className="fixed top-0 left-0 z-50 flex items-center gap-4 p-6"
        style={{ mixBlendMode: 'difference' }}
      >
        <span className="u-kicker" style={{ color: '#fff' }}>{BRAND.name}</span>
        <a href="/" className="u-kicker opacity-60 hover:opacity-100" style={{ color: '#fff', textDecoration: 'none' }}>
          ← home
        </a>
        <a href="/omega-test" className="u-kicker opacity-60 hover:opacity-100" style={{ color: '#fff', textDecoration: 'none' }}>
          orb test →
        </a>
      </header>

      {/* bottom-left scene indicator */}
      <div className="fixed bottom-0 left-0 z-50 p-6" style={{ mixBlendMode: 'difference' }} aria-live="polite">
        <div className="u-kicker" style={{ color: '#fff' }}>
          <span style={{ fontSize: 'var(--text-lead)' }}>{pad(active.index)}</span>
          <span className="opacity-50"> / {pad(OMEGA_SCENES.length - 1)}</span>
        </div>
        <div className="u-kicker mt-1" style={{ color: '#fff' }}>{active.name}</div>
        <div className="u-kicker opacity-50">ACT {active.act}</div>
      </div>

      {/* the 11 scenes scroll on top of the fixed orb */}
      <main ref={rootRef} className="relative z-10">
        {OMEGA_SCENES.map((scene) => (
          <SceneShell key={scene.index} scene={scene} onActivate={setActive} />
        ))}
      </main>
    </>
  )
}
