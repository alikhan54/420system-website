import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '../utils/animations'

interface ModuleData {
  title: string
  icon: string
  description: string
  subtitle: string
  capabilities: string[]
  stat: string
}

const modules: ModuleData[] = [
  {
    title: 'Sales Engine',
    icon: '\u26A1',
    description: 'From stranger to paying customer \u2014 fully automated. AI enrichment, behavioral scoring, 6-channel sequencing, reply detection, deal closure.',
    subtitle: 'From stranger to revenue \u2014 zero human intervention',
    capabilities: [
      'Waterfall lead enrichment across multiple data intelligence providers',
      'Behavioral scoring that learns which leads convert and which don\u2019t',
      '6-channel personalized outreach \u2014 email, WhatsApp, SMS, voice, LinkedIn, Instagram',
      'AI reply detection that reads sentiment and routes hot leads instantly',
      'Automated objection handling and meeting scheduling via voice AI',
      'Complete deal lifecycle from first touch to signed contract',
    ],
    stat: 'Average time from stranger to booked meeting: 48 hours',
  },
  {
    title: 'Marketing AI',
    icon: '\uD83D\uDCE1',
    description: 'Content, campaigns, and competitor intelligence \u2014 all running autonomously. AI ad generation, video retargeting, social warfare.',
    subtitle: 'Your entire marketing department \u2014 compressed into one brain',
    capabilities: [
      'Competitor intelligence that monitors rivals across every channel in real-time',
      'AI-generated ad creatives using AIDA psychological frameworks',
      'Video content creation and retargeting pipeline',
      'Social media warfare \u2014 automated posting, engagement, and growth campaigns',
      'SEO content generation optimized for search intent',
      'Multi-platform campaign orchestration with autonomous budget allocation',
    ],
    stat: 'Campaigns launch autonomously \u2014 from strategy to publish in minutes',
  },
  {
    title: 'HR Intelligence',
    icon: '\uD83D\uDC64',
    description: 'Hire, onboard, and manage \u2014 without HR. Employee profiles, AI recruitment, org automation, leave management.',
    subtitle: 'Hire, onboard, manage, and retain \u2014 without an HR department',
    capabilities: [
      'AI-powered job posting across multiple platforms simultaneously',
      'Resume screening and candidate scoring with cultural fit analysis',
      'Automated interview scheduling and candidate communication',
      'Digital onboarding workflows \u2014 documents, training, equipment, access',
      'Employee 360\u00B0 profiles with performance tracking',
      'Leave management, org charts, and compliance \u2014 all automated',
    ],
    stat: 'New hire fully onboarded in 24 hours \u2014 not 2 weeks',
  },
  {
    title: 'Operations Core',
    icon: '\u2699\uFE0F',
    description: 'Voice AI receptionist, document intelligence, supply chain optimization, real-time business analytics.',
    subtitle: 'The nervous system that keeps everything running',
    capabilities: [
      'Voice AI receptionist that answers calls in any language, 24/7',
      'Document intelligence \u2014 reads PDFs, extracts data, generates estimates',
      'Supply chain optimization with predictive inventory management',
      'Real-time business analytics with automated daily executive briefings',
      'Cross-department workflow orchestration \u2014 when one acts, all respond',
      'Self-healing systems that detect failures and fix themselves',
    ],
    stat: 'Zero downtime. Zero manual intervention. Zero excuses.',
  },
]

function ModuleCard({
  mod, index, expanded, onToggle, anyExpanded,
}: {
  mod: ModuleData; index: number; expanded: boolean; onToggle: () => void; anyExpanded: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const dimmed = anyExpanded && !expanded

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        ref={cardRef}
        onClick={onToggle}
        onMouseMove={!expanded ? handleMouseMove : undefined}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-xl cursor-pointer"
        style={{
          padding: '2rem',
          background: expanded
            ? 'linear-gradient(135deg, rgba(0,240,255,0.04) 0%, rgba(240,235,248,0.03) 100%)'
            : 'rgba(240, 235, 248, 0.03)',
          border: expanded
            ? '1px solid rgba(0,240,255,0.2)'
            : '1px solid rgba(240, 235, 248, 0.06)',
          borderLeft: expanded ? '3px solid #00F0FF' : undefined,
          boxShadow: expanded ? '0 0 50px rgba(0,240,255,0.06)' : 'none',
          opacity: dimmed ? 0.45 : 1,
          transition: 'opacity 0.3s, border 0.3s, background 0.3s, box-shadow 0.3s',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {!expanded && (
          <>
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(90deg, #00F0FF, #0ACF83, #7B61FF)' }}
            />
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: '0 0 40px rgba(0, 240, 255, 0.08), inset 0 0 40px rgba(0, 240, 255, 0.02)' }}
            />
          </>
        )}

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl mb-4">{mod.icon}</div>
              <h3 className="text-lg font-heading font-bold text-text mb-2">{mod.title}</h3>
            </div>
            <motion.div
              className="text-text-muted mt-1"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {!expanded ? (
              <motion.p
                key="desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-text-muted leading-relaxed"
              >
                {mod.description}
              </motion.p>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: 'hidden' }}
              >
                <p className="text-sm text-text-muted mb-5 leading-relaxed italic">{mod.subtitle}</p>

                <ul className="space-y-3 mb-6">
                  {mod.capabilities.map((cap, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="flex items-start gap-2.5 text-sm text-text-muted"
                    >
                      <span className="mt-[7px] flex-shrink-0 rounded-full" style={{ width: 6, height: 6, background: '#0ACF83' }} />
                      <span className="leading-relaxed">{cap}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="pt-4" style={{ borderTop: '1px solid rgba(240,235,248,0.06)' }}>
                  <p className="text-xs font-mono text-cyan tracking-wide leading-relaxed">{mod.stat}</p>
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
    <section id="modules" className="relative" style={{ zIndex: 2, padding: '6rem 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          className="text-center"
          style={{ marginBottom: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-mono tracking-[0.15em] text-cyan mb-4 block">// Core Modules</span>
          <h2 className="text-3xl md:text-5xl font-[800] text-text">
            Four brains. <span className="gradient-text">One mind.</span>
          </h2>
          <p className="text-sm text-text-muted mt-3">Click any module to explore its AI capabilities</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
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
