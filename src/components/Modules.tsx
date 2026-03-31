import { useState, useRef, useEffect } from 'react'
import RevealOnScroll from './RevealOnScroll'

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
    icon: '⚡',
    description:
      'From stranger to paying customer — fully automated. AI enrichment, behavioral scoring, 6-channel sequencing, reply detection, deal closure.',
    subtitle: 'From stranger to revenue — zero human intervention',
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
    description:
      'Content, campaigns, and competitor intelligence — all running autonomously. AI ad generation, video retargeting, social warfare.',
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
    description:
      'Hire, onboard, and manage — without HR. Employee profiles, AI recruitment, org automation, leave management.',
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
    description:
      'Voice AI receptionist, document intelligence, supply chain optimization, real-time business analytics.',
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
  mod,
  index,
  expanded,
  onToggle,
  anyExpanded,
}: {
  mod: ModuleData
  index: number
  expanded: boolean
  onToggle: () => void
  anyExpanded: boolean
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [expanded])

  const dimmed = anyExpanded && !expanded

  return (
    <RevealOnScroll delay={index * 0.1}>
      <div
        onClick={onToggle}
        className="group relative rounded-xl transition-all duration-500 cursor-pointer"
        style={{
          padding: '2rem',
          background: expanded
            ? 'linear-gradient(135deg, rgba(0,240,255,0.04) 0%, rgba(240,235,248,0.03) 100%)'
            : 'rgba(240, 235, 248, 0.03)',
          border: expanded
            ? '1px solid rgba(0,240,255,0.2)'
            : '1px solid rgba(240, 235, 248, 0.06)',
          borderLeft: expanded ? '3px solid #00F0FF' : undefined,
          boxShadow: expanded
            ? '0 0 50px rgba(0,240,255,0.06)'
            : 'none',
          opacity: dimmed ? 0.45 : 1,
          transform: dimmed ? 'scale(0.98)' : expanded ? 'scale(1)' : undefined,
        }}
      >
        {/* Top gradient line on hover (only when not expanded) */}
        {!expanded && (
          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(90deg, #00F0FF, #0ACF83, #7B61FF)',
            }}
          />
        )}

        {/* Hover glow (only when not expanded) */}
        {!expanded && (
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              boxShadow:
                '0 0 40px rgba(0, 240, 255, 0.08), inset 0 0 40px rgba(0, 240, 255, 0.02)',
            }}
          />
        )}

        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl mb-4">{mod.icon}</div>
              <h3 className="text-lg font-heading font-bold text-text mb-2">
                {mod.title}
              </h3>
            </div>
            {/* Expand indicator */}
            <div
              className="text-text-muted transition-transform duration-300 mt-1"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Collapsed description */}
          {!expanded && (
            <p className="text-sm text-text-muted leading-relaxed">
              {mod.description}
            </p>
          )}

          {/* Expanded content */}
          <div
            style={{
              maxHeight: expanded ? `${contentHeight}px` : '0px',
              overflow: 'hidden',
              transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div ref={contentRef}>
              <p className="text-sm text-text-muted mb-5 leading-relaxed italic">
                {mod.subtitle}
              </p>

              <ul className="space-y-3 mb-6">
                {mod.capabilities.map((cap, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <span
                      className="mt-[7px] flex-shrink-0 rounded-full"
                      style={{
                        width: 6,
                        height: 6,
                        background: '#0ACF83',
                      }}
                    />
                    <span className="leading-relaxed">{cap}</span>
                  </li>
                ))}
              </ul>

              <div
                className="pt-4"
                style={{ borderTop: '1px solid rgba(240,235,248,0.06)' }}
              >
                <p className="text-xs font-mono text-cyan tracking-wide leading-relaxed">
                  {mod.stat}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  )
}

export default function Modules() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="modules" className="relative" style={{ zIndex: 2, padding: '6rem 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <RevealOnScroll>
          <div className="text-center" style={{ marginBottom: '1.5rem' }}>
            <span className="text-xs font-mono tracking-[0.15em] text-cyan mb-4 block">
              // Core Modules
            </span>
            <h2 className="text-3xl md:text-5xl font-[800] text-text">
              Four brains.{' '}
              <span className="gradient-text">One mind.</span>
            </h2>
            <p className="text-sm text-text-muted mt-3">
              Click any module to explore its AI capabilities
            </p>
          </div>
        </RevealOnScroll>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: '1.5rem', marginTop: '2.5rem' }}
        >
          {modules.map((mod, i) => (
            <ModuleCard
              key={mod.title}
              mod={mod}
              index={i}
              expanded={expandedIndex === i}
              onToggle={() => handleToggle(i)}
              anyExpanded={expandedIndex !== null}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
