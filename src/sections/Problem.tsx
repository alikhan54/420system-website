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
      const underline = section.querySelector<HTMLElement>('.problem-underline')

      gsap.set(lines, { opacity: 0, y: 30 })
      if (underline) gsap.set(underline, { width: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      })

      tl.to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.4,
        ease: 'power2.out',
      })
      if (underline) {
        tl.to(
          underline,
          {
            width: 200,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.2'
        )
      }
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
      {/* Subtle vertical fade vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,170,0.025) 0%, transparent 60%)',
        }}
      />

      <div
        style={{
          maxWidth: 900,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p
          className="problem-line"
          style={{
            fontSize: 'clamp(1.3rem, 3vw, 2rem)',
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
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: '#F0F0F5',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          47 disconnected tools.
        </p>
        <p
          className="problem-line"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            color: '#00D4AA',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '1.5rem 0 0',
            lineHeight: 1.15,
            textShadow: '0 0 60px rgba(0,212,170,0.3)',
          }}
        >
          We replaced all of them.
        </p>

        {/* Animated underline of confidence */}
        <div
          className="problem-underline"
          style={{
            height: 2,
            background: 'rgba(0, 212, 170, 0.3)',
            borderRadius: 2,
            marginTop: '1.5rem',
            boxShadow: '0 0 20px rgba(0,212,170,0.4)',
          }}
        />
      </div>
    </section>
  )
}
