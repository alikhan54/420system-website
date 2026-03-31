import RevealOnScroll from './RevealOnScroll'

const nodes = [
  { label: 'Sales', icon: '⚡', ring: 1 },
  { label: 'Marketing', icon: '📡', ring: 2 },
  { label: 'HR', icon: '👤', ring: 1 },
  { label: 'Ops', icon: '⚙️', ring: 2 },
]

function OrbitDiagram() {
  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 400, aspectRatio: '1' }}>
      {/* Rings */}
      {[90, 130, 170].map((r, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-card-border"
          style={{
            width: r * 2,
            height: r * 2,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `spin ${20 + i * 10}s linear infinite${i % 2 ? ' reverse' : ''}`,
          }}
        />
      ))}

      {/* Center node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div
          className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, rgba(2,0,8,0.9) 70%)',
            border: '1px solid rgba(0,240,255,0.3)',
            boxShadow: '0 0 40px rgba(0,240,255,0.15)',
          }}
        >
          <span className="font-heading font-bold text-lg md:text-xl">
            <span className="text-cyan">4</span>
            <span className="text-emerald">20</span>
          </span>
        </div>
      </div>

      {/* Orbiting nodes */}
      {nodes.map((node, i) => {
        const animDuration = node.ring === 1 ? 20 : 30
        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 z-10"
            style={{
              animation: `orbit${node.ring} ${animDuration}s linear infinite`,
              animationDelay: `${-(animDuration / 4) * i}s`,
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
              style={{
                background: 'rgba(2, 0, 8, 0.85)',
                border: '1px solid rgba(240,235,248,0.1)',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{node.icon}</span>
              <span className="text-text-muted">{node.label}</span>
            </div>
          </div>
        )
      })}

      <style>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes orbit1 {
          from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(0deg) translateX(130px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(130px) rotate(-360deg); }
        }
      `}</style>
    </div>
  )
}

export default function Organism() {
  return (
    <section id="how-it-works" className="relative" style={{ zIndex: 2, padding: '6rem 0' }}>
      <div className="max-w-[1200px] mx-auto" style={{ paddingLeft: 'max(2rem, 5vw)', paddingRight: 'max(2rem, 5vw)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: '4rem' }}>
          <RevealOnScroll>
            <div style={{ paddingLeft: '0.5rem' }}>
              <span className="text-xs font-mono tracking-[0.15em] text-cyan mb-4 block">
                // The Architecture
              </span>
              <h2 className="font-[800] leading-tight mb-6 text-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                A living organism,
                <br />
                <span className="gradient-text">not a tool collection.</span>
              </h2>
              <p className="text-text-muted leading-relaxed" style={{ maxWidth: '520px' }}>
                Traditional SaaS forces you to connect dozens of disconnected tools. The 420
                System is a unified intelligence — every module shares context, learns from
                every interaction, and autonomously coordinates across departments. It
                doesn't just automate tasks. It thinks, adapts, and evolves.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <OrbitDiagram />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
