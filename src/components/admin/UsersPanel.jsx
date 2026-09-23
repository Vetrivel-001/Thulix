import { useMemo, useState } from 'react'
import { AlertTriangle, Check, UserCheck, Users, X } from 'lucide-react'
import { isRejectedApplication } from '../../auth/AuthService'
import { ROLE_LABELS } from '../../auth/permission'
import { RoleBadge, SectionHeader, StatusBadge, UserCell } from './adminUI'

export default function UsersPanel({ users, query, busy, selfId, onApprove, onReactivate, onDeactivate }) {
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      // Rejected applications live in the Approvals section only.
      if (isRejectedApplication(u)) return false
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

  return (
    <section aria-label="All users">
      <SectionHeader icon={Users} label="All Users" count={filtered.length} tone="#06B6D4">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/70 px-3 py-2 text-sm text-snow outline-none focus:border-electric/50"
          aria-label="Filter by role"
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
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
      </SectionHeader>

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
              const isSelf = u.id === selfId
              const pendingReview = (u.role === 'trainer' || u.role === 'recruiter') && u.status === 'pending'
              return (
                <tr key={u.id}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <UserCell name={u.name} email={u.email} role={u.role} />
                      {isSelf && <span className="text-xs text-golden">(you)</span>}
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
                          onClick={() => onApprove(u)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          <Check size={13} aria-hidden="true" /> Approve
                        </button>
                      )}
                      {u.status === 'active' && u.role !== 'admin' && (
                        <button
                          type="button"
                          disabled={!!busy[u.id]}
                          onClick={() => onDeactivate(u)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[rgba(236,72,153,0.25)] px-3 py-1.5 text-xs font-semibold text-blush disabled:opacity-50"
                        >
                          <X size={13} aria-hidden="true" /> Deactivate
                        </button>
                      )}
                      {(u.status === 'rejected' || (u.status === 'pending' && u.role === 'learner')) && (
                        <button
                          type="button"
                          disabled={!!busy[u.id]}
                          onClick={() => onReactivate(u)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] px-3 py-1.5 text-xs font-semibold text-success disabled:opacity-50"
                        >
                          <UserCheck size={13} aria-hidden="true" /> Activate
                        </button>
                      )}
                      {!isSelf && !pendingReview && u.status === 'active' && u.role !== 'admin' && (
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
            <AlertTriangle size={18} className="text-golden" aria-hidden="true" /> No users match your filters.
          </div>
        )}
      </div>
    </section>
  )
}