import { motion } from 'framer-motion'

interface ModuleData {
  title: string
  icon: string
  subtitle: string
  capabilities: string[]
  stat: string
  accent: string
}

const modules: ModuleData[] = [
  {
    title: 'Sales Engine',
    icon: '\u26A1',
    subtitle: 'From stranger to revenue \u2014 zero human intervention',
    capabilities: [
      'Waterfall lead enrichment across multiple data providers',
      'Behavioral scoring that learns which leads convert',
      '6-channel outreach \u2014 email, WhatsApp, SMS, voice, LinkedIn, Instagram',
      'AI reply detection with sentiment routing',
      'Automated objection handling via voice AI',
    ],
    stat: 'Average time from stranger to booked meeting: 48 hours',
    accent: '#00D4AA',
  },
  {
    title: 'Marketing AI',
    icon: '\uD83D\uDCE1',
    subtitle: 'Your entire marketing department \u2014 compressed into one brain',
    capabilities: [
      'Competitor intelligence across every channel in real-time',
      'AI ad creatives using AIDA psychological frameworks',
      'Video content creation and retargeting pipeline',
      'Social warfare \u2014 automated posting, engagement, growth',
      'SEO content optimized for search intent',
    ],
    stat: 'Campaigns launch autonomously \u2014 strategy to publish in minutes',
    accent: '#00B4D8',
  },
  {
    title: 'HR Intelligence',
    icon: '\uD83D\uDC64',
    subtitle: 'Hire, onboard, manage, and retain \u2014 without an HR department',
    capabilities: [
      'AI-powered job posting across multiple platforms',
      'Resume screening with cultural fit analysis',
      'Automated interview scheduling and communication',
      'Digital onboarding \u2014 documents, training, equipment',
      'Employee 360\u00B0 profiles with performance tracking',
    ],
    stat: 'New hire fully onboarded in 24 hours \u2014 not 2 weeks',
    accent: '#6366F1',
  },
  {
    title: 'Operations Core',
    icon: '\u2699\uFE0F',
    subtitle: 'The nervous system that keeps everything running',
    capabilities: [
      'Voice AI receptionist in any language, 24/7',
      'Document intelligence \u2014 reads PDFs, generates estimates',
      'Supply chain optimization with predictive inventory',
      'Real-time analytics with daily executive briefings',
      'Cross-department workflow orchestration',
    ],
    stat: 'Zero downtime. Zero manual intervention. Zero excuses.',
    accent: '#00D4AA',
  },
]

function ModuleCard({ mod, index }: { mod: ModuleData; index: number }) {
  const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: EASE }}
      className="relative rounded-2xl"
      style={{
        padding: 'clamp(1.75rem, 3vw, 2.5rem)',
        background: '#0A0A0F',
        border: `1px solid ${mod.accent}33`,
        boxShadow: `0 0 60px ${mod.accent}10`,
      }}
    >
      {/* Index */}
      <div
        className="absolute top-6 right-6 font-mono text-xs tracking-[0.2em]"
        style={{ color: '#4A4F58' }}
      >
        0{index + 1} / 04
      </div>

      <div className="flex items-start gap-5 mb-5">
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 64,
            height: 64,
            background: `radial-gradient(circle, ${mod.accent}1A 0%, transparent 70%)`,
            border: `1px solid ${mod.accent}33`,
            fontSize: '2rem',
            boxShadow: `0 0 20px ${mod.accent}1F inset`,
          }}
        >
          {mod.icon}
        </div>
        <div>
          <h3
            className="font-heading font-[800] mb-1.5"
            style={{
              fontSize: 'clamp(1.25rem, 1.8vw, 1.5rem)',
              color: '#F0F0F5',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
            }}
          >
            {mod.title}
          </h3>
          <p
            className="italic"
            style={{
              color: mod.accent,
              fontSize: '0.875rem',
              opacity: 0.85,
              lineHeight: 1.5,
            }}
          >
            {mod.subtitle}
          </p>
        </div>
      </div>

      <ul className="space-y-2.5 mb-5">
        {mod.capabilities.map((cap, ci) => (
          <li
            key={ci}
            className="flex items-start gap-2.5 text-sm leading-relaxed"
            style={{ color: '#8A8F98', lineHeight: 1.65 }}
          >
            <span
              className="mt-[7px] flex-shrink-0 rounded-full"
              style={{
                width: 5,
                height: 5,
                background: mod.accent,
                boxShadow: `0 0 6px ${mod.accent}`,
              }}
            />
            <span>{cap}</span>
          </li>
        ))}
      </ul>

      <div
        className="pt-4 font-mono text-xs tracking-wide"
        style={{
          color: mod.accent,
          borderTop: '1px solid #1A1A24',
        }}
      >
        {mod.stat}
      </div>
    </motion.div>
  )
}

export default function Modules() {
  return (
    <section id="modules" className="relative" style={{ zIndex: 2, padding: '8rem 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          className="text-center"
          style={{ marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="text-[11px] font-mono tracking-[0.3em] uppercase mb-4 block"
            style={{ color: '#00D4AA' }}
          >
            // Core Modules
          </span>
          <h2
            className="font-[800]"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: '#F0F0F5',
            }}
          >
            Four brains. <span style={{ color: '#00D4AA' }}>One mind.</span>
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: '1.5rem' }}
        >
          {modules.map((mod, i) => (
            <ModuleCard key={mod.title} mod={mod} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
