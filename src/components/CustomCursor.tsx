import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../utils/animations'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    // Desktop only
    if (window.innerWidth < 768 || reducedMotion || 'ontouchstart' in window) return

    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
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

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    document.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [reducedMotion])

  if (reducedMotion || typeof window !== 'undefined' && window.innerWidth < 768) return null

  return (
    <motion.div
      className="fixed pointer-events-none rounded-full mix-blend-screen"
      style={{
        zIndex: 9998,
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
        width: hovering ? 40 : 10,
        height: hovering ? 40 : 10,
        background: hovering
          ? 'rgba(0, 240, 255, 0.12)'
          : 'rgba(0, 240, 255, 0.6)',
        border: hovering ? '1px solid rgba(0, 240, 255, 0.3)' : 'none',
        opacity: visible ? 1 : 0,
        transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease, border 0.2s ease, opacity 0.15s ease',
      }}
    />
  )
}
