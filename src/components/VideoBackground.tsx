import { useEffect, useRef, useState } from 'react'

interface VideoBackgroundProps {
  src: string
  opacity?: number
  blendMode?: React.CSSProperties['mixBlendMode']
  fallbackGradient?: string
  overlayGradient?: string
}

/**
 * Full-coverage background video with graceful fallback.
 * If the video file is missing, network fails, or autoplay is blocked,
 * we keep the radial gradient fallback visible underneath.
 */
export default function VideoBackground({
  src,
  opacity = 0.4,
  blendMode = 'screen',
  fallbackGradient = 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,170,0.06) 0%, transparent 60%), #050505',
  overlayGradient = 'linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.85) 100%)',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    // Try to play (some browsers block until user interaction even with muted)
    const tryPlay = () => v.play().catch(() => {})
    if (v.readyState >= 2) tryPlay()
    else v.addEventListener('canplay', tryPlay, { once: true })
    return () => v.removeEventListener('canplay', tryPlay)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Fallback gradient — always rendered, sits below video */}
      <div className="absolute inset-0" style={{ background: fallbackGradient }} />

      {/* Video — fades in once loaded */}
      {!videoError && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            opacity: videoLoaded ? opacity : 0,
            mixBlendMode: blendMode,
            transition: 'opacity 0.8s ease-out',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top overlay — improves text contrast */}
      <div
        className="absolute inset-0"
        style={{ background: overlayGradient }}
      />
    </div>
  )
}
