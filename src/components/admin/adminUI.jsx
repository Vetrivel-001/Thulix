// Shared admin UI primitives — constants + small presentational components.
// Constants only trigger a fast-refresh warning at module scope, so they are
// colocated here intentionally (same pattern as src/auth/AuthContext.jsx).
/* eslint-disable react/only-export-components */
import { ShieldCheck } from 'lucide-react'
import { ROLE_LABELS } from '../../auth/permission'
import {
  ENROLLMENT_STATUS_LABELS,
  TRAINER_APPLICATION_STATUS_LABELS,
  RECRUITER_APPLICATION_STATUS_LABELS,
} from '../../auth/AuthService'

export const TINT = '#F59E0B'
export const ROLE_TINTS = { learner: '#8B5CF6', trainer: '#06B6D4', recruiter: '#10B981', admin: '#F59E0B' }
export const ENROLLMENT_TINTS = { new: '#F59E0B', contacted: '#06B6D4', in_progress: '#8B5CF6', enrolled: '#10B981', closed: '#94A3B8' }
export const TRAINER_TINTS = { new: '#F59E0B', reviewed: '#06B6D4', accepted: '#10B981', not_accepted: '#EC4899', closed: '#94A3B8' }
export const RECRUITER_TINTS = { new: '#F59E0B', reviewed: '#06B6D4', accepted: '#10B981', not_accepted: '#EC4899', closed: '#94A3B8' }

export const STATUS_STYLE = {
  active: { label: 'Active', color: '#10B981' },
  pending: { label: 'Pending', color: '#F59E0B' },
  rejected: { label: 'Rejected', color: '#EC4899' },
}

// Application-status label maps are re-exported so panels can stay in sync.
export { ENROLLMENT_STATUS_LABELS, TRAINER_APPLICATION_STATUS_LABELS, RECRUITER_APPLICATION_STATUS_LABELS }

// Currency from a stored numeric salary (never a formatted string).
export function formatSalary(value) {
  const n = Number(value)
  if (!n) return '—'
  return `₹${n.toLocaleString('en-IN')}`
}

export function Badge({ color, children }) {
  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ background: `${color}1a`, color }}
    >
      {children}
    </span>
  )
}

export function RoleBadge({ role }) {
  const c = ROLE_TINTS[role] || '#94A3B8'
  return <Badge color={c}>{ROLE_LABELS[role] || role}</Badge>
}

export function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending
  return <Badge color={s.color}>{s.label}</Badge>
}

export function Avatar({ name = 'U', role }) {
  return (
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold"
      style={{ background: `${ROLE_TINTS[role] || '#94A3B8'}33`, color: ROLE_TINTS[role] || '#94A3B8' }}
    >
      {(name || 'U').slice(0, 1).toUpperCase()}
    </span>
  )
}

export function UserCell({ name, email, role }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} role={role} />
      <div className="min-w-0">
        <p className="truncate font-semibold text-snow">{name}</p>
        <p className="truncate text-xs text-mist">{email}</p>
      </div>
    </div>
  )
}

export function SectionHeader({ icon: Icon, label, count, tone, children }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2.5">
        <Icon size={18} style={{ color: tone }} aria-hidden="true" />
        <h2 className="font-heading text-xl font-bold text-snow">{label}</h2>
        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: `${tone}1f`, color: tone }}>
          {count}
        </span>
      </div>
      {children && <div className="ml-auto flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

export function StatusSelect({
  value,
  onChange,
  disabled,
  labels,
  ariaLabel,
  className = '',
  focusClass = 'focus:border-electric/60',
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={onChange}
      aria-label={ariaLabel}
      className={`rounded-lg border border-[rgba(148,163,184,0.18)] bg-abyss-2/70 px-2 py-1 text-xs text-snow outline-none transition-colors disabled:opacity-50 ${focusClass} ${className}`}
    >
      {Object.entries(labels).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  )
}

export function EmptyState({ message }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 p-6 text-sm text-mist">
      <ShieldCheck size={18} className="text-success" aria-hidden="true" /> {message}
    </div>
  )
}