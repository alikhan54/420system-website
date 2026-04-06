import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 1500
    let raf = 0
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setProgress(eased * 100)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 bg-bg flex flex-col items-center justify-center"
      style={{ zIndex: 9999 }}
      exit={{
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0,
        transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] },
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 60%)',
          animation: 'loaderPulse 2s ease-in-out infinite',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative font-heading font-bold text-6xl md:text-7xl z-10"
        style={{
          filter: 'drop-shadow(0 0 40px rgba(0,240,255,0.4))',
        }}
      >
        <span className="text-cyan">4</span>
        <span className="text-emerald">20</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-6 text-[10px] font-mono text-text-muted tracking-[0.3em] uppercase z-10"
      >
        Initializing Autonomous Intelligence
      </motion.div>

      {/* Progress bar */}
      <div className="mt-8 w-[240px] h-[2px] bg-card-border rounded-full overflow-hidden z-10">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00F0FF, #0ACF83)',
            boxShadow: '0 0 12px rgba(0,240,255,0.5)',
            transition: 'width 0.05s linear',
          }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-3 text-[9px] font-mono text-cyan/60 tabular-nums z-10"
      >
        {Math.round(progress)}%
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
