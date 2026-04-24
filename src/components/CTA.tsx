import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { navigateToDemo } from '../utils/tracking'
import { usePrefersReducedMotion } from '../utils/animations'

/* ─── Magnetic button — moves toward cursor ─── */
function MagneticButton({
  children,
  onClick,
  primary = false,
}: {
  children: React.ReactNode
  onClick: () => void
  primary?: boolean
}) {
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
        background: primary
          ? 'linear-gradient(135deg, #00F0FF, #0ACF83)'
          : 'transparent',
        color: primary ? '#020008' : 'rgba(255,255,255,0.7)',
        border: primary ? 'none' : '1px solid rgba(240,235,248,0.12)',
        transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.25s',
        boxShadow: primary ? '0 0 40px rgba(0,240,255,0.2)' : 'none',
        willChange: 'transform',
      }}
    >
      {children}
    </button>
  )
}

/* ─── Floating particles — simple CSS drift ─── */
function FloatingParticles({ count = 35 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => i)
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((i) => {
        const delay = (i * 0.37) % 8
        const duration = 10 + (i % 6)
        const left = (i * 4621) % 100
        const top = (i * 7331) % 100
        const size = 1 + (i % 3)
        const color = i % 3 === 0 ? '#00F0FF' : i % 3 === 1 ? '#0ACF83' : '#7B61FF'
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: color,
              opacity: 0.35,
              boxShadow: `0 0 ${size * 4}px ${color}`,
              animation: `ctaDrift ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        )
      })}
      <style>{`
        @keyframes ctaDrift {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(20px, -30px); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

/* ─── Text reveal — letter-by-letter ─── */
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
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: delay + wi * 0.05, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            style={{ display: 'inline-block' }}
          >
            {word}{wi < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export default function CTA() {
  const [screenWidth, setScreenWidth] = useState(1024)
  useEffect(() => {
    const check = () => setScreenWidth(window.innerWidth)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const isMobile = screenWidth < 768

  return (
    <section
      className="relative overflow-hidden"
      style={{
        zIndex: 2,
        padding: '10rem 0',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 50%, rgba(10,207,131,0.04) 0%, transparent 60%),
          linear-gradient(180deg, transparent 0%, rgba(10,10,14,0.6) 40%, rgba(10,10,14,0.6) 60%, transparent 100%)
        `,
      }}
    >
      {/* Spotlight glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Floating particles */}
      {!isMobile && <FloatingParticles count={35} />}

      <div className="relative z-10 max-w-[820px] mx-auto text-center px-6 md:px-12">
        <h2
          className="font-[800] leading-[1.05] mb-8"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.03em' }}
        >
          <RevealText text="Stop managing software." className="block text-text" />
          <RevealText
            text="Let it manage itself."
            delay={0.3}
            className="block gradient-text"
            style={{ textShadow: '0 0 60px rgba(0,240,255,0.25)' }}
          />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.7, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="text-base md:text-lg max-w-[540px] mx-auto mb-12"
          style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}
        >
          Join the companies replacing their entire tech stack with a single
          autonomous intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.95, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
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
