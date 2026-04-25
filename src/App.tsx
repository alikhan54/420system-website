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
    const duration = reducedMotion ? 100 : 1500
    const timer = setTimeout(() => setLoading(false), duration)
    return () => clearTimeout(timer)
  }, [reducedMotion])

  // Tag body for custom cursor
  useEffect(() => {
    document.body.dataset.reducedMotion = reducedMotion ? 'true' : 'false'
  }, [reducedMotion])

  return (
    <div className="min-h-screen" style={{ background: '#050505' }}>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <CustomCursor />
      <Navbar />

      {/* SCENE 1: Hero with video bg */}
      <Hero />

      {/* SCENE 2: Story Beat */}
      <StoryBeat lines={[
        { text: 'Traditional SaaS connects your apps.' },
        { text: 'We replaced them entirely.', accent: true },
      ]} />

      {/* SCENE 3: Organism with video bg */}
      <Organism />

      {/* SCENE 4: Story Beat */}
      <StoryBeat lines={[
        { text: 'Four intelligences.' },
        { text: 'Working as one.', accent: true },
      ]} />

      {/* SCENE 5: Modules — 2x2 grid */}
      <Modules />

      {/* Story Beat */}
      <StoryBeat lines={[
        { text: 'Built for YOUR industry.' },
        { text: 'Not generic templates.', accent: true },
      ]} />

      {/* SCENE 6: Industries */}
      <Industries />

      {/* Story Beat */}
      <StoryBeat lines={[
        { text: 'The ROI of autonomy?' },
        { text: 'It\u2019s not even close.', accent: true },
      ]} />

      {/* SCENE 7: Pricing */}
      <Pricing />

      {/* SCENE 8: CTA + Footer */}
      <CTA />
      <Footer />
      <ExitIntentModal />
    </div>
  )
}
