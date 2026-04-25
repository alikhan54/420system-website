import { motion } from 'framer-motion'

interface Line {
  text: string
  accent?: boolean
}

interface StoryBeatProps {
  lines: Line[]
}

export default function StoryBeat({ lines }: StoryBeatProps) {
  return (
    <section
      className="relative flex flex-col items-center justify-center"
      style={{
        background: '#050505',
        padding: '8rem 2rem',
        zIndex: 2,
      }}
    >
      {/* Faint accent lines for depth */}
      <div
        className="absolute left-0 right-0 top-1/2 h-px pointer-events-none -translate-y-12"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.1), transparent)' }}
      />
      <div
        className="absolute left-0 right-0 top-1/2 h-px pointer-events-none translate-y-12"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,180,216,0.08), transparent)' }}
      />

      <div className="relative z-10 flex flex-col items-center" style={{ maxWidth: 800 }}>
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{
              duration: 0.6,
              delay: i * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
            }}
            className="text-center"
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              fontWeight: line.accent ? 700 : 400,
              color: line.accent ? '#00D4AA' : '#F0F0F5',
              textShadow: line.accent ? '0 0 30px rgba(0,212,170,0.25)' : 'none',
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
              margin: '0.4rem 0',
            }}
          >
            {line.text}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
