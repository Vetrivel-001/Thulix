import { Link } from 'react-router-dom'
import Particles from '../layout/Particles'

// Shared two-column layout for all auth pages.
// left = form container, right = AuthVisual (hidden on mobile).
export default function AuthLayout({ children }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-abyss pt-24 pb-16">
      {/* Background */}
      <div aria-hidden="true" className="absolute inset-0 grid-bg" />
      <div aria-hidden="true" className="absolute inset-0">
        <div className="orb left-[-12%] top-[-8%] h-[460px] w-[460px] bg-neon/10 animate-aurora-a" />
        <div className="orb right-[-12%] bottom-[-10%] h-[420px] w-[420px] bg-electric/10 animate-aurora-b" />
        <div className="orb left-[30%] bottom-[-20%] h-[380px] w-[380px] bg-accent-blue/8 animate-aurora-c" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 opacity-60 motion-reduce:hidden">
        <Particles density={0.00005} />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-10 px-5 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:px-8">
        {/* Form column */}
        <div className="w-full max-w-md mx-auto lg:mx-0">{children}</div>

        {/* Visual column (desktop only) */}
        <div className="hidden lg:block" aria-hidden="true">
          <AuthVisual />
        </div>
      </div>
    </section>
  )
}

// Brand + floating AI core visual.
function AuthVisual() {
  const cards = [
    { label: 'React', pct: '82%', color: '#8B5CF6', top: '6%', right: '4%' },
    { label: 'Career Match', pct: '94%', color: '#22D3EE', top: '30%', left: '-2%' },
    { label: 'Learning Progress', pct: '68%', color: '#34D399', bottom: '22%', right: '0%' },
    { label: 'AI Recommendation', pct: '90%', color: '#3B82F6', bottom: '4%', left: '6%' },
  ]
  return (
    <div className="relative mx-auto aspect-square max-w-md">
      {/* Core orb */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative h-56 w-56 motion-reduce:animate-none animate-tilt">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon/30 via-abyss-2 to-electric/30 blur-2xl" />
          <div className="absolute inset-0 rounded-full border border-electric/20 bg-abyss-2/60 backdrop-blur-xl" />
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-neon/40 to-electric/40 blur-sm" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-heading text-xl font-bold text-gradient">Thulix</span>
          </div>
        </div>
      </div>

      {/* Orbiting ring */}
      <div className="absolute inset-8 rounded-full border border-dashed border-neon/15 motion-reduce:animate-none animate-spin-slow" />

      {/* Floating cards */}
      {cards.map((c) => (
        <div
          key={c.label}
          className="absolute glass-card rounded-2xl px-4 py-3 shadow-lg shadow-black/30"
          style={{ top: c.top, right: c.right, left: c.left, bottom: c.bottom }}
        >
          <p className="text-[11px] font-medium text-mist">{c.label}</p>
          <p className="mt-0.5 font-heading text-lg font-bold" style={{ color: c.color }}>
            {c.pct}
          </p>
        </div>
      ))}
    </div>
  )
}

// Brand header reused across auth cards.
export function AuthBrand({ eyebrow, title, sub }) {
  return (
    <div className="mb-7">
      <Link to="/" className="mb-6 inline-flex items-center gap-2.5" aria-label="Thulix home">
        <img src="/logo.png" alt="Thulix logo" className="h-9 w-9 object-contain" />
        <span className="font-heading text-xl font-bold text-snow">
          Thuli<span className="text-gradient-animate">x</span>
        </span>
      </Link>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gradient">{eyebrow}</p>
      )}
      <h1 className="mt-2 font-heading text-2xl font-bold text-snow sm:text-3xl">{title}</h1>
      {sub && <p className="mt-2 text-sm text-mist">{sub}</p>}
    </div>
  )
}
