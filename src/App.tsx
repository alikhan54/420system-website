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
    <div className="min-h-screen" style={{ background: '#050505' }}>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <CustomCursor />
      <Navbar />

      {/* SCENE 1 — HERO: video zooms out + tilts (departing) */}
      <Hero />

      {/* SCENE 2 — STORY 1: video slides LEFT (traveling) */}
      <StoryBeat
        videoSrc="/videos/story1-bg.mp4"
        direction="left"
        scaleRange={[1.2, 1.05]}
        parallaxIntensity={0.25}
        minHeight="80vh"
        lines={[
          { text: 'Traditional SaaS connects your apps.' },
          { text: 'We replaced them entirely.', accent: true },
        ]}
      />

      {/* SCENE 3 — ORGANISM: video slides RIGHT (arriving) */}
      <Organism />

      {/* SCENE 4 — STORY 2: deep parallax (diving deeper) */}
      <StoryBeat
        videoSrc="/videos/transition-bg.mp4"
        direction="up"
        scaleRange={[1.25, 1]}
        parallaxIntensity={0.4}
        rotateOnScroll
        minHeight="70vh"
        lines={[
          { text: 'Four intelligences.' },
          { text: 'Working as one.', accent: true },
        ]}
      />

      {/* SCENE 5 — MODULES: clean dark, no video (readability priority) */}
      <Modules />

      {/* Story Beat — clean (no video) for breathing room */}
      <StoryBeat
        lines={[
          { text: 'Built for YOUR industry.' },
          { text: 'Not generic templates.', accent: true },
        ]}
      />

      {/* SCENE 6 — INDUSTRIES: video slides LEFT (scanning across) */}
      <Industries />

      {/* Story Beat — clean before pricing */}
      <StoryBeat
        lines={[
          { text: 'The ROI of autonomy?' },
          { text: 'It’s not even close.', accent: true },
        ]}
      />

      {/* SCENE 7 — PRICING: clean dark, no video */}
      <Pricing />

      {/* SCENE 8 — CTA: video zooms IN (approaching power) */}
      <CTA />

      {/* SCENE 9 — FOOTER */}
      <Footer />
      <ExitIntentModal />
    </div>
  )
}
