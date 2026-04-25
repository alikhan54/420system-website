import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Organism from './components/Organism'
import Modules from './components/Modules'
import ModulesMobile from './components/ModulesMobile'
import Industries from './components/Industries'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import Footer from './components/Footer'
import ExitIntentModal from './components/ExitIntentModal'
import CustomCursor from './components/CustomCursor'
import LoadingScreen from './components/LoadingScreen'
import SectionTransition from './components/SectionTransition'
import { initVisitorTracking } from './utils/tracking'
import { usePrefersReducedMotion } from './utils/animations'

export default function App() {
  const [loading, setLoading] = useState(true)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    initVisitorTracking()
    const duration = reducedMotion ? 100 : 2200
    const timer = setTimeout(() => setLoading(false), duration)
    return () => clearTimeout(timer)
  }, [reducedMotion])

  // Tag body for custom cursor
  useEffect(() => {
    document.body.dataset.reducedMotion = reducedMotion ? 'true' : 'false'
  }, [reducedMotion])

  return (
    <div className="min-h-screen bg-bg">
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <CustomCursor />
      <Navbar />
      <Hero />
      <SectionTransition />
      <Organism />
      <SectionTransition />
      <Modules />
      <ModulesMobile />
      <SectionTransition />
      <Industries />
      <SectionTransition />
      <Pricing />
      <SectionTransition />
      <CTA />
      <Footer />
      <ExitIntentModal />
    </div>
  )
}
