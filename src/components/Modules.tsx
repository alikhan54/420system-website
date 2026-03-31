import RevealOnScroll from './RevealOnScroll'

const modules = [
  {
    title: 'Sales Engine',
    description:
      'From stranger to paying customer — fully automated. AI enrichment, behavioral scoring, 6-channel sequencing, reply detection, deal closure.',
    icon: '⚡',
  },
  {
    title: 'Marketing AI',
    description:
      'Content, campaigns, and competitor intelligence — all running autonomously. AI ad generation, video retargeting, social warfare.',
    icon: '📡',
  },
  {
    title: 'HR Intelligence',
    description:
      'Hire, onboard, and manage — without HR. Employee profiles, AI recruitment, org automation, leave management.',
    icon: '👤',
  },
  {
    title: 'Operations Core',
    description:
      'Voice AI receptionist, document intelligence, supply chain optimization, real-time business analytics.',
    icon: '⚙️',
  },
]

function ModuleCard({ title, description, icon, index }: {
  title: string
  description: string
  icon: string
  index: number
}) {
  return (
    <RevealOnScroll delay={index * 0.1}>
      <div
        className="group relative rounded-xl h-full transition-all duration-500 hover:-translate-y-2 cursor-default"
        style={{
          padding: '2rem',
          background: 'rgba(240, 235, 248, 0.03)',
          border: '1px solid rgba(240, 235, 248, 0.06)',
        }}
      >
        {/* Top gradient line on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, #00F0FF, #0ACF83, #7B61FF)',
          }}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: '0 0 40px rgba(0, 240, 255, 0.08), inset 0 0 40px rgba(0, 240, 255, 0.02)',
          }}
        />

        <div className="relative z-10">
          <div className="text-2xl mb-4">{icon}</div>
          <h3 className="text-lg font-heading font-bold text-text mb-3">{title}</h3>
          <p className="text-sm text-text-muted leading-relaxed">{description}</p>
        </div>
      </div>
    </RevealOnScroll>
  )
}

export default function Modules() {
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
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
          {modules.map((mod, i) => (
            <ModuleCard key={mod.title} {...mod} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
