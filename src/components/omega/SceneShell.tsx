/**
 * SceneShell.tsx — one scroll scene. Proves the engine in all four modes:
 *   normal       · index/progress register + entrance reveal
 *   pin          · pinned section, scrubbed fill (scale/opacity)
 *   horizontal   · pinned section, horizontal panel track + snap
 *   time-scrub   · pinned section, scroll scrubs a paused crossfade timeline
 *
 * Each scene also (a) writes the scene authority (sceneState.index/progress —
 * a ref, never React state), (b) calls onActivate for the DOM indicator, and
 * (c) crossfades the page atmosphere by setting the registered @property color
 * vars (the CSS transition does the smoothing; reduced-motion → instant cut).
 *
 * Phase 1 = placeholders only: no real copy, no visuals beyond the persistent orb.
 */
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsapSetup'
import { sceneState } from '../../lib/sceneState'
import { PALETTES, type OmegaScene, type Palette } from '../../design/scenePalette'

/** crossfade the page atmosphere — set the registered @property color vars,
 *  cross-fade the Dawn gradient layer, and pulse the orb's transition energy. */
function setAtmosphere(p: Palette) {
  const root = document.documentElement
  root.style.setProperty('--scene-bg', p.bg)
  root.style.setProperty('--scene-accent', p.hex)
  root.style.setProperty('--scene-glow', p.glow)
  // Dawn = "the gradient is the hero" → fade in a dedicated multi-stop layer.
  if (p.gradient) {
    root.style.setProperty('--scene-gradient', p.gradient)
    root.dataset.dawn = '1'
  } else {
    root.dataset.dawn = ''
  }
  // brighten the sphere on each scene cut (decayed back to 0 inside the orb).
  sceneState.transitioning = 1
}

const HPANELS = ['Ingest', 'Distribute', 'Execute', 'Reconcile']
const FRAMES = ['Signal', 'Resolve', 'Reveal']

function num(i: number) {
  return String(i + 1).padStart(2, '0')
}

/** palette-aware legibility plate (replaces fragile mix-blend-difference on copy). */
function plate(light?: boolean): React.CSSProperties {
  return {
    background: light ? 'rgba(244,246,248,0.5)' : 'rgba(5,6,10,0.42)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--radius-card)',
    padding: '2rem clamp(1.5rem, 4vw, 3rem)',
  }
}
const ink = (light?: boolean) => (light ? '#0C0F18' : '#EAF0F4')

function SceneCard({ scene, palette }: { scene: OmegaScene; palette: Palette }) {
  const fg = ink(palette.light)
  return (
    <div className="relative z-10 max-w-2xl mx-6 text-center" style={plate(palette.light)}>
      <p className="u-kicker mb-5" style={{ color: palette.hex }}>
        ACT {scene.act} · {palette.name}
      </p>
      <h2 className="u-h1" style={{ color: fg }}>{scene.name}</h2>
      <p className="u-kicker mt-6" style={{ color: fg, opacity: 0.6 }}>
        SCENE {num(scene.index)} — {scene.name.toUpperCase()} (placeholder)
      </p>
      <p className="u-kicker mt-2" style={{ color: fg, opacity: 0.4 }}>mode · {scene.mode}</p>
    </div>
  )
}

export interface SceneShellProps {
  scene: OmegaScene
  onActivate: (scene: OmegaScene) => void
}

