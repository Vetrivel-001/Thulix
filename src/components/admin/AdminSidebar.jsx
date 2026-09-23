/* eslint-disable react/only-export-components */
import { Link } from 'react-router-dom'
import { ArrowLeft, Briefcase, GraduationCap, LayoutDashboard, Presentation, UserCheck, Users } from 'lucide-react'
import { TINT } from './adminUI'

export const ADMIN_VIEWS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'approvals', label: 'Approvals', icon: UserCheck },
  { id: 'enquiries', label: 'Learner Enquiries', icon: GraduationCap },
  { id: 'trainers', label: 'Trainer Applications', icon: Presentation },
  { id: 'recruiters', label: 'Recruiter Applications', icon: Briefcase },
  { id: 'users', label: 'All Users', icon: Users },
]

// Fixed sidebar for large screens; the mobile-friendly chip nav below is the
// lg-hidden twin of this same list.
export default function AdminSidebar({ active, onNavigate }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-[rgba(148,163,184,0.1)] bg-abyss-2/30 lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${TINT}1A`, color: TINT }}>
          <LayoutDashboard size={20} />
        </Link>
        <div>
          <p className="text-sm font-bold text-snow">Admin Studio</p>
          <p className="text-xs text-mist">Thulix · Platform Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Admin navigation">
        {ADMIN_VIEWS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-[rgba(6,182,212,0.08)] text-snow' : 'text-mist hover:bg-[rgba(148,163,184,0.06)] hover:text-snow'
              }`}
            >
              <Icon size={17} style={{ color: isActive ? TINT : undefined }} aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-[rgba(148,163,184,0.1)] p-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] px-3 py-2 text-xs font-semibold text-mist transition-colors hover:text-snow"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to Thulix
        </Link>
      </div>
    </aside>
  )
}

// Horizontal chip navigation shown below the top bar on small screens.
export function MobileAdminNav({ active, onNavigate }) {
  return (
    <nav className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Admin navigation">
      {ADMIN_VIEWS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] text-white shadow-lg shadow-neon/20'
                : 'border border-[rgba(148,163,184,0.15)] text-mist'
            }`}
          >
            <Icon size={14} aria-hidden="true" /> {label}
          </button>
        )
      })}
    </nav>
  )
}