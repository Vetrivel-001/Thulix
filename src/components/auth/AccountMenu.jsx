import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ChevronDown, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_LABELS } from '../../auth/permission'

// Compact avatar + dropdown with user info and a working Sign Out.
// Works on dashboards and the marketing Navbar.
export default function AccountMenu({ align = 'right' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const initial = (user?.name || 'U').slice(0, 1).toUpperCase()
  const roleLabel = ROLE_LABELS[user?.role] || 'Member'

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  const goDashboard = () => {
    setOpen(false)
    navigate(`/${user?.role}/dashboard`)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.18)] bg-abyss-2/60 py-1.5 pl-1.5 pr-2.5 transition-colors hover:border-[rgba(148,163,184,0.35)]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] text-xs font-bold text-white">
          {initial}
        </span>
        <span className="hidden text-sm font-semibold text-snow sm:block">{user?.name?.split(' ')[0] || 'User'}</span>
        <ChevronDown size={15} className={`text-mist transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="border-b border-[rgba(148,163,184,0.1)] px-3 py-3">
            <p className="truncate text-sm font-bold text-snow">{user?.name || 'User'}</p>
            <p className="truncate text-xs text-mist">{user?.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-[rgba(139,92,246,0.15)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neon">
              {roleLabel}
            </span>
          </div>

          <div className="pt-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={goDashboard}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-mist transition-colors hover:bg-abyss-3/60 hover:text-snow"
            >
              <LayoutDashboard size={15} className="shrink-0" aria-hidden="true" /> My Dashboard
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-mist transition-colors hover:bg-abyss-3/60 hover:text-snow"
            >
              <User size={15} className="shrink-0" aria-hidden="true" /> Profile
            </button>
          </div>

          <div className="pt-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg border border-[rgba(236,72,153,0.25)] bg-[rgba(236,72,153,0.08)] px-3 py-2 text-sm font-semibold text-blush transition-colors hover:bg-[rgba(236,72,153,0.15)]"
            >
              <LogOut size={15} className="shrink-0" aria-hidden="true" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
