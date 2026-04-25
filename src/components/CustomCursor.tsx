import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../utils/animations'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (window.innerWidth < 768 || reducedMotion || 'ontouchstart' in window) return

    let targetX = 0, targetY = 0
    let dotX = 0, dotY = 0
    let ringX = 0, ringY = 0
    let raf = 0

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      setVisible(true)
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button, a, [role="button"], input, textarea, select, .cursor-pointer')) {
        setHovering(true)
      }
    }
    const handleOut = () => setHovering(false)
    const handleLeave = () => setVisible(false)
    const handleDown = () => setClicking(true)
    const handleUp = () => setClicking(false)

    const tick = () => {
      // Dot follows tightly
      dotX += (targetX - dotX) * 0.5
      dotY += (targetY - dotY) * 0.5
      // Ring follows with lerp 0.1 (delayed)
      ringX += (targetX - ringX) * 0.1
      ringY += (targetY - ringY) * 0.1

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX - 4}px, ${dotY - 4}px, 0)`
      }
      if (ringRef.current) {
        const scale = clicking ? 0.8 : hovering ? 1.3 : 1
        ringRef.current.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0) scale(${scale})`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mousedown', handleDown)
    document.addEventListener('mouseup', handleUp)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mousedown', handleDown)
      document.removeEventListener('mouseup', handleUp)
      cancelAnimationFrame(raf)
    }
  }, [hovering, clicking, mounted, reducedMotion])

  if (!mounted || reducedMotion) return null

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none rounded-full mix-blend-screen"
        style={{
          zIndex: 9998,
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          background: '#00D4AA',
          opacity: visible ? (hovering ? 0 : 0.9) : 0,
          transition: 'opacity 0.2s ease',
          willChange: 'transform, opacity',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none rounded-full mix-blend-screen"
        style={{
          zIndex: 9998,
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          background: hovering ? 'rgba(0,212,170,0.08)' : 'transparent',
          border: '1px solid rgba(0,212,170,0.5)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s ease, background 0.2s ease',
          willChange: 'transform, opacity',
        }}
      />
    </>
  )
}
