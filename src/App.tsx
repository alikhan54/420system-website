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

  // Section title parallax: slight depth effect
  useEffect(() => {
    if (reducedMotion) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        document.querySelectorAll<HTMLElement>('[data-parallax-title]').forEach((el) => {
          const rect = el.getBoundingClientRect()
          const centerY = rect.top + rect.height / 2
          const offset = (centerY - window.innerHeight / 2) * -0.05
          el.style.transform = `translate3d(0, ${offset}px, 0)`
        })
        // Section content subtle parallax
        document.querySelectorAll<HTMLElement>('[data-parallax-bg]').forEach((el) => {
          el.style.transform = `translate3d(0, ${scrollY * -0.2}px, 0)`
        })
        raf = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reducedMotion])

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden max-w-[100vw]">
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <CustomCursor />
      <Navbar />
      <Hero />
      <Organism />
      <Modules />
      <Industries />
      <Pricing />
      <CTA />
      <Footer />
      <ExitIntentModal />
    </div>
  )
}
