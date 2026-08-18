import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Menu, X, LogIn, ArrowRight } from 'lucide-react'
import { NAV_LINKS } from '../../lib/data'
import { scrollToId } from '../../lib/smooth-scroll'
import MagneticButton from '../ui/MagneticButton'

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Thulix home">
      <motion.span
        whileHover={{ rotate: 8, scale: 1.05 }}
        className="block h-12 w-12"
      >
        <img
          src="/logo.png"
          alt="Thulix logo"
          className="h-full w-full object-contain"
        />
      </motion.span>
      <span className="font-heading text-lg font-bold tracking-tight text-snow">
        Thu<span className="text-gradient">lix</span>
      </span>
    </Link>
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
        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[linear-gradient(90deg,#2563EB,#4F46E5)] transition-transform duration-300 ${
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
        scrolled ? 'border-b border-gray-200/80 bg-white/80 backdrop-blur-2xl shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Primary">
        <Logo />

        <div className="hidden items-center gap-6 lg:flex" role="navigation">
          {NAV_LINKS.map((l) => (
            <NavItem key={l.to} label={l.label} onClick={() => go(l.to)} />
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-mist transition-colors hover:text-snow"
          >
            <LogIn size={16} aria-hidden="true" />
            Login
            <span className="relative block h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-mint animate-pulse-glow" />
            </span>
          </Link>
          <MagneticButton to="/get-started" variant="primary">
            Get Started
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </MagneticButton>
        </div>

        <button
          className="glass grid h-11 w-11 place-items-center rounded-xl text-snow lg:hidden"
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
            className="overflow-hidden border-t border-gray-200 bg-white/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.to}
                  onClick={() => go(l.to)}
                  className="rounded-xl px-3 py-3 text-left text-base font-medium text-mist transition-colors hover:bg-gray-100 hover:text-snow"
                >
                  {l.label}
                </button>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <MagneticButton to="/login" variant="ghost">
                  <LogIn size={16} aria-hidden="true" /> Login
                </MagneticButton>
                <MagneticButton to="/get-started" variant="primary">
                  Get Started <ArrowRight size={16} aria-hidden="true" />
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
