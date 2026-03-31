import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Organism from './components/Organism'
import Modules from './components/Modules'
import Industries from './components/Industries'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import Footer from './components/Footer'
import ExitIntentModal from './components/ExitIntentModal'
import { initVisitorTracking } from './utils/tracking'

export default function App() {
  useEffect(() => {
    initVisitorTracking()
  }, [])

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden max-w-[100vw]">
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
