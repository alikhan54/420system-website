export default function Footer() {
  return (
    <footer className="relative border-t border-card-border py-8 px-6 md:px-12" style={{ zIndex: 2 }}>
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-sm text-text-muted">
          <span>© 2026</span>
          <span className="font-heading font-bold">
            <span className="text-cyan">4</span>
            <span className="text-emerald">20</span>
          </span>
          <span>System</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-text-muted">
          <a href="#" className="hover:text-text transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-text transition-colors">
            Terms
          </a>
          <a href="mailto:ai@zatesystems.com" className="hover:text-text transition-colors">
            ai@zatesystems.com
          </a>
          <span className="text-text-muted/40">|</span>
          <a
            href="https://zatesystems.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-text-muted hover:text-emerald transition-colors"
          >
            <span className="text-xs">Built by</span>
            <span className="font-heading font-bold text-sm">Zate Systems</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