export function SceneShell({ scene, onActivate }: SceneShellProps) {
  const rootRef = useRef<HTMLElement>(null)
  const palette = PALETTES[scene.paletteKey]

  useGSAP(
    () => {
      const root = rootRef.current!
      const onToggle = (self: ScrollTrigger) => {
        if (self.isActive) {
          sceneState.index = scene.index
          sceneState.progress = self.progress // seed now → no dead-zone freeze on handoff
          onActivate(scene)
          setAtmosphere(palette)
        }
      }
      const onUpdate = (self: ScrollTrigger) => {
        if (sceneState.index === scene.index) sceneState.progress = self.progress
      }

      // (1) ACTIVATION — one CENTER-based trigger for EVERY scene. Center ranges tile
      //     contiguously across normal AND pinned sections (the pin-spacer is part of
      //     the section's scroll footprint), so exactly one scene is always active —
      //     eliminating the dead-zone gaps that a mix of top-based pins + center-based
      //     normals would leave. Owns index/progress + atmosphere; runs under
      //     reduced-motion too (only the visual animation in (2) is gated).
      ScrollTrigger.create({
        trigger: root,
        start: 'top center',
        end: 'bottom center',
        invalidateOnRefresh: true,
        onToggle,
        onUpdate,
      })

      // (2) ANIMATION — mode-specific, purely visual, gated behind no-preference.
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (scene.mode === 'pin') {
          // pin-hold only — the persistent orb is the SOLE focal circle (the old
          // decorative ring competed with it and bled into adjacent scenes).
          ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: '+=110%',
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          })
        } else if (scene.mode === 'horizontal') {
          const track = root.querySelector('.omega-htrack') as HTMLElement
          const panels = gsap.utils.toArray<HTMLElement>('.omega-hpanel', track)
          // panels are w-screen → measure the scroll distance against window.innerWidth
          // (matches the panel basis; root.clientWidth would desync if padding appears).
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              pin: true,
              scrub: 1,
              end: () => '+=' + (track.scrollWidth - window.innerWidth),
              snap: panels.length > 1 ? 1 / (panels.length - 1) : undefined,
              invalidateOnRefresh: true,
            },
          })
        } else if (scene.mode === 'time-scrub') {
          const frames = gsap.utils.toArray<HTMLElement>('.omega-frame', root)
          const tl = gsap.timeline({ paused: true })
          frames.forEach((f, i) => {
            if (i === 0) return
            tl.to(frames[i - 1], { opacity: 0, scale: 1.18, ease: 'none' }, i - 1)
            tl.to(f, { opacity: 1, ease: 'none' }, '<')
          })
          ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => tl.progress(self.progress),
          })
        } else {
          // normal — entrance reveal only
          gsap.from(root.querySelector('.omega-card-inner'), {
            yPercent: 40,
            opacity: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: root, start: 'top 80%', once: true },
          })
        }
      })
    },
    { scope: rootRef, dependencies: [scene.index] },
  )

  // ----- per-mode markup (placeholders only) -----
  if (scene.mode === 'horizontal') {
    return (
      <section ref={rootRef} data-scene={palette.dataScene} className="omega-scene relative h-screen overflow-hidden">
        <div className="omega-htrack flex h-full w-max">
          <div className="omega-hpanel w-screen h-full grid place-items-center shrink-0">
            <SceneCard scene={scene} palette={palette} />
          </div>
          {HPANELS.map((label, i) => (
            <div key={label} className="omega-hpanel w-screen h-full grid place-items-center shrink-0">
              <div className="omega-card-inner text-center mx-6" style={plate(palette.light)}>
                <p className="u-kicker" style={{ color: 'var(--scene-accent)', opacity: 0.7 }}>PANEL {num(i)}</p>
                <h3 className="u-h1" style={{ fontSize: 'var(--text-h2)', color: ink(palette.light) }}>{label}</h3>
                <p className="u-kicker mt-3" style={{ color: ink(palette.light), opacity: 0.4 }}>horizontal-pin · placeholder</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (scene.mode === 'time-scrub') {
    return (
      <section ref={rootRef} data-scene={palette.dataScene} className="omega-scene relative h-screen overflow-hidden grid place-items-center">
        {FRAMES.map((label, i) => (
          <div
            key={label}
            className="omega-frame absolute inset-0 grid place-items-center"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <div className="text-center mx-6" style={plate(palette.light)}>
              <p className="u-kicker" style={{ color: 'var(--scene-accent)', opacity: 0.7 }}>FRAME {num(i)}</p>
              <h3 className="u-h1" style={{ fontSize: 'var(--text-h2)', color: ink(palette.light) }}>{label}</h3>
            </div>
          </div>
        ))}
        <div className="omega-card-inner relative z-10">
          <SceneCard scene={scene} palette={palette} />
        </div>
      </section>
    )
  }

  if (scene.mode === 'pin') {
    return (
      <section ref={rootRef} data-scene={palette.dataScene} className="omega-scene relative h-screen overflow-hidden grid place-items-center">
        <div className="omega-card-inner">
          <SceneCard scene={scene} palette={palette} />
        </div>
      </section>
    )
  }

  // normal
  return (
    <section ref={rootRef} data-scene={palette.dataScene} className="omega-scene relative min-h-screen grid place-items-center py-24">
      <div className="omega-card-inner">
        <SceneCard scene={scene} palette={palette} />
      </div>
    </section>
  )
}
