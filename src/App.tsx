import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LogoBar from './sections/LogoBar'
import Problem from './sections/Problem'
import Solution from './sections/Solution'
import Modules from './components/Modules'
import Industries from './components/Industries'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import Footer from './components/Footer'
import ExitIntentModal from './components/ExitIntentModal'
import CustomCursor from './components/CustomCursor'
import LoadingScreen from './components/LoadingScreen'
import GrainOverlay from './components/GrainOverlay'
import ScrollProgressBar from './components/ScrollProgressBar'
import { initVisitorTracking } from './utils/tracking'
import { usePrefersReducedMotion } from './utils/animations'

// OMEGA cinematic-v4 routes — lazy so three/gsap only load on those pages,
// keeping the landing chunk light.
const CinematicV4Page = lazy(() => import('./pages/CinematicV4Page'))
const OmegaTestPage = lazy(() => import('./pages/OmegaTestPage'))

function getRoute() {
  if (typeof window === 'undefined') return '/'
  return window.location.pathname
}

/** The OMEGA product domain serves the cinematic experience at its root.
 *  Other hosts (e.g. 420system.vercel.app) keep the existing landing at "/". */
function isOmegaHost() {
  if (typeof window === 'undefined') return false
  return window.location.hostname.startsWith('omega.')
}

function RouteFallback() {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: '#05060A' }}>
      <span style={{ fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#6EE7FF', opacity: 0.7 }}>
        loading…
      </span>
    </div>
  )
}

/** The existing production landing page — unchanged. */
function LandingPage() {
  const [loading, setLoading] = useState(true)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    initVisitorTracking()
    const duration = reducedMotion ? 100 : 1500
    const timer = setTimeout(() => setLoading(false), duration)
    return () => clearTimeout(timer)
  }, [reducedMotion])

  useEffect(() => {
    document.body.dataset.reducedMotion = reducedMotion ? 'true' : 'false'
  }, [reducedMotion])

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {/* Premium polish layers */}
      <ScrollProgressBar />
      <GrainOverlay />

      <CustomCursor />
      <Navbar />

      {/* SCENE 1 — HERO: video bg + R3F particle brain on right */}
      <Hero />

      {/* SCENE 2 — LOGO BAR: social proof */}
      <LogoBar />

      {/* SCENE 3 — PROBLEM: pure dark, dramatic 3-line reveal */}
      <Problem />

      {/* SCENE 4 — SOLUTION: clean dark, R3F orbital + drei wrappers */}
      <Solution />

      {/* SCENE 5 — MODULES: 2x2 expandable cards */}
      <Modules />

      {/* SCENE 6 — INDUSTRIES: clean dark, 3x2 grid */}
      <Industries />

      {/* SCENE 7 — PRICING: 3 cards, Professional featured */}
      <Pricing />

      {/* SCENE 8 — CTA: video bg + minimal title + button + phone */}
      <CTA />

      {/* SCENE 9 — FOOTER */}
      <Footer />

      <ExitIntentModal />
    </div>
  )
}

export default function App() {
  // Lightweight pathname routing (no router lib; main.tsx is frozen). SPA deep
  // links resolved by vercel.json rewrite → index.html.
  const [route] = useState(getRoute)

  if (route.startsWith('/omega-test')) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <OmegaTestPage />
      </Suspense>
    )
  }
  if (route.startsWith('/cinematic-v4') || (route === '/' && isOmegaHost())) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <CinematicV4Page />
      </Suspense>
    )
  }
  return <LandingPage />
}
