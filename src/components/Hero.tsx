import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { navigateToDemo } from '../utils/tracking'
import { useInView, useCountUp, usePrefersReducedMotion } from '../utils/animations'
import VideoBackground from './VideoBackground'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* Animated stat with count-up */
function AnimatedStat({ value, label, suffix = '', prefix = '' }: {
  value: number; label: string; suffix?: string; prefix?: string
}) {
  const { ref, inView } = useInView(0.5)
  const count = useCountUp(value, inView)
  return (
    <div ref={ref} className="text-center">
      <div className="font-heading font-bold" style={{ color: '#F0F0F5', fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums' }}>
        {prefix}{count}{suffix}
      </div>
      <div className="text-xs mt-1" style={{ color: '#4A4F58', letterSpacing: '0.1em' }}>{label}</div>
    </div>
  )
}

/* Scroll indicator */
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ delay: 2.6, duration: 0.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <span className="text-[10px] font-mono tracking-[0.4em] uppercase" style={{ color: '#4A4F58' }}>
        Scroll
      </span>
      <motion.svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#00D4AA" strokeWidth="1.5"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M6 9l6 6 6-6" />
      </motion.svg>
    </motion.div>
  )
}

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const [, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const titleAnim = (delay: number, withGlow = false) => ({
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      ...(withGlow && {
        textShadow: [
          '0 0 0px rgba(0,212,170,0)',
          '0 0 80px rgba(0,212,170,0.7)',
          '0 0 40px rgba(0,212,170,0.3)',
        ],
      }),
    },
    transition: {
      delay: reducedMotion ? 0 : delay,
      duration: reducedMotion ? 0.01 : 0.7,
      ease: EASE,
      ...(withGlow && {
        textShadow: { delay: delay + 0.3, duration: 1.4, times: [0, 0.4, 1] },
      }),
    },
  })

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reducedMotion ? 0 : delay, duration: reducedMotion ? 0.01 : 0.6, ease: EASE },
  })

  return (
    <section
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh', padding: '6rem 1.5rem 4rem' }}
    >
      {/* Video background */}
      <VideoBackground src="/videos/hero-bg.mp4" opacity={0.4} />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center" style={{ zIndex: 10, maxWidth: 900, gap: '2rem' }}>
        {/* Label */}
        <motion.div {...fadeIn(0.3)} className="flex items-center justify-center gap-3">
          <div className="h-px w-8" style={{ background: 'rgba(0,212,170,0.3)' }} />
          <span
            className="text-[11px] font-mono uppercase"
            style={{ color: '#00D4AA', letterSpacing: '0.4em' }}
          >
            Autonomous AI Platform
          </span>
          <div className="h-px w-8" style={{ background: 'rgba(0,212,170,0.3)' }} />
        </motion.div>

        {/* Title */}
        <h1
          className="font-[800]"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
        >
          <motion.span {...titleAnim(0.6)} className="block" style={{ color: '#F0F0F5' }}>
            One System.
          </motion.span>
          <motion.span
            {...titleAnim(0.9, true)}
            className="block gradient-text"
            style={{ display: 'inline-block' }}
          >
            Every Department.
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          {...fadeIn(1.2)}
          className="max-w-[600px] mx-auto"
          style={{ color: '#8A8F98', fontSize: '1.1rem', lineHeight: 1.7 }}
        >
          Sales, marketing, HR, and operations &mdash; all managed by AI that thinks, decides, and executes.
        </motion.p>

        {/* Buttons */}
        <motion.div
          {...fadeIn(1.6)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => navigateToDemo('hero_start_free_trial')}
            whileHover={{ scale: 1.04, background: '#00E8BB', boxShadow: '0 0 30px rgba(0,212,170,0.35)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-lg font-medium text-sm cursor-pointer border-none"
            style={{ background: '#00D4AA', color: '#050505', transition: 'background 0.2s' }}
          >
            Start Free Trial
          </motion.button>
          <motion.button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ borderColor: '#00D4AA', color: '#F0F0F5' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-lg font-medium text-sm cursor-pointer bg-transparent"
            style={{ color: '#8A8F98', border: '1px solid #2A2A38' }}
          >
            See the Architecture
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeIn(2.0)}
          className="flex items-center justify-center flex-wrap"
          style={{ gap: '2.5rem' }}
        >
          <AnimatedStat value={6} label="INDUSTRIES" />
          <div className="w-px h-8 hidden sm:block" style={{ background: '#1A1A24' }} />
          <AnimatedStat value={100} label="AUTONOMOUS" suffix="%" />
          <div className="w-px h-8 hidden sm:block" style={{ background: '#1A1A24' }} />
          <AnimatedStat value={0} label="MANUAL LABOR" prefix="$" />
          <div className="w-px h-8 hidden sm:block" style={{ background: '#1A1A24' }} />
          <AnimatedStat value={24} label="AI OPERATIONS" suffix="/7" />
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
