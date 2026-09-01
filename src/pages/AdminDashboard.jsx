import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, AlertTriangle, ArrowRight, Bell, Check, Clock, LayoutDashboard,
  Mail, RefreshCw, Search, ShieldCheck, UserCheck, UserX, Users, X,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { ROLE_LABELS } from '../auth/permission'
import AccountMenu from '../components/auth/AccountMenu'

const TINT = '#F59E0B'
const ROLE_TINTS = { learner: '#8B5CF6', trainer: '#06B6D4', recruiter: '#10B981', admin: '#F59E0B' }

const STATUS_STYLE = {
  active: { label: 'Active', color: '#10B981' },
  pending: { label: 'Pending', color: '#F59E0B' },
  rejected: { label: 'Rejected', color: '#EC4899' },
}

function Badge({ color, children }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ background: `${color}1a`, color }}
    >
      {children}
    </span>
  )
}

function RoleBadge({ role }) {
  const c = ROLE_TINTS[role] || '#94A3B8'
  return <Badge color={c}>{ROLE_LABELS[role] || role}</Badge>
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending
  return <Badge color={s.color}>{s.label}</Badge>
}

export default function AdminDashboard() {
  const { user, getAllUsers, getPendingApplications, getStats, setUserStatus } = useAuth()
  const [users, setUsers] = useState([])
  const [apps, setApps] = useState([])
  const [stats, setStats] = useState(null)
  const [busy, setBusy] = useState({})
  const [notice, setNotice] = useState(null)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const reload = useCallback(() => {
    setUsers(getAllUsers())
    setApps(getPendingApplications())
    setStats(getStats())
  }, [getAllUsers, getPendingApplications, getStats])

  useEffect(() => {
    reload()
  }, [reload])

  const flash = (msg, ok = true) => {
    setNotice({ msg, ok })
    setTimeout(() => setNotice(null), 3500)
  }

  const act = async (id, status, okMsg) => {
    setBusy((b) => ({ ...b, [id]: status }))
    try {
      await setUserStatus(id, status)
      reload()
      flash(okMsg)
    } catch (e) {
      flash(e.message || 'Something went wrong.', false)
    } finally {
      setBusy((b) => ({ ...b, [id]: undefined }))
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      if (!q) return true
      return (
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.meta?.companyName || '').toLowerCase().includes(q)
      )
    })
  }, [users, query, roleFilter, statusFilter])

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abyss" role="status" aria-label="Loading">
        <div className="loader" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Users', value: stats.total, icon: Users, color: '#94A3B8' },
    { label: 'Active', value: stats.active, icon: UserCheck, color: '#10B981' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: '#F59E0B' },
    { label: 'Rejected', value: stats.rejected, icon: UserX, color: '#EC4899' },
  ]

  return (
    <div className="min-h-screen bg-abyss">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[rgba(148,163,184,0.1)] bg-abyss/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${TINT}1A`, color: TINT }}>
              <LayoutDashboard size={18} />
            </Link>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-snow">Admin Dashboard</p>
              <p className="text-xs text-mist">Thulix · Platform Admin</p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/60 px-3 py-2 max-w-md">
            <Search size={15} className="text-mist" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users, emails, companies..."
              className="w-full bg-transparent text-sm text-snow placeholder:text-mist/50 outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl text-mist transition-colors hover:text-snow" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full" style={{ background: TINT }} />
            </span>
            <AccountMenu align="right" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-snow">
              Admin Studio, <span style={{ color: TINT }}>{user?.name?.split(' ')[0] || 'Admin'}</span>
            </h1>
            <p className="mt-2 text-mist">Review applications and manage every account on Thulix.</p>
          </div>
          <button
            type="button"
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.2)] px-4 py-2 text-sm font-semibold text-mist transition-colors hover:text-snow"
          >
            <RefreshCw size={15} aria-hidden="true" /> Refresh
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className={`mb-6 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm ${
              notice.ok ? 'border-success/40 bg-success/10 text-snow' : 'border-error/40 bg-error/10 text-snow'
            }`}
          >
            {notice.ok ? <Check size={16} className="text-success" /> : <AlertTriangle size={16} className="text-error" />}
            {notice.msg}
          </div>
        )}

        {/* Stats */}
        <section aria-label="Statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((c) => (
            <div key={c.label} className="relative overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 p-5">
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl" style={{ background: `${c.color}44` }} />
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">{c.label}</p>
                <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${c.color}1a`, color: c.color }}>
                  <c.icon size={17} />
                </span>
              </div>
              <p className="mt-3 font-heading text-3xl font-bold text-snow">{c.value}</p>
            </div>
          ))}
        </section>

        {/* Per-role breakdown */}
        <section aria-label="Users by role" className="mt-6 grid gap-4 rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 p-6 sm:grid-cols-4">
          {Object.entries(stats.byRole).map(([role, count]) => (
            <div key={role} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${ROLE_TINTS[role]}1a`, color: ROLE_TINTS[role] }}>
                <Activity size={17} />
              </span>
              <div>
                <p className="text-lg font-bold text-snow">{count}</p>
                <p className="text-xs uppercase tracking-wide text-mist">{ROLE_LABELS[role] || role}s</p>
              </div>
            </div>
          ))}
        </section>

        {/* Pending applications */}
        <section aria-label="Pending applications" className="mt-10">
          <div className="mb-4 flex items-center gap-2.5">
            <Clock size={18} className="text-golden" />
            <h2 className="font-heading text-xl font-bold text-snow">Pending Approvals</h2>
            <span className="rounded-full bg-golden/15 px-2.5 py-0.5 text-xs font-semibold text-golden">{apps.length}</span>
          </div>

          {apps.length === 0 ? (
            <div className="flex items-center gap-3 rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 p-6 text-sm text-mist">
              <ShieldCheck size={18} className="text-success" /> No pending applications — you're all caught up.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40">
              <div className="divide-y divide-[rgba(148,163,184,0.08)]">
                {apps.map((a) => (
                  <div key={a.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-bold text-white"
                        style={{ background: `${ROLE_TINTS[a.role]}33`, color: ROLE_TINTS[a.role] }}
                      >
                        {(a.name || 'U').slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold text-snow">{a.name}</p>
                          <RoleBadge role={a.role} />
                        </div>
                        <p className="flex items-center gap-1.5 truncate text-sm text-mist">
                          <Mail size={12} className="shrink-0" aria-hidden="true" /> {a.email}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-mist/70">
                          {a.role === 'trainer'
                            ? [a.meta?.professionalTitle, a.meta?.expertise, a.meta?.experience].filter(Boolean).join(' · ')
                            : [a.meta?.companyName, a.meta?.industry, a.meta?.companyLocation].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        disabled={!!busy[a.id]}
                        onClick={() => act(a.id, 'active', `${a.name} approved — they can now sign in.`)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        <Check size={15} aria-hidden="true" /> {busy[a.id] === 'active' ? 'Saving…' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        disabled={!!busy[a.id]}
                        onClick={() => act(a.id, 'rejected', `${a.name} rejected.`)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(236,72,153,0.3)] bg-[rgba(236,72,153,0.08)] px-4 py-2 text-sm font-semibold text-blush transition-colors hover:bg-[rgba(236,72,153,0.15)] disabled:opacity-50"
                      >
                        <X size={15} aria-hidden="true" /> {busy[a.id] === 'rejected' ? 'Saving…' : 'Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* All users */}
        <section aria-label="All users" className="mt-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Users size={18} className="text-electric" />
              <h2 className="font-heading text-xl font-bold text-snow">All Users</h2>
              <span className="rounded-full bg-electric/15 px-2.5 py-0.5 text-xs font-semibold text-electric">{filtered.length}</span>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/70 px-3 py-2 text-sm text-snow outline-none focus:border-electric/50"
              >
                <option value="all">All roles</option>
                {Object.keys(ROLE_LABELS).map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/70 px-3 py-2 text-sm text-snow outline-none focus:border-electric/50"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(148,163,184,0.1)] text-xs uppercase tracking-wider text-mist">
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(148,163,184,0.08)]">
                {filtered.map((u) => {
                  const isSelf = u.id === user?.id
                  const pendingReview = (u.role === 'trainer' || u.role === 'recruiter') && u.status === 'pending'
                  return (
                    <tr key={u.id}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold text-white" style={{ background: `${ROLE_TINTS[u.role]}33`, color: ROLE_TINTS[u.role] }}>
                            {(u.name || 'U').slice(0, 1).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-snow">{u.name}{isSelf && <span className="ml-1.5 text-xs text-golden">(you)</span>}</p>
                            <p className="truncate text-xs text-mist">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                      <td className="px-5 py-3.5"><StatusBadge status={u.status} /></td>
                      <td className="px-5 py-3.5 text-mist">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {pendingReview && (
                            <button
                              type="button"
                              disabled={!!busy[u.id]}
                              onClick={() => act(u.id, 'active', `${u.name} approved.`)}
                              className="inline-flex items-center gap-1 rounded-lg bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                            >
                              <Check size={13} /> Approve
                            </button>
                          )}
                          {u.status === 'active' && u.role !== 'admin' && (
                            <button
                              type="button"
                              disabled={!!busy[u.id]}
                              onClick={() => act(u.id, 'rejected', `${u.name} deactivated.`)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[rgba(236,72,153,0.25)] px-3 py-1.5 text-xs font-semibold text-blush disabled:opacity-50"
                            >
                              <X size={13} /> Deactivate
                            </button>
                          )}
                          {(u.status === 'rejected' || (u.status === 'pending' && u.role === 'learner')) && (
                            <button
                              type="button"
                              disabled={!!busy[u.id]}
                              onClick={() => act(u.id, 'active', `${u.name} reactivated.`)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] px-3 py-1.5 text-xs font-semibold text-success disabled:opacity-50"
                            >
                              <UserCheck size={13} /> Activate
                            </button>
                          )}
                          {!pendingReview && u.status === 'active' && u.role !== 'admin' && (
                            <span className="text-xs text-mist/50">—</span>
                          )}
                          {isSelf && <span className="text-xs text-mist/50">—</span>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex items-center gap-3 p-6 text-sm text-mist">
                <AlertTriangle size={18} className="text-golden" /> No users match your filters.
              </div>
            )}
          </div>
        </section>

        <div className="mt-10 flex justify-end">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.2)] px-5 py-3 text-sm font-semibold text-mist transition-colors hover:text-snow">
            Back to Home <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    </div>
  )
}
