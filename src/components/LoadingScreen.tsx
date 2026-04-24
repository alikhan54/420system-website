import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const title = '420 SYSTEM'
  const letters = title.split('')
  const EASE = [0.76, 0, 0.24, 1] as [number, number, number, number]

  return (
    <motion.div
      className="fixed inset-0 bg-bg flex flex-col items-center justify-center"
      style={{ zIndex: 9999 }}
      exit={{
        y: '-100%',
        transition: { duration: 0.9, ease: EASE, delay: 0.2 },
      }}
    >
      {/* Radial ambient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 60%)',
          animation: 'loaderPulse 2s ease-in-out infinite',
        }}
      />

      {/* Letter-by-letter reveal */}
      <div className="relative z-10 flex items-center justify-center">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="inline-block font-heading font-[800]"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              letterSpacing: '0.05em',
              color: i === 0 ? '#00F0FF' : (i === 1 || i === 2) ? '#0ACF83' : '#F0EBF8',
              filter: i < 3 ? 'drop-shadow(0 0 30px rgba(0,240,255,0.4))' : 'none',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </div>

      {/* Underline — draws itself */}
      <motion.div
        className="relative z-10 h-px mt-6"
        style={{
          background: 'linear-gradient(90deg, transparent, #00F0FF, #0ACF83, transparent)',
          transformOrigin: 'left',
        }}
        initial={{ width: '200px', scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.0, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="mt-4 text-[10px] font-mono text-text-muted tracking-[0.3em] uppercase relative z-10"
      >
        Initializing Autonomous Intelligence
      </motion.div>

      <style>{`
        @keyframes loaderPulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </motion.div>
  )
}
