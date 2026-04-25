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
      'Waterfall lead enrichment across data providers',
      'Behavioral scoring that learns conversions',
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
    subtitle: 'Hire, onboard, manage, retain \u2014 without HR',
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
    subtitle: 'The nervous system keeping everything running',
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

export default function ModulesMobile() {
  return (
    <section id="modules-mobile" className="relative md:hidden" style={{ zIndex: 2, padding: '6rem 0' }}>
      <div className="max-w-[600px] mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase block mb-3" style={{ color: '#00D4AA' }}>
            // Core Modules
          </span>
          <h2 className="text-3xl font-[800]" style={{ letterSpacing: '-0.02em', color: '#F0F0F5' }}>
            Four brains. <span style={{ color: '#00D4AA' }}>One mind.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative rounded-xl p-6"
              style={{
                background: '#0A0A0F',
                border: `1px solid ${mod.accent}33`,
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: 56,
                    height: 56,
                    background: `${mod.accent}14`,
                    border: `1px solid ${mod.accent}33`,
                    fontSize: '1.75rem',
                  }}
                >
                  {mod.icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-1" style={{ color: '#F0F0F5' }}>{mod.title}</h3>
                  <p className="text-xs italic" style={{ color: mod.accent, opacity: 0.85 }}>
                    {mod.subtitle}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {mod.capabilities.map((cap, ci) => (
                  <li key={ci} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: '#8A8F98' }}>
                    <span
                      className="mt-[7px] flex-shrink-0 rounded-full"
                      style={{ width: 5, height: 5, background: mod.accent }}
                    />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>

              <div
                className="pt-3 font-mono text-[11px] tracking-wide"
                style={{ color: mod.accent, borderTop: '1px solid #1A1A24' }}
              >
                {mod.stat}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
