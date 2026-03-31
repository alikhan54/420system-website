import { useEffect, useState } from 'react'
import { navigateToDemo } from '../utils/tracking'

const links = ['How It Works', 'Modules', 'Industries', 'Pricing']

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 transition-all duration-300"
      style={{
        zIndex: 100,
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled
          ? 'rgba(2, 0, 8, 0.85)'
          : 'rgba(2, 0, 8, 0.4)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: scrolled ? '1px solid rgba(240,235,248,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-baseline gap-0 cursor-pointer bg-transparent border-none"
        >
          <span className="text-2xl font-[800] font-heading text-cyan">4</span>
          <span className="text-2xl font-[800] font-heading text-emerald">20</span>
          <span className="text-[11px] font-mono text-text-muted ml-1.5 tracking-[0.15em] uppercase">
            System
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, '-'))}
              className="text-sm text-text-muted hover:text-text transition-colors bg-transparent border-none cursor-pointer"
            >
              {link}
            </button>
          ))}
          <a
            href="https://zatesystems.com/blog.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Blog
          </a>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => navigateToDemo('navbar_request_access')}
            className="px-5 py-2.5 text-sm font-medium border border-cyan text-cyan rounded-lg hover:bg-cyan hover:text-bg transition-all duration-300 cursor-pointer bg-transparent"
          >
            Request Access
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-text-muted bg-transparent border-none cursor-pointer p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 pt-4 flex flex-col gap-4">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => {
                scrollTo(link.toLowerCase().replace(/\s+/g, '-'))
                setMobileOpen(false)
              }}
              className="text-sm text-text-muted hover:text-text transition-colors bg-transparent border-none cursor-pointer text-left"
            >
              {link}
            </button>
          ))}
          <a
            href="https://zatesystems.com/blog.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Blog
          </a>
          <button
            onClick={() => { navigateToDemo('mobile_request_access'); setMobileOpen(false) }}
            className="mt-2 px-5 py-2.5 text-sm font-medium border border-cyan text-cyan rounded-lg hover:bg-cyan hover:text-bg transition-all duration-300 cursor-pointer bg-transparent w-fit"
          >
            Request Access
          </button>
        </div>
      )}
    </nav>
  )
}
