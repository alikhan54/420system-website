/**
 * OmegaTestPage.tsx — standalone sphere-verification page (/omega-test).
 *
 * One large reactive <OMEGAOrb> + controls:
 *   - 4 color buttons (the brain colors from the palette)
 *   - distortion slider (morphs the turbulence)
 *   - state toggles (idle / thinking / speaking)
 *   - click counter (orb click → ripple)
 */
import { useEffect, useState } from 'react'
import { OMEGACanvas } from '../components/omega/OMEGACanvas'
import { OMEGAOrb, type OrbState } from '../components/omega/OMEGAOrb'
import { PALETTES } from '../design/scenePalette'
import { BRAND } from '../config/brand'

const COLORS = [
  { label: 'Cyan', hex: PALETTES.home.hex },
  { label: 'Teal', hex: PALETTES.think.particleHex },
  { label: 'Violet', hex: PALETTES.auto.particleHex },
  { label: 'Magenta', hex: PALETTES.synapse.particleHex },
]
const STATES: OrbState[] = ['idle', 'thinking', 'speaking']

const panel: React.CSSProperties = {
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 30,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 18,
  padding: '14px 20px',
  borderRadius: 16,
  background: 'rgba(8,10,16,0.72)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(14px)',
  maxWidth: 'min(92vw, 760px)',
}

const chip = (active: boolean, accent = '#6EE7FF'): React.CSSProperties => ({
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: 12,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  padding: '8px 14px',
  borderRadius: 999,
  cursor: 'pointer',
  color: active ? '#05060A' : '#C7CBD6',
  background: active ? accent : 'transparent',
  border: `1px solid ${active ? accent : 'rgba(255,255,255,0.14)'}`,
  transition: 'all 0.2s ease',
})

export default function OmegaTestPage() {
  const [color, setColor] = useState(COLORS[0].hex)
  const [distortion, setDistortion] = useState(0.25)
  const [state, setState] = useState<OrbState>('idle')
  const [clicks, setClicks] = useState(0)

  useEffect(() => {
    const prev = document.title
    document.title = `${BRAND.name} — Orb Test`
    document.documentElement.style.background = '#05060A'
    return () => {
      document.title = prev
      document.documentElement.style.background = ''
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#05060A', overflow: 'hidden' }}>
      {/* large reactive orb */}
      <OMEGACanvas>
        <OMEGAOrb
          reactive
          color={color}
          distortion={distortion}
          state={state}
          scale={1.25}
          onClick={() => setClicks((c) => c + 1)}
        />
      </OMEGACanvas>

      {/* header */}
      <header style={{ position: 'fixed', top: 0, left: 0, zIndex: 30, padding: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, letterSpacing: '0.3em', color: '#6EE7FF' }}>
          {BRAND.name} · ORB TEST
        </span>
        <a href="/" style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, letterSpacing: '0.2em', color: '#8A8F98', textDecoration: 'none' }}>← home</a>
        <a href="/cinematic-v4" style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, letterSpacing: '0.2em', color: '#8A8F98', textDecoration: 'none' }}>scenes →</a>
      </header>

      {/* hint */}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 30, textAlign: 'right', fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.12em', color: '#4A4F58', lineHeight: 1.8 }}>
        move cursor → gravity recoil<br />click orb → ripple
      </div>

      {/* controls */}
      <div style={panel}>
        {COLORS.map((c) => (
          <button key={c.label} onClick={() => setColor(c.hex)} style={chip(color === c.hex, c.hex)} title={c.hex}>
            {c.label}
          </button>
        ))}

        <span style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.12)' }} />

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.12em', color: '#8A8F98' }}>
          DISTORT
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={distortion}
            onChange={(e) => setDistortion(parseFloat(e.target.value))}
            style={{ accentColor: '#6EE7FF', width: 120 }}
          />
          <span style={{ color: '#C7CBD6', width: 32 }}>{distortion.toFixed(2)}</span>
        </label>

        <span style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.12)' }} />

        {STATES.map((s) => (
          <button key={s} onClick={() => setState(s)} style={chip(state === s)}>
            {s}
          </button>
        ))}

        <span style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.12)' }} />

        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, letterSpacing: '0.12em', color: '#C7CBD6' }}>
          CLICKS · <span style={{ color: '#6EE7FF' }}>{clicks}</span>
        </span>
      </div>
    </div>
  )
}
