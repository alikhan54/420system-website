import { motion } from 'framer-motion'

const industries = [
  { label: 'Restaurants', icon: '🍽️' },     // 🍽️
  { label: 'Banking', icon: '🏦' },               // 🏦
  { label: 'Healthcare', icon: '⚕️' },            // ⚕️
  { label: 'Construction', icon: '🏗️' },    // 🏗️
  { label: 'Technology', icon: '⚡' },                  // ⚡
  { label: 'Real Estate', icon: '🏘️' },     // 🏘️
]

export default function LogoBar() {
  return (
    <section
      style={{
        background: '#050505',
        padding: '4rem 1.5rem',
        minHeight: '30vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Faint top divider */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.12), transparent)',
          pointerEvents: 'none',
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: '0.7rem',
          fontFamily: 'monospace',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#4A4F58',
          marginBottom: '1.75rem',
          textAlign: 'center',
        }}
      >
        Trusted across 6 industries &middot; 16+ active businesses
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'clamp(1.5rem, 4vw, 3rem)',
          maxWidth: 1000,
        }}
      >
        {industries.map((ind) => (
          <motion.div
            key={ind.label}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span style={{ fontSize: '1.4rem', filter: 'grayscale(0.4)', opacity: 0.7 }}>{ind.icon}</span>
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#4A4F58',
              }}
            >
              {ind.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
