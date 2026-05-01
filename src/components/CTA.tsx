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
            {word}{wi < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* Magnetic button — moves toward cursor */
function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
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
      style={{
        background: '#00D4AA',
        color: '#050505',
        padding: '18px 48px',
        borderRadius: 10,
        fontWeight: 700,
        fontSize: '1.05rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.25s, background 0.25s',
        boxShadow: '0 0 40px rgba(0,212,170,0.3)',
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
      height="140vh"
      opacity={0.45}
      overlay="radial-gradient(ellipse 80% 60% at 50% 50%, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.92) 70%)"
    >
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 820,
          margin: '0 auto',
          textAlign: 'center',
          padding: '0 1.5rem',
          width: '100%',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: '3rem',
          }}
        >
          <RevealText text="Ready to see what" className="block" style={{ color: '#F0F0F5' }} />
          <RevealText
            text="autonomy looks like?"
            delay={0.25}
            className="block gradient-text"
            style={{ textShadow: '0 0 60px rgba(0,212,170,0.25)' }}
          />
        </h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <MagneticButton onClick={() => navigateToDemo('cta_request_access')}>
            Request Access
          </MagneticButton>
        </motion.div>

        {/* Single line phone CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          style={{
            marginTop: '2rem',
            fontSize: '0.9rem',
            color: '#4A4F58',
            letterSpacing: '0.02em',
          }}
        >
          or call{' '}
          <a
            href="tel:+14048192917"
            onClick={() => navigateToDemo('cta_call_ai')}
            style={{
              color: '#8A8F98',
              fontFamily: 'monospace',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00D4AA')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8F98')}
          >
            +1 (404) 819-2917
          </a>
        </motion.p>
      </div>
    </ScrubVideoScene>
  )
}
