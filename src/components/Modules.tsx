import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
    accent: '#00F0FF',
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
    accent: '#0ACF83',
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
    accent: '#7B61FF',
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
    accent: '#00F0FF',
  },
]

export default function Modules() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    if (prefersReduced || isMobile) return

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - window.innerWidth

      gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + distance,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="modules"
      ref={sectionRef}
      className="relative hidden md:block"
      style={{ zIndex: 2 }}
    >
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {/* Pinned header */}
        <div
          className="absolute top-0 left-0 right-0 z-20 pt-16 px-6 text-center pointer-events-none"
        >
          <span className="text-xs font-mono tracking-[0.3em] text-emerald uppercase block mb-3">
            // Core Modules
          </span>
          <h2
            className="font-[800] text-text mx-auto"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Four brains. <span className="gradient-text">One mind.</span>
          </h2>
          <p className="text-sm text-text-muted mt-3">Scroll to traverse each department</p>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            width: '400vw',
            height: '100%',
            willChange: 'transform',
          }}
        >
          {modules.map((mod, i) => (
            <div
              key={mod.title}
              style={{
                width: '100vw',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 6vw',
                paddingTop: '12vh',
              }}
            >
              <div
                className="relative rounded-2xl grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-8 lg:gap-16 items-center"
                style={{
                  width: '100%',
                  maxWidth: 1200,
                  padding: 'clamp(2rem, 4vw, 4rem)',
                  background: `linear-gradient(135deg, ${mod.accent}0A 0%, rgba(240,235,248,0.02) 100%)`,
                  border: `1px solid ${mod.accent}33`,
                  boxShadow: `0 0 80px ${mod.accent}1A, inset 0 0 40px ${mod.accent}08`,
                }}
              >
                {/* Accent index */}
                <div
                  className="absolute top-6 right-8 font-mono text-xs tracking-[0.2em]"
                  style={{ color: mod.accent, opacity: 0.6 }}
                >
                  0{i + 1} / 04
                </div>

                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-2xl"
                  style={{
                    width: 'clamp(120px, 14vw, 180px)',
                    height: 'clamp(120px, 14vw, 180px)',
                    background: `radial-gradient(circle, ${mod.accent}1F 0%, transparent 70%)`,
                    border: `1px solid ${mod.accent}33`,
                    fontSize: 'clamp(3rem, 5vw, 5rem)',
                    boxShadow: `0 0 40px ${mod.accent}2A inset, 0 0 30px ${mod.accent}15`,
                  }}
                >
                  {mod.icon}
                </div>

                {/* Content */}
                <div>
                  <h3
                    className="font-heading font-[800] mb-3"
                    style={{
                      fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                      color: '#F0EBF8',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.05,
                    }}
                  >
                    {mod.title}
                  </h3>
                  <p
                    className="italic mb-6"
                    style={{
                      color: mod.accent,
                      fontSize: 'clamp(1rem, 1.3vw, 1.2rem)',
                      opacity: 0.8,
                    }}
                  >
                    {mod.subtitle}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {mod.capabilities.map((cap, ci) => (
                      <li
                        key={ci}
                        className="flex items-start gap-3 text-sm md:text-base leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        <span
                          className="mt-[8px] flex-shrink-0 rounded-full"
                          style={{
                            width: 6,
                            height: 6,
                            background: mod.accent,
                            boxShadow: `0 0 8px ${mod.accent}`,
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
                      borderTop: `1px solid ${mod.accent}22`,
                    }}
                  >
                    {mod.stat}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {modules.map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 24,
                height: 3,
                background: 'rgba(240,235,248,0.15)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
