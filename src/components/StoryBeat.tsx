import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'

interface Line {
  text: string
  accent?: boolean
  large?: boolean
}

interface StoryBeatProps {
  lines: Line[]
  height?: string
}

/* Subtle particle drift backdrop — pure CSS, no Three.js (cheap) */
function ParticleBackdrop({ count = 30 }: { count?: number }) {
  // Memo positions so they don't re-randomize on each render
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 6271) % 100,
        top: (i * 4391) % 100,
        size: 1 + (i % 3),
        delay: (i * 0.41) % 8,
        duration: 12 + (i % 6),
        color: i % 4 === 0 ? '#00B4D8' : '#00D4AA',
      })),
    [count]
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.18,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `storyDrift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes storyDrift {
          0%, 100% { transform: translate(0, 0); opacity: 0.1; }
          50% { transform: translate(15px, -20px); opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export default function StoryBeat({ lines, height = '80vh' }: StoryBeatProps) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        background: '#050505',
      }}
    >
      {!isMobile && <ParticleBackdrop count={40} />}

      {/* Faint horizontal lines for depth */}
      <div
        className="absolute left-0 right-0 top-1/4 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.1), transparent)' }}
      />
      <div
        className="absolute left-0 right-0 bottom-1/4 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,180,216,0.08), transparent)' }}
      />

      <div className="relative z-10 flex flex-col items-center" style={{ maxWidth: 900 }}>
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.8,
              delay: i * 0.18,
              ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
            }}
            style={{
              fontSize: line.large
                ? 'clamp(2rem, 5vw, 4rem)'
                : 'clamp(1.5rem, 4vw, 3rem)',
              fontWeight: line.accent || line.large ? 700 : 400,
              color: line.accent ? '#00D4AA' : '#F0F0F5',
              textShadow: line.accent ? '0 0 40px rgba(0,212,170,0.25)' : 'none',
              textAlign: 'center',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              margin: '0.5rem 0',
            }}
          >
            {line.text}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
