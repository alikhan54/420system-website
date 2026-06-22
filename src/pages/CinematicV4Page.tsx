/**
 * CinematicV4Page.tsx — the finished 11-scene cinematic OMEGA story (Phase 2).
 *
 * ONE persistent orchestrator-driven orb (fixed canvas) that morphs sphere →
 * mesh → streams → sphere across the scroll, eleven story scenes layered on top,
 * a site-wide color grade + film cuts, the scene indicator and progress bar.
 * The brand name reads from BRAND so the deferred rename stays a one-file change.
 */
import { useEffect, useRef, useState } from 'react'
import { OMEGA_SCENES, type OmegaScene } from '../design/scenePalette'
import { SCENE_COMPONENTS } from '../components/omega/scenes/registry'
import { OMEGACanvas } from '../components/omega/OMEGACanvas'
import { OMEGAOrb } from '../components/omega/OMEGAOrb'
import { AtmosphereOverlay } from '../components/omega/AtmosphereOverlay'
import { ColorGrade } from '../components/omega/ColorGrade'
import { useSceneOrchestrator } from '../components/omega/useSceneOrchestrator'
import { BRAND } from '../config/brand'

const pad = (i: number) => String(i + 1).padStart(2, '0')

export default function CinematicV4Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<OmegaScene>(OMEGA_SCENES[0])
  useSceneOrchestrator(rootRef, setActive)

  useEffect(() => {
    const prev = document.title
    document.title = `${BRAND.name} — The living system`
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <>
      <AtmosphereOverlay />

      {/* the single persistent, morphing orb — fixed, behind the DOM */}
      <OMEGACanvas fixed>
        <OMEGAOrb reactive state="idle" />
      </OMEGACanvas>

      {/* site-wide color grade + film-cut veil */}
      <ColorGrade />

      {/* top-left brand mark + nav (mix-blend keeps it legible on dark AND white scenes) */}
      <header className="omega-chrome fixed top-0 left-0 z-50 flex items-center gap-4 p-6">
        <span className="u-kicker">{BRAND.name}</span>
        <a href="/" className="u-kicker opacity-60 hover:opacity-100" style={{ textDecoration: 'none' }}>
          ← home
        </a>
        <a href="/omega-test" className="u-kicker opacity-60 hover:opacity-100" style={{ textDecoration: 'none' }}>
          orb test →
        </a>
      </header>

      {/* bottom-left scene indicator */}
      <div className="omega-chrome fixed bottom-0 left-0 z-50 p-6" aria-live="polite">
        <div className="u-kicker">
          <span style={{ fontSize: 'var(--text-lead)' }}>{pad(active.index)}</span>
          <span className="opacity-50"> / {pad(OMEGA_SCENES.length - 1)}</span>
        </div>
        <div className="u-kicker mt-1" style={{ letterSpacing: '0.14em' }}>{active.name}</div>
      </div>

      {/* the 11 scenes scroll on top of the fixed orb */}
      <main ref={rootRef} className="relative z-10">
        {OMEGA_SCENES.map((scene, i) => {
          const Scene = SCENE_COMPONENTS[i]
          return <Scene key={scene.index} scene={scene} onActivate={setActive} />
        })}
      </main>
    </>
  )
}
