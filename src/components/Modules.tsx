import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '../utils/animations'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

interface ModuleData {
  title: string
  icon: string
  description: string
  subtitle: string
  capabilities: string[]
  stat: string
  accent: string
}

const modules: ModuleData[] = [
  {
    title: 'Sales Engine',
    icon: '\u26A1',
    description: 'From stranger to paying customer \u2014 fully automated.',
    subtitle: 'From stranger to revenue \u2014 zero human intervention',
    capabilities: [
      'Waterfall lead enrichment across data providers',
      'Behavioral scoring that learns which leads convert',
      '6-channel outreach \u2014 email, WhatsApp, SMS, voice, LinkedIn, Instagram',
      'AI reply detection with sentiment routing',
      'Automated objection handling via voice AI',
    ],
    stat: 'Stranger to booked meeting: 48 hours',
    accent: '#00D4AA',
  },
  {
    title: 'Marketing AI',
    icon: '\uD83D\uDCE1',
    description: 'Content, campaigns, and competitor intelligence \u2014 all running autonomously.',
    subtitle: 'Your entire marketing department in one brain',
    capabilities: [
      'Competitor intelligence across every channel',
      'AI ad creatives using AIDA frameworks',
      'Video content creation and retargeting',
      'Social warfare \u2014 posting, engagement, growth',
      'SEO content optimized for search intent',
    ],
    stat: 'Strategy to publish in minutes',
    accent: '#00B4D8',
  },
  {
    title: 'HR Intelligence',
    icon: '\uD83D\uDC64',
    description: 'Hire, onboard, and manage \u2014 without HR.',
    subtitle: 'Hire, onboard, manage, retain \u2014 without an HR department',
    capabilities: [
      'AI job posting across multiple platforms',
      'Resume screening with cultural fit analysis',
      'Automated interview scheduling',
      'Digital onboarding \u2014 docs, training, equipment',
      'Employee 360\u00B0 profiles with tracking',
    ],
    stat: 'Fully onboarded in 24 hours',
    accent: '#6366F1',
  },
  {
    title: 'Operations Core',
    icon: '\u2699\uFE0F',
    description: 'Voice AI receptionist, document intelligence, supply chain optimization, real-time analytics.',
    subtitle: 'The nervous system that keeps everything running',
    capabilities: [
      'Voice AI receptionist in any language, 24/7',
      'Document intelligence reads PDFs and extracts',
      'Supply chain optimization with predictive inventory',
      'Real-time analytics with daily briefings',
      'Cross-department workflow orchestration',
    ],
    stat: 'Zero downtime. Zero excuses.',
    accent: '#00D4AA',
  },
]

/* Typing capability item — only when card is expanded */
function TypingCapability({ text, delay }: { text: string; delay: number }) {
  const [displayed, setDisplayed] = useState('')
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) { setDisplayed(text); return }
    setDisplayed('')
    const startTimer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, ++i))
        if (i >= text.length) clearInterval(interval)
      }, 8)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(startTimer)
  }, [text, delay, reducedMotion])

  return <span className="leading-relaxed">{displayed}</span>
}

function ModuleCard({
  mod, index, expanded, onToggle, anyExpanded,
}: {
  mod: ModuleData; index: number; expanded: boolean; onToggle: () => void; anyExpanded: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const dimmed = anyExpanded && !expanded

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !cardRef.current || expanded) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: EASE }}
      className="ze-conic-wrapper"
      style={{ position: 'relative', borderRadius: 12 }}
    >
      <div
        ref={cardRef}
        onClick={onToggle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-xl cursor-pointer overflow-hidden h-full"
        style={{
          padding: 'clamp(1.5rem, 2.5vw, 2.25rem)',
          background: '#0A0A0F',
          border: expanded ? `1px solid ${mod.accent}66` : '1px solid #1A1A24',
          borderLeft: expanded ? `3px solid ${mod.accent}` : '1px solid #1A1A24',
          boxShadow: expanded ? `0 0 50px ${mod.accent}22` : 'none',
          opacity: dimmed ? 0.5 : 1,
          transition: 'opacity 0.3s, border 0.3s, box-shadow 0.3s',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 64,
                height: 64,
                background: `radial-gradient(circle, ${mod.accent}22 0%, transparent 70%)`,
                border: `1px solid ${mod.accent}33`,
                fontSize: '2rem',
                boxShadow: `0 0 20px ${mod.accent}1F inset`,
              }}
            >
              {mod.icon}
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ color: '#4A4F58', marginTop: 8 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.div>
          </div>

          <h3
            className="font-heading font-bold mb-2"
            style={{ color: mod.accent, fontSize: '1.35rem', letterSpacing: '-0.01em' }}
          >
            {mod.title}
          </h3>

          <AnimatePresence mode="wait">
            {!expanded ? (
              <motion.p
                key="desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm leading-relaxed"
                style={{ color: '#8A8F98', lineHeight: 1.7 }}
              >
                {mod.description}
              </motion.p>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ overflow: 'hidden' }}
              >
                <p className="text-sm italic mb-5" style={{ color: mod.accent, opacity: 0.85 }}>
                  {mod.subtitle}
                </p>

                <ul className="space-y-2.5 mb-5">
                  {mod.capabilities.map((cap, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: '#8A8F98', lineHeight: 1.65 }}
                    >
                      <span
                        className="mt-[7px] flex-shrink-0 rounded-full"
                        style={{ width: 5, height: 5, background: mod.accent, boxShadow: `0 0 6px ${mod.accent}` }}
                      />
                      <TypingCapability text={cap} delay={i * 180} />
                    </li>
                  ))}
                </ul>

                <div className="pt-4 font-mono text-xs tracking-wide" style={{ color: mod.accent, borderTop: '1px solid #1A1A24' }}>
                  {mod.stat}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default function Modules() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section id="modules" className="relative" style={{ zIndex: 2, padding: '8rem 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="text-[11px] font-mono uppercase mb-3 block"
            style={{ color: '#00D4AA', letterSpacing: '0.3em' }}
          >
            // Core Modules
          </span>
          <h2
            className="font-[800]"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: '#F0F0F5',
            }}
          >
            Four brains. <span style={{ color: '#00D4AA' }}>One mind.</span>
          </h2>
          <p
            className="mt-4 max-w-md mx-auto text-sm"
            style={{ color: '#8A8F98', lineHeight: 1.7 }}
          >
            Click any module to explore its AI capabilities.
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: '1.5rem' }}
        >
          {modules.map((mod, i) => (
            <ModuleCard
              key={mod.title}
              mod={mod}
              index={i}
              expanded={expandedIndex === i}
              onToggle={() => setExpandedIndex(prev => prev === i ? null : i)}
              anyExpanded={expandedIndex !== null}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
