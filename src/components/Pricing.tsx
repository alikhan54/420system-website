import { motion } from 'framer-motion'
import { navigateToDemo } from '../utils/tracking'
import { useInView, useCountUp } from '../utils/animations'

const plans = [
  {
    name: 'Starter',
    price: 199,
    period: '/month',
    description: 'For small businesses getting started with AI automation.',
    features: [
      '1 Industry Module',
      'Sales Engine (basic)',
      'Marketing AI (social only)',
      'Email support',
      '1,000 AI actions/month',
      'Basic analytics dashboard',
    ],
    featured: false,
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: 499,
    period: '/month',
    description: 'For growing businesses ready for full autonomy.',
    features: [
      '3 Industry Modules',
      'All 4 Core Modules',
      'Voice AI Receptionist',
      'Priority support',
      '25,000 AI actions/month',
      'Advanced analytics + API',
      'Custom workflows',
    ],
    featured: true,
    cta: 'Request Access',
  },
  {
    name: 'Enterprise',
    price: 1999,
    period: '/month',
    description: 'For organizations demanding maximum AI power.',
    features: [
      'All 6 Industry Modules',
      'All Core Modules (unlimited)',
      'Dedicated AI infrastructure',
      'White-glove onboarding',
      'Unlimited AI actions',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated success manager',
    ],
    featured: false,
    cta: 'Contact Sales',
  },
]

function Checkmark({ color = '#0ACF83' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" style={{ flexShrink: 0, marginTop: 4 }}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function AnimatedPrice({ value, inView, featured }: { value: number; inView: boolean; featured: boolean }) {
  const count = useCountUp(value, inView, 1400)
  return (
    <span className={featured ? 'ze-price-glow' : ''}>
      ${count.toLocaleString()}
    </span>
  )
}

function PricingCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
  const { ref, inView } = useInView(0.3)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      style={{
        marginTop: plan.featured ? '-1.5rem' : 0,
        marginBottom: plan.featured ? '-1.5rem' : 0,
      }}
    >
      <motion.div
        className={`relative rounded-2xl h-full ${plan.featured ? 'ze-pricing-featured' : ''}`}
        style={{
          padding: plan.featured ? '3.5rem 2.5rem' : '2.5rem',
          background: plan.featured
            ? 'linear-gradient(180deg, rgba(0,240,255,0.08) 0%, rgba(10,207,131,0.04) 100%)'
            : 'rgba(240, 235, 248, 0.025)',
          border: plan.featured
            ? '1px solid rgba(0, 240, 255, 0.4)'
            : '1px solid rgba(240, 235, 248, 0.06)',
          backdropFilter: plan.featured ? undefined : 'blur(4px)',
          WebkitBackdropFilter: plan.featured ? undefined : 'blur(4px)',
        }}
        whileHover={{
          y: -6,
          transition: { duration: 0.25 },
        }}
      >
        {/* Most Popular badge */}
        {plan.featured && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase z-10"
            style={{
              background: 'linear-gradient(135deg, #00F0FF, #0ACF83)',
              color: '#020008',
              boxShadow: '0 0 20px rgba(0,240,255,0.3)',
            }}
          >
            Most Popular
          </div>
        )}

        {plan.featured && (
          <div
            className="absolute top-4 right-4 text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded"
            style={{
              background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(10,207,131,0.1))',
              border: '1px solid rgba(0,240,255,0.3)',
              color: '#00F0FF',
            }}
          >
            Recommended
          </div>
        )}

        <h3 className="text-lg font-heading font-bold text-text mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mb-3">
          <span
            className="font-heading font-[800] text-text"
            style={{ fontSize: plan.featured ? '3.5rem' : '3rem', lineHeight: 1 }}
          >
            <AnimatedPrice value={plan.price} inView={inView} featured={plan.featured} />
          </span>
          <span className="text-sm text-text-muted">{plan.period}</span>
        </div>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
          {plan.description}
        </p>

        <ul className="space-y-3 mb-8">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <Checkmark color={plan.featured ? '#00F0FF' : '#0ACF83'} />
              <span style={{ lineHeight: 1.5 }}>{f}</span>
            </li>
          ))}
        </ul>

        {plan.featured ? (
          <motion.button
            onClick={() => navigateToDemo(`pricing_${plan.name.toLowerCase()}`)}
            className="ze-sweep-btn relative w-full py-3.5 rounded-lg text-sm font-medium cursor-pointer overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #00F0FF, #0ACF83)',
              color: '#020008',
              border: 'none',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative z-10">{plan.cta}</span>
          </motion.button>
        ) : (
          <motion.button
            onClick={() => navigateToDemo(`pricing_${plan.name.toLowerCase()}`)}
            className="w-full py-3 rounded-lg text-sm font-medium cursor-pointer"
            style={{
              background: 'transparent',
              color: '#F0EBF8',
              border: '1px solid rgba(240, 235, 248, 0.12)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {plan.cta}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative" style={{ zIndex: 2, padding: '8rem 0' }}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <motion.div
          className="text-center"
          style={{ marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[11px] font-mono tracking-[0.3em] text-emerald uppercase mb-4 block">
            // Pricing
          </span>
          <h2
            className="font-[800] text-text"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Simple pricing. <span className="gradient-text">Infinite leverage.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 items-stretch" style={{ gap: '1.5rem' }}>
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
