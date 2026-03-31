import { useEffect, useState, useRef } from 'react'
import { submitExitLead } from '../utils/tracking'

export default function ExitIntentModal() {
  const [show, setShow] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const triggered = useRef(false)

  useEffect(() => {
    // Desktop only
    if (window.innerWidth < 768) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered.current) {
        triggered.current = true
        setShow(true)
      }
    }

    // Delay listener so it doesn't fire immediately
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 5000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    await submitExitLead(name.trim(), email.trim())
    setLoading(false)
    setSubmitted(true)
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 9999, background: 'rgba(2, 0, 8, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setShow(false) }}
    >
      <div
        className="relative w-full max-w-[460px] rounded-2xl p-8 md:p-10"
        style={{
          background: 'linear-gradient(180deg, rgba(240,235,248,0.06) 0%, rgba(240,235,248,0.02) 100%)',
          border: '1px solid rgba(240,235,248,0.1)',
          boxShadow: '0 0 80px rgba(0,240,255,0.06)',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors bg-transparent border-none cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-4">&#10003;</div>
            <h3 className="text-xl font-heading font-bold text-text mb-2">
              You're in!
            </h3>
            <p className="text-sm text-text-muted">
              We'll send your personalized assessment within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-mono tracking-[0.15em] text-cyan mb-3">
              Before you go...
            </p>
            <h3 className="text-2xl md:text-3xl font-heading font-[800] text-text mb-3 leading-tight">
              See how <span className="gradient-text">The 420 System</span> can automate your entire business
            </h3>
            <p className="text-sm text-text-muted mb-6">
              Get a free personalized assessment of how AI can transform your operations.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm text-text placeholder-text-muted outline-none transition-colors"
                style={{
                  background: 'rgba(240,235,248,0.04)',
                  border: '1px solid rgba(240,235,248,0.1)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(0,240,255,0.4)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(240,235,248,0.1)'}
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm text-text placeholder-text-muted outline-none transition-colors"
                style={{
                  background: 'rgba(240,235,248,0.04)',
                  border: '1px solid rgba(240,235,248,0.1)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(0,240,255,0.4)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(240,235,248,0.1)'}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg text-sm font-medium text-bg cursor-pointer border-none transition-all duration-300 hover:scale-[1.02] mt-1"
                style={{
                  background: 'linear-gradient(135deg, #00F0FF, #0ACF83)',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Submitting...' : 'Get My Assessment →'}
              </button>
            </form>

            <p className="text-[11px] text-text-muted/50 text-center mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
