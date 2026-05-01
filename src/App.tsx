import { useEffect, useState } from 'react'
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

export default function App() {
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
