import { motion } from 'framer-motion'

export default function SectionTransition() {
  return (
    <motion.div
      className="relative w-full"
      style={{ height: 1, pointerEvents: 'none' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-20%' }}
    >
      <motion.div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,170,0.25) 20%, rgba(0,180,216,0.25) 50%, rgba(0,212,170,0.25) 80%, transparent 100%)',
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      />
    </motion.div>
  )
}
