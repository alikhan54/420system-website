import { useEffect, useState } from 'react'
import { navigateToDemo } from '../utils/tracking'

const links = ['How It Works', 'Modules', 'Industries', 'Pricing']

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function NavLink({ children, onClick, href, target, rel, className = '' }: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  className?: string
}) {
  const baseStyle: React.CSSProperties = {
    color: '#8A8F98',
    transition: 'color 0.2s ease',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  }
  const handleEnter = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = '#F0F0F5' }
  const handleLeave = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = '#8A8F98' }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={`text-sm ${className}`} style={baseStyle}>
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={`text-sm ${className}`} style={baseStyle}>
      {children}
    </button>
  )
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
        background: scrolled ? 'rgba(5, 5, 5, 0.85)' : 'rgba(5, 5, 5, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid #1A1A24' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 20px rgba(0,212,170,0.04)' : 'none',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-baseline gap-0 cursor-pointer bg-transparent border-none"
        >
          <span className="text-2xl font-[800] font-heading" style={{ color: '#00D4AA' }}>4</span>
          <span className="text-2xl font-[800] font-heading" style={{ color: '#00B4D8' }}>20</span>
          <span className="text-[11px] font-mono ml-1.5 tracking-[0.15em] uppercase" style={{ color: '#4A4F58' }}>
            System
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink key={link} onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, '-'))}>
              {link}
            </NavLink>
          ))}
          <NavLink href="https://zatesystems.com/blog.html" target="_blank" rel="noopener noreferrer">
            Blog
          </NavLink>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => navigateToDemo('navbar_request_access')}
            className="px-5 py-2.5 text-sm font-medium rounded-lg cursor-pointer bg-transparent transition-all duration-300"
            style={{ border: '1px solid #00D4AA', color: '#00D4AA' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#00D4AA'
              e.currentTarget.style.color = '#050505'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#00D4AA'
            }}
          >
            Request Access
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden bg-transparent border-none cursor-pointer p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: '#8A8F98' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 pt-4 flex flex-col gap-4">
          {links.map((link) => (
            <NavLink
              key={link}
              onClick={() => {
                scrollTo(link.toLowerCase().replace(/\s+/g, '-'))
                setMobileOpen(false)
              }}
              className="text-left"
            >
              {link}
            </NavLink>
          ))}
          <NavLink href="https://zatesystems.com/blog.html" target="_blank" rel="noopener noreferrer">
            Blog
          </NavLink>
          <button
            onClick={() => { navigateToDemo('mobile_request_access'); setMobileOpen(false) }}
            className="mt-2 px-5 py-2.5 text-sm font-medium rounded-lg cursor-pointer bg-transparent w-fit transition-all duration-300"
            style={{ border: '1px solid #00D4AA', color: '#00D4AA' }}
          >
            Request Access
          </button>
        </div>
      )}
    </nav>
  )
}
