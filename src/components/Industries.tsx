import { useRef } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../utils/animations'

const industries = [
  {
    title: 'Hospitality & Restaurant',
    description: 'Automated reservations, AI-powered guest management, kitchen optimization, review response AI, and intelligent upselling across every touchpoint.',
    gradient: 'linear-gradient(180deg, #F59E0B 0%, #FBBF24 100%)',
    glow: 'rgba(245, 158, 11, 0.18)',
  },
  {
    title: 'Banking & Financial Services',
    description: 'Risk assessment AI, automated compliance monitoring, fraud detection, customer onboarding automation, and intelligent portfolio management.',
    gradient: 'linear-gradient(180deg, #00B4D8 0%, #4DC8E0 100%)',
    glow: 'rgba(0, 180, 216, 0.18)',
  },
  {
    title: 'Healthcare & Aesthetics',
    description: 'Patient intake automation, appointment scheduling AI, treatment plan optimization, insurance processing, and personalized follow-up sequences.',
    gradient: 'linear-gradient(180deg, #00D4AA 0%, #3FDFC0 100%)',
    glow: 'rgba(0, 212, 170, 0.18)',
  },
  {
    title: 'Construction & Estimation',
    description: 'AI-powered cost estimation, project timeline automation, subcontractor management, material optimization, and real-time budget tracking.',
    gradient: 'linear-gradient(180deg, #D97706 0%, #F59E0B 100%)',
    glow: 'rgba(217, 119, 6, 0.18)',
  },
  {
    title: 'Technology & SaaS',
    description: 'Automated lead scoring, product-led growth optimization, churn prediction AI, developer documentation, and intelligent customer success.',
    gradient: 'linear-gradient(180deg, #6366F1 0%, #818CF8 100%)',
    glow: 'rgba(99, 102, 241, 0.18)',
  },
  {
    title: 'Real Estate & Property',
    description: 'Property matching AI, automated valuations, tenant screening, lease management automation, and intelligent market analysis.',
    gradient: 'linear-gradient(180deg, #8B5CF6 0%, #A78BFA 100%)',
    glow: 'rgba(139, 92, 246, 0.18)',
  },
]

function IndustryCard({ ind, index }: { ind: typeof industries[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-xl overflow-hidden"
        style={{
          padding: '2rem 2rem 2rem 2.5rem',
          background: '#0A0A0F',
          border: '1px solid #1A1A24',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.2s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
          willChange: 'transform',
        }}
      >
        {/* Industry gradient left border */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: 4,
            background: ind.gradient,
            boxShadow: `0 0 20px ${ind.glow}`,
          }}
        />

        {/* Mouse-follow glow */}
        <div
          className="absolute w-[180px] h-[180px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            top: 'var(--mouse-y, 50%)',
            left: 'var(--mouse-x, 50%)',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${ind.glow} 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          <h3
            className="text-base font-heading font-bold mb-3"
            style={{
              background: ind.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {ind.title}
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: '#8A8F98', lineHeight: 1.8 }}
          >
            {ind.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Industries() {
  return (
    <section
      id="industries"
      style={{
        position: 'relative',
        background: '#050505',
        minHeight: '100vh',
        padding: '8rem 0',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      {/* Scan line — sweeps across once on view */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.5), rgba(0,180,216,0.5), transparent)',
          filter: 'blur(1px)',
          zIndex: 5,
        }}
        initial={{ y: 0, opacity: 0 }}
        whileInView={{
          y: ['0vh', '100vh'],
          opacity: [0, 1, 1, 0],
        }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 2.5, ease: 'easeInOut', times: [0, 0.1, 0.9, 1] }}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative w-full" style={{ zIndex: 2 }}>
        <motion.div
          className="text-center"
          style={{ marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase mb-4 block" style={{ color: '#00D4AA' }}>
            // Multi-Industry
          </span>
          <h2
            className="font-[800]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em', lineHeight: 1.1, color: '#F0F0F5' }}
          >
            One Platform. Every Industry.
            <br />
            <span className="gradient-text">Infinite Possibilities.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem', marginTop: '3rem' }}>
          {industries.map((ind, i) => (
            <IndustryCard key={ind.title} ind={ind} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
