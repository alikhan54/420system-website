import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { initVisitorTracking } from './utils/tracking'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initVisitorTracking()
    // Brief load screen, then reveal
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden max-w-[100vw]">
      {/* Page load overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 bg-bg flex items-center justify-center"
            style={{ zIndex: 9999 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="font-heading font-bold text-3xl"
            >
              <span className="text-cyan">4</span>
              <span className="text-emerald">20</span>
            </motion.div>
          </motion.div>
        )}
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
