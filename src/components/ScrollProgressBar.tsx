import { useEffect, useRef } from 'react'

/**
 * 2px teal scroll progress bar at top of viewport.
 * Pure scroll listener (rAF-throttled) — no GSAP, no scroll hijacking.
 */
export default function ScrollProgressBar() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
        if (ref.current) ref.current.style.transform = `scaleX(${progress})`
        raf = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9996,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        ref={ref}
        style={{
          height: '100%',
          width: '100%',
          background: 'linear-gradient(90deg, #00D4AA, #00B4D8)',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          willChange: 'transform',
          boxShadow: '0 0 10px rgba(0,212,170,0.5)',
        }}
      />
    </div>
  )
}
