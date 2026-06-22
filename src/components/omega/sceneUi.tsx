/**
 * sceneUi.tsx — small shared primitives for the 11 scenes: the mono eyebrow, the
 * "Talk to OMEGA" CTA (magnetic on desktop, links BRAND.app + tel:BRAND.phone),
 * and legibility helpers. Brand strings come from BRAND / COPY (one-file rename).
 */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsapSetup'
import { BRAND } from '../../config/brand'

export const ink = (light?: boolean) => (light ? '#0C1016' : '#EAF0F4')

/** mono kicker — the scene eyebrow. */
export function Eyebrow({ children, color, className = '' }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <p className={`u-kicker ${className}`} style={{ color: color ?? 'var(--scene-accent)' }}>
      {children}
    </p>
  )
}

const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`

/** The primary CTA used by MEET + DOOR. NOTE: designed for DARK scenes only — the
 *  fill is the scene accent with dark ink. Do not place on the light (white) scenes. */
export function OmegaCTA({ label, light, center }: { label: string; light?: boolean; center?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLAnchorElement>(null)

  useGSAP(
    () => {
      const enabled = matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches
      if (!enabled || !btn.current) return
      const qx = gsap.quickTo(btn.current, 'x', { duration: 0.4, ease: 'power3.out' })
      const qy = gsap.quickTo(btn.current, 'y', { duration: 0.4, ease: 'power3.out' })
      const el = btn.current
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        qx((e.clientX - (r.left + r.width / 2)) * 0.3)
        qy((e.clientY - (r.top + r.height / 2)) * 0.3)
      }
      const leave = () => {
        qx(0)
        qy(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className="flex flex-wrap items-center gap-x-6 gap-y-3" style={{ justifyContent: center ? 'center' : 'flex-start' }}>
      <a
        ref={btn}
        href={BRAND.app}
        target="_blank"
        rel="noreferrer"
        className="omega-cta inline-block will-change-transform"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.95rem',
          letterSpacing: '0.04em',
          padding: '0.95rem 1.8rem',
          borderRadius: 999,
          background: 'var(--scene-accent)',
          color: '#05060A', // dark ink on the bright accent fill (dark-scene CTA)
          textDecoration: 'none',
          boxShadow: '0 0 36px -6px var(--scene-glow)',
        }}
      >
        {label}
      </a>
      <span className="u-kicker" style={{ color: ink(light), opacity: 0.6 }}>
        or call{' '}
        <a href={telHref(BRAND.phone)} style={{ color: 'var(--scene-accent)', textDecoration: 'none' }}>
          {BRAND.phone}
        </a>
      </span>
    </div>
  )
}
