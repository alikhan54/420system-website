import RevealOnScroll from './RevealOnScroll'
import { navigateToDemo } from '../utils/tracking'

const plans = [
  {
    name: 'Starter',
    price: '$199',
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
    price: '$499',
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
    price: '$1,999',
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

export default function Pricing() {
  return (
    <section id="pricing" className="relative" style={{ zIndex: 2, padding: '6rem 0' }}>
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <RevealOnScroll>
          <div className="text-center" style={{ marginBottom: '1.5rem' }}>
            <span className="text-xs font-mono tracking-[0.15em] text-cyan mb-4 block">
              // Pricing
            </span>
            <h2 className="text-3xl md:text-5xl font-[800] text-text">
              Simple pricing.{' '}
              <span className="gradient-text">Infinite leverage.</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 items-start" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
          {plans.map((plan, i) => (
            <RevealOnScroll key={plan.name} delay={i * 0.12}>
              <div
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
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-mono tracking-widest text-bg bg-cyan uppercase">
                    Most Popular
                  </div>
                )}

                <h3 className="text-lg font-heading font-bold text-text mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-heading font-[800] text-text">
                    {plan.price}
                  </span>
                  <span className="text-sm text-text-muted">{plan.period}</span>
                </div>
                <p className="text-sm text-text-muted mb-8">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-text-muted"
                    >
                      <span className="text-emerald mt-0.5">→</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigateToDemo(`pricing_${plan.name.toLowerCase()}`)}
                  className="w-full py-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  style={
                    plan.featured
                      ? {
                          background: 'linear-gradient(135deg, #00F0FF, #0ACF83)',
                          color: '#020008',
                          border: 'none',
                        }
                      : {
                          background: 'transparent',
                          color: '#F0EBF8',
                          border: '1px solid rgba(240, 235, 248, 0.12)',
                        }
                  }
                >
                  {plan.cta}
                </button>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
