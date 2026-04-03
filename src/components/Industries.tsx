import { useRef } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../utils/animations'

const industries = [
  {
    title: 'Hospitality & Restaurant',
    description: 'Automated reservations, AI-powered guest management, kitchen optimization, review response AI, and intelligent upselling across every touchpoint.',
  },
  {
    title: 'Banking & Financial Services',
    description: 'Risk assessment AI, automated compliance monitoring, fraud detection, customer onboarding automation, and intelligent portfolio management.',
  },
  {
    title: 'Healthcare & Aesthetics',
    description: 'Patient intake automation, appointment scheduling AI, treatment plan optimization, insurance processing, and personalized follow-up sequences.',
  },
  {
    title: 'Construction & Estimation',
    description: 'AI-powered cost estimation, project timeline automation, subcontractor management, material optimization, and real-time budget tracking.',
  },
  {
    title: 'Technology & SaaS',
    description: 'Automated lead scoring, product-led growth optimization, churn prediction AI, developer documentation, and intelligent customer success.',
  },
  {
    title: 'Real Estate & Property',
    description: 'Property matching AI, automated valuations, tenant screening, lease management automation, and intelligent market analysis.',
  },
]

function IndustryCard({ ind, index }: { ind: typeof industries[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group relative rounded-xl overflow-hidden"
        style={{
          padding: '2rem',
          background: 'rgba(240, 235, 248, 0.03)',
        }}
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
      >
        {/* Gradient border effect — visible on hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(10,207,131,0.15), rgba(123,97,255,0.1))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1px',
          }}
        />

        {/* Default border */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none group-hover:opacity-0 transition-opacity duration-300"
          style={{ border: '1px solid rgba(240, 235, 248, 0.06)' }}
        />

        {/* Mouse-follow glow */}
        <div
          className="absolute w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            top: 'var(--mouse-y, 50%)',
            left: 'var(--mouse-x, 50%)',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10">
          <h3 className="text-base font-heading font-bold text-emerald mb-3">{ind.title}</h3>
          <p className="text-sm text-text-muted leading-relaxed">{ind.description}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Industries() {
  return (
    <section id="industries" className="relative" style={{ zIndex: 2, padding: '6rem 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          className="text-center"
          style={{ marginBottom: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-mono tracking-[0.15em] text-cyan mb-4 block">// Multi-Industry</span>
          <h2 className="font-[800] text-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            One Platform. Every Industry.
            <br />
            <span className="gradient-text">Infinite Possibilities.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
          {industries.map((ind, i) => (
            <IndustryCard key={ind.title} ind={ind} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
