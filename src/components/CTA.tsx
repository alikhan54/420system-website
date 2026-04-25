import { useRef } from 'react'
import { motion } from 'framer-motion'
import { navigateToDemo } from '../utils/tracking'
import { usePrefersReducedMotion } from '../utils/animations'
import VideoBackground from './VideoBackground'

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
            {word}{wi < words.length - 1 ? '\u00A0' : ''}
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
    <section
      className="relative overflow-hidden"
      style={{ zIndex: 2, padding: '10rem 0', minHeight: '85vh', display: 'flex', alignItems: 'center' }}
    >
      {/* Video background */}
      <VideoBackground
        src="/videos/cta-bg.mp4"
        opacity={0.3}
        overlayGradient="radial-gradient(ellipse 80% 60% at 50% 50%, rgba(5,5,5,0.65) 0%, rgba(5,5,5,0.92) 70%)"
      />

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
      </div>
    </section>
  )
}
