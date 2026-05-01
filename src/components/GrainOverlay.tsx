/**
 * Grain texture overlay — fixed, pointer-events: none, mix-blend-mode overlay.
 * Uses inline SVG noise filter so no external assets needed.
 */
export default function GrainOverlay() {
  const grainSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#n)"/>
    </svg>`
  )

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9997,
        opacity: 0.025,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,${grainSvg}")`,
      }}
    />
  )
}
