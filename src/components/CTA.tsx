import { useRef } from 'react'
import { motion } from 'framer-motion'
import { navigateToDemo } from '../utils/tracking'
import { usePrefersReducedMotion } from '../utils/animations'
import ScrubVideoScene from './ScrubVideoScene'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* Letter-by-letter reveal */
function RevealText({ text, delay = 0, className, style }: {
  text: string
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const words = text.split(' ')
  return (
    <span className={className} style={style}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <motion.span
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: delay + wi * 0.05, duration: 0.7, ease: EASE }}
            style={{ display: 'inline-block' }}
          >
            {word}{wi < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* Magnetic button */
function MagneticButton({
  children, onClick, primary = false,
}: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`
  }
  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)'
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="px-10 py-4 rounded-lg font-medium text-base cursor-pointer border-none"
      style={{
        background: primary ? '#00D4AA' : 'transparent',
        color: primary ? '#050505' : '#8A8F98',
        border: primary ? 'none' : '1px solid #2A2A38',
        transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.25s, background 0.25s',
        boxShadow: primary ? '0 0 40px rgba(0,212,170,0.25)' : 'none',
        willChange: 'transform',
      }}
    >
      {children}
    </button>
  )
}

export default function CTA() {
  return (
    <ScrubVideoScene
      src="/videos/cta-bg.mp4"
      height="160vh"
      opacity={0.5}
      overlay="radial-gradient(ellipse 80% 60% at 50% 50%, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.92) 70%)"
    >
      <div className="relative z-10 max-w-[820px] mx-auto text-center px-6 md:px-12 w-full">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span
            className="text-[11px] font-mono uppercase"
            style={{ color: '#00D4AA', letterSpacing: '0.4em' }}
          >
            // The Decision
          </span>
        </motion.div>

        <h2
          className="font-[800] mb-8"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
        >
          <RevealText text="Ready to see what" className="block" style={{ color: '#F0F0F5' }} />
          <RevealText
            text="autonomy looks like?"
            delay={0.25}
            className="block gradient-text"
            style={{ textShadow: '0 0 60px rgba(0,212,170,0.25)' }}
          />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
          className="text-base md:text-lg max-w-[540px] mx-auto mb-12"
          style={{ color: '#8A8F98', lineHeight: 1.8 }}
        >
          Join the companies replacing their entire tech stack with a single autonomous intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.95, duration: 0.5, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton onClick={() => navigateToDemo('cta_request_early_access')} primary>
            Request Early Access
          </MagneticButton>
          <MagneticButton onClick={() => navigateToDemo('cta_book_demo')}>
            Book a Demo
          </MagneticButton>
        </motion.div>

        {/* Live AI — talk to it now */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 1.15, duration: 0.6, ease: EASE }}
          style={{ marginTop: '3rem' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              background: 'rgba(0, 212, 170, 0.08)',
              border: '1px solid rgba(0, 212, 170, 0.3)',
              borderRadius: 12,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#00D4AA',
                boxShadow: '0 0 12px rgba(0,212,170,0.8)',
                animation: 'livePulse 1.6s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#00D4AA',
              }}
            >
              Live · AI Receptionist
            </span>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <p
              style={{
                color: '#8A8F98',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                marginBottom: '0.75rem',
              }}
            >
              Skip the form. Talk to our AI receptionist now &mdash; it books demos, qualifies leads, and answers in 6 languages, 24/7.
            </p>
            <a
              href="tel:+14048192917"
              onClick={() => navigateToDemo('cta_call_ai')}
              style={{
                display: 'inline-block',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                fontFamily: 'monospace',
                color: '#F0F0F5',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                textShadow: '0 0 30px rgba(0,212,170,0.25)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#00D4AA')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#F0F0F5')}
            >
              +1 (404) 819-2917
            </a>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#4A4F58' }}>
              Tap to call &middot; powered by The 420 System
            </p>
          </div>

          <style>{`
            @keyframes livePulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,170,0.5); transform: scale(1); }
              50% { box-shadow: 0 0 0 12px rgba(0,212,170,0); transform: scale(1.15); }
            }
          `}</style>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-8 text-sm font-mono"
          style={{ color: '#4A4F58', letterSpacing: '0.1em' }}
        >
          Starting at $199/month
        </motion.p>
      </div>
    </ScrubVideoScene>
  )
}
