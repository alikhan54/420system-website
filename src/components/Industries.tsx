import RevealOnScroll from './RevealOnScroll'

const industries = [
  {
    title: 'Hospitality & Restaurant',
    description:
      'Automated reservations, AI-powered guest management, kitchen optimization, review response AI, and intelligent upselling across every touchpoint.',
  },
  {
    title: 'Banking & Financial Services',
    description:
      'Risk assessment AI, automated compliance monitoring, fraud detection, customer onboarding automation, and intelligent portfolio management.',
  },
  {
    title: 'Healthcare & Aesthetics',
    description:
      'Patient intake automation, appointment scheduling AI, treatment plan optimization, insurance processing, and personalized follow-up sequences.',
  },
  {
    title: 'Construction & Estimation',
    description:
      'AI-powered cost estimation, project timeline automation, subcontractor management, material optimization, and real-time budget tracking.',
  },
  {
    title: 'Technology & SaaS',
    description:
      'Automated lead scoring, product-led growth optimization, churn prediction AI, developer documentation, and intelligent customer success.',
  },
  {
    title: 'Real Estate & Property',
    description:
      'Property matching AI, automated valuations, tenant screening, lease management automation, and intelligent market analysis.',
  },
]

export default function Industries() {
  return (
    <section id="industries" className="relative" style={{ zIndex: 2, padding: '6rem 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <RevealOnScroll>
          <div className="text-center" style={{ marginBottom: '1.5rem' }}>
            <span className="text-xs font-mono tracking-[0.15em] text-cyan mb-4 block">
              // Multi-Industry
            </span>
            <h2 className="font-[800] text-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              One Platform. Every Industry.
              <br />
              <span className="gradient-text">Infinite Possibilities.</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
          {industries.map((ind, i) => (
            <RevealOnScroll key={ind.title} delay={i * 0.08}>
              <div
                className="group rounded-xl transition-all duration-500 hover:-translate-y-1"
                style={{
                  padding: '2rem',
                  background: 'rgba(240, 235, 248, 0.03)',
                  border: '1px solid rgba(240, 235, 248, 0.06)',
                }}
              >
                <h3 className="text-base font-heading font-bold text-emerald mb-3">
                  {ind.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {ind.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
