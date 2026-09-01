import { Link, useParams, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowRight, Bell, Search, ChevronRight, LogOut, Mail } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_LABELS } from '../../auth/permission'
import AccountMenu from './AccountMenu'

const ROLE_TINT = {
  learner: '#8B5CF6',
  trainer: '#06B6D4',
  recruiter: '#10B981',
  admin: '#F59E0B',
}

export default function DashboardPlaceholder() {
  const { role } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const label = ROLE_LABELS[role] || 'Your'
  const tint = ROLE_TINT[role] || '#8B5CF6'

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-abyss">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[rgba(148,163,184,0.1)] bg-abyss/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${tint}1A`, color: tint }}>
              <LayoutDashboard size={18} />
            </Link>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-snow">{label} Dashboard</p>
              <p className="text-xs text-mist">Thulix Workspace</p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/60 px-3 py-2 max-w-md">
            <Search size={15} className="text-mist" />
            <input placeholder={`Search your ${label.toLowerCase()} workspace...`} className="w-full bg-transparent text-sm text-snow placeholder:text-mist/50 outline-none" />
          </div>
          <div className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl text-mist transition-colors hover:text-snow" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full" style={{ background: tint }} />
            </span>
            <AccountMenu align="right" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-snow">
            Welcome back, <span style={{ color: tint }}>{user?.name?.split(' ')[0] || 'there'}</span>
          </h1>
          <p className="mt-2 text-mist">
            This is your {label.toLowerCase()} workspace on Thulix. Full features are coming soon.
          </p>
        </div>

        {/* Placeholder cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 p-6 transition-colors hover:border-[rgba(148,163,184,0.25)]"
            >
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70"
                style={{ background: `${tint}33` }}
              />
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${tint}1A`, color: tint }}>
                  {ICONS[i % ICONS.length]}
                </div>
                <ChevronRight size={16} className="text-mist/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-snow" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-snow">{placeholders[i].title}</h3>
              <p className="mt-2 text-sm text-mist">{placeholders[i].desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-5 rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] text-base font-bold text-white">
              {(user?.name || 'U').slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate font-heading text-lg font-bold text-snow">{user?.name || 'Your account'}</p>
              <p className="flex items-center gap-1.5 truncate text-sm text-mist">
                <Mail size={13} className="shrink-0" aria-hidden="true" />
                {user?.email}
              </p>
              <span
                className="mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: `${tint}1a`, color: tint }}
              >
                {label} · {user?.status || 'active'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(236,72,153,0.3)] bg-[rgba(236,72,153,0.08)] px-5 py-3 text-sm font-semibold text-blush transition-colors hover:bg-[rgba(236,72,153,0.15)]"
            >
              <LogOut size={15} aria-hidden="true" /> Sign Out
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.2)] px-5 py-3 text-sm font-semibold text-mist transition-colors hover:text-snow"
            >
              Back to Home <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function Book() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}
function Chart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
}
function Zap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}
function Users() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function Star() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

const ICONS = [Book, Chart, Zap, Users, Star, Book]

const placeholders = [
  { title: 'Your Progress', desc: 'Track your learning milestones and achievements here.' },
  { title: 'Analytics & Insights', desc: "See how you're performing at a glance." },
  { title: 'Getting Started', desc: 'Explore your next steps on the Thulix platform.' },
  { title: 'Community & Network', desc: 'Connect with learners, trainers and recruiters.' },
  { title: 'Recommendations', desc: 'Personalized suggestions tailored to your goals.' },
  { title: 'Resources', desc: 'Curated tools and materials to help you succeed.' },
]
