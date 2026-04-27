import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../utils/animations'

type Direction = 'up' | 'left' | 'right' | 'none'

interface VideoSceneProps {
  src: string
  children: React.ReactNode
  /** 0.1 = subtle, 0.3 = dramatic */
  parallaxIntensity?: number
  /** rotateX over scroll */
  rotateOnScroll?: boolean
  /** [from, to] e.g. [1.15, 1] = zoom out, [1, 1.15] = zoom in */
  scaleRange?: [number, number]
  /** Which axis the video drifts on as scroll progresses */
  direction?: Direction
  /** Section minimum height */
  minHeight?: string
  /** Vertical padding */
  padding?: string
  /** Override video dimming overlay */
  overlay?: string
  /** Filter on the video element */
  videoFilter?: string
  /** Disable opacity dim at edges */
  fullOpacity?: boolean
  /** Section ID for anchor links */
  id?: string
  /** Optional class for content container */
  contentClassName?: string
}

export default function VideoScene({
  src,
  children,
  parallaxIntensity = 0.2,
  rotateOnScroll = false,
  scaleRange = [1.1, 1],
  direction = 'up',
  minHeight = '100vh',
  padding = '6rem 1.5rem',
  overlay = 'linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.85) 100%)',
  videoFilter = 'saturate(0.85) brightness(0.7)',
  fullOpacity = false,
  id,
  contentClassName = '',
}: VideoSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [videoOk, setVideoOk] = useState(true)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => v.play().catch(() => {})
    if (v.readyState >= 2) tryPlay()
    else v.addEventListener('canplay', tryPlay, { once: true })
    return () => v.removeEventListener('canplay', tryPlay)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Parallax transforms — only applied when not reduced-motion and not mobile
  const intensity = parallaxIntensity * 100
  const yShift = direction === 'up' ? [`${intensity * 0.5}%`, `-${intensity * 0.5}%`] : ['0%', '0%']
  const xShift =
    direction === 'left' ? [`${intensity * 0.5}%`, `-${intensity * 0.5}%`] :
    direction === 'right' ? [`-${intensity * 0.5}%`, `${intensity * 0.5}%`] : ['0%', '0%']

  const y = useTransform(scrollYProgress, [0, 1], yShift)
  const x = useTransform(scrollYProgress, [0, 1], xShift)
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange)
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], rotateOnScroll ? [4, 0, -4] : [0, 0, 0])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    fullOpacity ? [1, 1, 1, 1] : [0.4, 1, 1, 0.4]
  ) as MotionValue<number>

  const showVideo = !isMobile && !reducedMotion && videoOk

  return (
    <section
      id={id}
      ref={ref}
      className="relative overflow-hidden"
      style={{
        minHeight,
        padding,
        perspective: '1200px',
        background: '#050505',
      }}
    >
      {/* Video / fallback layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: showVideo ? y : 0,
          x: showVideo ? x : 0,
          scale: showVideo ? scale : 1,
          rotateX: showVideo ? rotateX : 0,
          opacity: showVideo ? opacity : 1,
          transformStyle: 'preserve-3d',
          zIndex: 0,
        }}
      >
        {showVideo ? (
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoOk(false)}
            className="absolute w-full h-full"
            style={{
              objectFit: 'cover',
              filter: videoFilter,
              pointerEvents: 'none',
            }}
          />
        ) : (
          // Mobile/reduced-motion fallback gradient
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,170,0.06) 0%, transparent 60%), #050505',
            }}
          />
        )}

        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: overlay }}
        />
      </motion.div>

      {/* Content layer */}
      <div
        className={`relative w-full ${contentClassName}`}
        style={{ zIndex: 10 }}
      >
        {children}
      </div>
    </section>
  )
}
