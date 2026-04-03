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
    cta: 'Start Free Trial',
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

function AnimatedPrice({ value, inView }: { value: number; inView: boolean }) {
  const count = useCountUp(value, inView, 1400)
  return <>${count.toLocaleString()}</>
}

function PricingCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
  const { ref, inView } = useInView(0.3)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        className="relative rounded-xl h-full"
        style={{
          padding: '2.5rem',
          background: plan.featured
            ? 'linear-gradient(180deg, rgba(0,240,255,0.06) 0%, rgba(240,235,248,0.03) 100%)'
            : 'rgba(240, 235, 248, 0.03)',
          border: plan.featured
            ? '1px solid rgba(0, 240, 255, 0.3)'
            : '1px solid rgba(240, 235, 248, 0.06)',
          boxShadow: plan.featured
            ? '0 0 60px rgba(0, 240, 255, 0.08)'
            : 'none',
        }}
        whileHover={{
          y: -6,
          boxShadow: plan.featured
            ? '0 0 80px rgba(0, 240, 255, 0.12)'
            : '0 8px 40px rgba(0, 0, 0, 0.3)',
          transition: { duration: 0.25 },
        }}
      >
        {/* Pulsing border for featured */}
        {plan.featured && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              border: '1px solid rgba(0, 240, 255, 0.3)',
              animation: 'pulseBorder 3s ease-in-out infinite',
            }}
          />
        )}

        {plan.featured && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase"
            style={{
              background: 'linear-gradient(135deg, #00F0FF, #0ACF83)',
              color: '#020008',
            }}
          >
            Most Popular
          </div>
        )}

        <h3 className="text-lg font-heading font-bold text-text mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-4xl font-heading font-[800] text-text">
            <AnimatedPrice value={plan.price} inView={inView} />
          </span>
          <span className="text-sm text-text-muted">{plan.period}</span>
        </div>
        <p className="text-sm text-text-muted mb-8">{plan.description}</p>

        <ul className="space-y-3 mb-8">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-text-muted">
              <span className="text-emerald mt-0.5">&rarr;</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <motion.button
          onClick={() => navigateToDemo(`pricing_${plan.name.toLowerCase()}`)}
          className="w-full py-3 rounded-lg text-sm font-medium cursor-pointer"
          style={
            plan.featured
              ? { background: 'linear-gradient(135deg, #00F0FF, #0ACF83)', color: '#020008', border: 'none' }
              : { background: 'transparent', color: '#F0EBF8', border: '1px solid rgba(240, 235, 248, 0.12)' }
          }
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {plan.cta}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative" style={{ zIndex: 2, padding: '6rem 0' }}>
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <motion.div
          className="text-center"
          style={{ marginBottom: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-mono tracking-[0.15em] text-cyan mb-4 block">// Pricing</span>
          <h2 className="text-3xl md:text-5xl font-[800] text-text">
            Simple pricing. <span className="gradient-text">Infinite leverage.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 items-start" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulseBorder {
          0%, 100% { box-shadow: 0 0 20px rgba(0,240,255,0.05); }
          50% { box-shadow: 0 0 40px rgba(0,240,255,0.15); }
        }
      `}</style>
    </section>
  )
}
