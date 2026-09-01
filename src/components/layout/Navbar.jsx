import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Menu, X, LogIn, ArrowRight, ChevronDown } from 'lucide-react'
import { NAV_LINKS } from '../../lib/data'
import { scrollToId } from '../../lib/smooth-scroll'
import MagneticButton from '../ui/MagneticButton'
import AccountMenu from '../auth/AccountMenu'
import { useAuth } from '../../auth/AuthContext'

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Thulix home">
      <motion.span
        whileHover={{ rotate: 8, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="block h-11 w-11"
      >
        <img
          src="/logo.png"
          alt="Thulix logo"
          className="h-full w-full object-contain"
        />
      </motion.span>
      <span className="font-heading text-lg font-bold tracking-tight text-snow">
        Thuli<span className="text-gradient-animate">x</span>
      </span>
    </Link>
  )
}

const ECO_LINKS = [
  { label: 'Home', to: 'home' },
  { label: 'For Learners', to: 'platform', desc: 'AI-powered learning paths & career growth' },
  { label: 'For Trainers', to: 'features', desc: 'Teach, earn & build your audience' },
  { label: 'For Recruiters', to: 'careers', desc: 'Hire verified, project-proven talent' },
]

function EcosystemDropdown({ active, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-1 px-1 py-2 text-sm font-medium text-mist transition-colors duration-300 hover:text-snow"
      >
        Ecosystem
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full z-50 mt-1 w-64 rounded-2xl border border-border glass p-2"
          >
            {ECO_LINKS.map((l) => (
              <button
                key={l.to}
                onClick={() => { onSelect(l.to); setOpen(false) }}
                className="flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-abyss-3"
              >
                <span className={`text-sm font-medium ${active === l.to ? 'text-electric' : 'text-snow'}`}>{l.label}</span>
                {l.desc && <span className="text-[11px] text-mist">{l.desc}</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative px-1 py-2 text-sm font-medium transition-colors duration-300 ${
        active ? 'text-electric' : 'text-mist hover:text-snow'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[linear-gradient(90deg,#06B6D4,#8B5CF6)] transition-transform duration-300 ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollToId(id), 120)
    } else {
      scrollToId(id)
    }
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-border bg-abyss/80 backdrop-blur-2xl shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Primary">
        <Logo />

        <div className="hidden items-center gap-6 lg:flex" role="navigation">
          <button
            onClick={() => go('home')}
            className="group relative px-1 py-2 text-sm font-medium text-mist transition-colors duration-300 hover:text-snow"
          >
            Home
            <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[linear-gradient(90deg,#06B6D4,#8B5CF6)] scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </button>
          <EcosystemDropdown active={location.hash} onSelect={go} />
          {NAV_LINKS.filter((l) => !['home', 'platform', 'features', 'careers'].includes(l.to)).slice(0, 3).map((l) => (
            <NavItem key={l.to} label={l.label} onClick={() => go(l.to)} />
          ))}
          <NavItem label="FAQ" onClick={() => go('faq')} />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <AccountMenu align="right" />
          ) : (
            <>
              <Link
                to="/login"
                className="group inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-mist transition-all duration-300 hover:border-electric/30 hover:text-snow hover:shadow-glow-electric"
              >
                <LogIn size={16} aria-hidden="true" />
                Sign In
              </Link>
              <MagneticButton to="/get-started" variant="primary">
                Get Started
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </MagneticButton>
            </>
          )}
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-xl border border-border glass text-snow lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border glass backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              <button onClick={() => go('home')} className="rounded-xl px-3 py-3 text-left text-base font-medium text-snow transition-colors duration-200 hover:bg-abyss-3">
                Home
              </button>
              <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-mist/60">Ecosystem</p>
              {ECO_LINKS.map((l) => (
                <button key={l.to} onClick={() => go(l.to)} className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-mist transition-colors duration-200 hover:bg-abyss-3 hover:text-snow">
                  {l.label}
                </button>
              ))}
              {NAV_LINKS.filter((l) => !['home', 'platform', 'features', 'careers'].includes(l.to)).slice(0, 3).map((l) => (
                <button key={l.to} onClick={() => go(l.to)} className="rounded-xl px-3 py-3 text-left text-base font-medium text-mist transition-colors duration-200 hover:bg-abyss-3 hover:text-snow">
                  {l.label}
                </button>
              ))}
              <button onClick={() => go('faq')} className="rounded-xl px-3 py-3 text-left text-base font-medium text-mist transition-colors duration-200 hover:bg-abyss-3 hover:text-snow">
                FAQ
              </button>
              <div className="mt-4 flex flex-col gap-3">
                {user ? (
                  <AccountMenu align="left" />
                ) : (
                  <>
                    <MagneticButton to="/login" variant="ghost">
                      <LogIn size={16} aria-hidden="true" /> Sign In
                    </MagneticButton>
                    <MagneticButton to="/get-started" variant="primary">
                      Get Started <ArrowRight size={16} aria-hidden="true" />
                    </MagneticButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
