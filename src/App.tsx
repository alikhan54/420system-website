import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Organism from './components/Organism'
import Modules from './components/Modules'
import Industries from './components/Industries'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import Footer from './components/Footer'
import ExitIntentModal from './components/ExitIntentModal'
import CustomCursor from './components/CustomCursor'
import LoadingScreen from './components/LoadingScreen'
import StoryBeat from './components/StoryBeat'
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

      <StoryBeat lines={[
        { text: 'Imagine a business...' },
        { text: '...where every department thinks together.' },
        { text: "Where AI doesn't just automate \u2014" },
        { text: 'it decides.', accent: true, large: true },
      ]} />

      <Organism />

      <StoryBeat lines={[
        { text: 'Four intelligences.' },
        { text: 'Working as one.', accent: true, large: true },
      ]} />

      <Modules />

      <StoryBeat lines={[
        { text: 'Built for YOUR industry.' },
        { text: 'Not generic templates.', accent: true, large: true },
      ]} />

      <Industries />

      <StoryBeat lines={[
        { text: 'The ROI of autonomy?' },
        { text: "It's not even close.", accent: true, large: true },
      ]} />

      <Pricing />

      <CTA />
      <Footer />
      <ExitIntentModal />
    </div>
  )
}
