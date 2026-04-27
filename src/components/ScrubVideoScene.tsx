import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

interface ScrubVideoSceneProps {
  src: string
  children: React.ReactNode
  /** Total section height (taller = more scroll room before next scene). Default '200vh'. */
  height?: string
  /** Filter on video element */
  videoFilter?: string
  /** Overlay gradient for text readability */
  overlay?: string
  /** Section id for anchor links */
  id?: string
  /** Video opacity (0-1) */
  opacity?: number
}

/**
 * Section that's `height` tall (default 200vh). Inside, a sticky 100vh container
 * holds the video + content. As the user scrolls through the section, the video
 * scrubs forward frame-by-frame (currentTime tied to scroll progress).
 *
 * On mobile or reduced-motion, falls back to autoplay loop video (or static gradient
 * if video errors). Pure HTML scroll — never blocks scroll events.
 */
export default function ScrubVideoScene({
  src,
  children,
  height = '200vh',
  videoFilter = 'saturate(0.9) brightness(0.75)',
  overlay = 'linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.85) 100%)',
  id,
  opacity = 0.55,
}: ScrubVideoSceneProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Scroll-scrub effect (desktop only, no reduced-motion)
  useEffect(() => {
    if (isMobile || reducedMotion) return
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    let trigger: ScrollTrigger | null = null

    const setup = () => {
      // Pause autoplay; we'll drive currentTime
      video.pause()

      const duration = video.duration
      if (!duration || isNaN(duration) || !isFinite(duration)) return

      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          const t = self.progress * duration
          // Avoid stuttering by only setting if delta > 0.05s
          if (Math.abs(video.currentTime - t) > 0.05) {
            video.currentTime = t
          }
        },
      })
    }

    if (video.readyState >= 1 && video.duration) {
      setup()
    } else {
      const onLoaded = () => setup()
      video.addEventListener('loadedmetadata', onLoaded, { once: true })
      return () => {
        video.removeEventListener('loadedmetadata', onLoaded)
        if (trigger) trigger.kill()
      }
    }

    return () => {
      if (trigger) trigger.kill()
    }
  }, [isMobile, reducedMotion, src])

  // Mobile / reduced-motion fallback: autoplay loop instead of scrub
  const useAutoplayFallback = isMobile || reducedMotion

  return (
    <section
      id={id}
      ref={sectionRef}
      style={{
        position: 'relative',
        height: useAutoplayFallback ? 'auto' : height,
        minHeight: useAutoplayFallback ? '100vh' : undefined,
        background: '#050505',
      }}
    >
      <div
        style={{
          position: useAutoplayFallback ? 'relative' : 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {!videoError ? (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            autoPlay={useAutoplayFallback}
            loop={useAutoplayFallback}
            onError={() => setVideoError(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity,
              filter: videoFilter,
              pointerEvents: 'none',
            }}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          // Fallback gradient if video fails
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,170,0.06) 0%, transparent 60%), #050505',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: overlay,
            pointerEvents: 'none',
          }}
        />

        {/* Content layer (sits above video + overlay) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
