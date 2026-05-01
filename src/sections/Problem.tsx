import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.problem-line')
      gsap.set(lines, { opacity: 0, y: 30 })

      gsap.to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#050505',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 1.5rem',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'center',
        }}
      >
        <p
          className="problem-line"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            color: '#4A4F58',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Your business runs on
        </p>
        <p
          className="problem-line"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            color: '#8A8F98',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          47 disconnected tools.
        </p>
        <p
          className="problem-line"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            color: '#00D4AA',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '1.5rem 0 0',
            lineHeight: 1.2,
            textShadow: '0 0 40px rgba(0,212,170,0.25)',
          }}
        >
          We replaced all of them.
        </p>
      </div>
    </section>
  )
}
