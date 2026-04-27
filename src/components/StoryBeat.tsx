import { motion } from 'framer-motion'
import VideoScene from './VideoScene'

interface Line {
  text: string
  accent?: boolean
}

interface StoryBeatProps {
  lines: Line[]
  videoSrc?: string
  direction?: 'up' | 'left' | 'right' | 'none'
  parallaxIntensity?: number
  scaleRange?: [number, number]
  rotateOnScroll?: boolean
  minHeight?: string
}

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

function Lines({ lines }: { lines: Line[] }) {
  return (
    <div className="relative z-10 flex flex-col items-center mx-auto" style={{ maxWidth: 800 }}>
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: i * 0.18, ease: EASE }}
          className="text-center"
          style={{
            fontSize: line.accent ? 'clamp(2rem, 5vw, 3.5rem)' : 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: line.accent ? 700 : 400,
            color: line.accent ? '#00D4AA' : '#F0F0F5',
            textShadow: line.accent ? '0 0 40px rgba(0,212,170,0.3)' : 'none',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            margin: '0.5rem 0',
          }}
        >
          {line.text}
        </motion.p>
      ))}
    </div>
  )
}

export default function StoryBeat({
  lines,
  videoSrc,
  direction = 'up',
  parallaxIntensity = 0.2,
  scaleRange = [1.1, 1],
  rotateOnScroll = false,
  minHeight = '70vh',
}: StoryBeatProps) {
  // No video — render plain section
  if (!videoSrc) {
    return (
      <section
        className="relative flex flex-col items-center justify-center"
        style={{ background: '#050505', padding: '7rem 2rem', zIndex: 2, minHeight }}
      >
        <div
          className="absolute left-0 right-0 top-1/2 h-px pointer-events-none -translate-y-12"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.1), transparent)' }}
        />
        <div
          className="absolute left-0 right-0 top-1/2 h-px pointer-events-none translate-y-12"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,180,216,0.08), transparent)' }}
        />
        <Lines lines={lines} />
      </section>
    )
  }

  // With video — wrap in VideoScene
  return (
    <VideoScene
      src={videoSrc}
      direction={direction}
      parallaxIntensity={parallaxIntensity}
      scaleRange={scaleRange}
      rotateOnScroll={rotateOnScroll}
      minHeight={minHeight}
      padding="6rem 2rem"
      overlay="linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.85) 100%)"
    >
      <div
        className="flex flex-col items-center justify-center w-full"
        style={{ minHeight: 'calc(70vh - 12rem)' }}
      >
        <Lines lines={lines} />
      </div>
    </VideoScene>
  )
}
