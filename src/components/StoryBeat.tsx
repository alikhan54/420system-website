import { motion } from 'framer-motion'
import ScrubVideoScene from './ScrubVideoScene'

interface Line {
  text: string
  accent?: boolean
}

interface StoryBeatProps {
  lines: Line[]
  videoSrc?: string
  /** Section height for video scenes (default 150vh = moderate scrub room) */
  videoHeight?: string
  minHeight?: string
}

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

function Lines({ lines }: { lines: Line[] }) {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 800,
        padding: '0 2rem',
      }}
    >
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: i * 0.18, ease: EASE }}
          style={{
            fontSize: line.accent ? 'clamp(2rem, 5vw, 3.5rem)' : 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: line.accent ? 700 : 400,
            color: line.accent ? '#00D4AA' : '#F0F0F5',
            textShadow: line.accent ? '0 0 40px rgba(0,212,170,0.3)' : 'none',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            textAlign: 'center',
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
  videoHeight = '150vh',
  minHeight = '70vh',
}: StoryBeatProps) {
  // With video — wrap in ScrubVideoScene (sticky scroll-scrub)
  if (videoSrc) {
    return (
      <ScrubVideoScene
        src={videoSrc}
        height={videoHeight}
        opacity={0.5}
        overlay="linear-gradient(to bottom, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0.85) 100%)"
      >
        <Lines lines={lines} />
      </ScrubVideoScene>
    )
  }

  // No video — plain centered section
  return (
    <section
      style={{
        position: 'relative',
        background: '#050505',
        padding: '7rem 0',
        zIndex: 2,
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: 1,
          pointerEvents: 'none',
          transform: 'translateY(-3rem)',
          background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.1), transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: 1,
          pointerEvents: 'none',
          transform: 'translateY(3rem)',
          background: 'linear-gradient(90deg, transparent, rgba(0,180,216,0.08), transparent)',
        }}
      />
      <Lines lines={lines} />
    </section>
  )
}
