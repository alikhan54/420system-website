import RevealOnScroll from './RevealOnScroll'
import { navigateToDemo } from '../utils/tracking'

export default function CTA() {
  return (
    <section className="relative overflow-hidden" style={{ zIndex: 2, padding: '6rem 0' }}>
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[720px] mx-auto text-center px-6 md:px-12">
        <RevealOnScroll>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-[800] leading-tight mb-6">
            <span className="text-text">Stop managing software.</span>
            <br />
            <span className="gradient-text">Let it manage itself.</span>
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <p className="text-text-muted text-base md:text-lg max-w-[480px] mx-auto mb-10 leading-relaxed">
            Join the companies replacing their entire tech stack with a single
            autonomous intelligence.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateToDemo('cta_request_early_access')}
              className="px-8 py-3.5 rounded-lg font-medium text-sm text-bg cursor-pointer border-none transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00F0FF, #0ACF83)',
              }}
            >
              Request Early Access
            </button>
            <button
              onClick={() => navigateToDemo('cta_book_demo')}
              className="px-8 py-3.5 rounded-lg font-medium text-sm text-text-muted border border-card-border hover:border-text-muted/40 hover:text-text transition-all duration-300 cursor-pointer bg-transparent"
            >
              Book a Demo
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
