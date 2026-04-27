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

  useEffect(() => {
    document.body.dataset.reducedMotion = reducedMotion ? 'true' : 'false'
  }, [reducedMotion])

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <CustomCursor />
      <Navbar />

      {/* SCENE 1 — HERO: scroll-scrub video (200vh sticky) */}
      <Hero />

      {/* SCENE 2 — STORY 1: scroll-scrub video */}
      <StoryBeat
        videoSrc="/videos/story1-bg.mp4"
        videoHeight="150vh"
        lines={[
          { text: 'Traditional SaaS connects your apps.' },
          { text: 'We replaced them entirely.', accent: true },
        ]}
      />

      {/* SCENE 3 — ORGANISM: scroll-scrub video + R3F orbital scene */}
      <Organism />

      {/* SCENE 4 — STORY 2: scroll-scrub video */}
      <StoryBeat
        videoSrc="/videos/transition-bg.mp4"
        videoHeight="150vh"
        lines={[
          { text: 'Four intelligences.' },
          { text: 'Working as one.', accent: true },
        ]}
      />

      {/* SCENE 5 — MODULES: clean (no video) */}
      <Modules />

      {/* Story Beat — clean */}
      <StoryBeat
        lines={[
          { text: 'Built for YOUR industry.' },
          { text: 'Not generic templates.', accent: true },
        ]}
      />

      {/* SCENE 6 — INDUSTRIES: kept as VideoScene (autoplay parallax for smaller scene) */}
      <Industries />

      {/* Story Beat — clean */}
      <StoryBeat
        lines={[
          { text: 'The ROI of autonomy?' },
          { text: 'It’s not even close.', accent: true },
        ]}
      />

      {/* SCENE 7 — PRICING: clean (no video) */}
      <Pricing />

      {/* SCENE 8 — CTA: scroll-scrub video */}
      <CTA />

      {/* SCENE 9 — FOOTER */}
      <Footer />
      <ExitIntentModal />
    </div>
  )
}
