import { Check, Mail, Trash2, Undo2, UserCheck, UserX, X } from 'lucide-react'
import { EmptyState, RoleBadge, SectionHeader, StatusBadge, ROLE_TINTS } from './adminUI'

function PersonLine({ user }) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-bold text-white"
        style={{ background: `${ROLE_TINTS[user.role] || '#94A3B8'}33`, color: ROLE_TINTS[user.role] || '#94A3B8' }}
      >
        {(user.name || 'U').slice(0, 1).toUpperCase()}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold text-snow">{user.name}</p>
          <RoleBadge role={user.role} />
          {user.status === 'rejected' && <StatusBadge status={user.status} />}
        </div>
        <p className="flex items-center gap-1.5 truncate text-sm text-mist">
          <Mail size={12} className="shrink-0" aria-hidden="true" /> {user.email}
        </p>
        <p className="mt-0.5 truncate text-xs text-mist/70">
          {user.role === 'trainer'
            ? [user.meta?.professionalTitle, user.meta?.expertise, user.meta?.experience].filter(Boolean).join(' · ')
            : user.role === 'learner'
              ? [user.meta?.degree, user.meta?.department, user.meta?.educationStatus, user.meta?.city].filter(Boolean).join(' · ')
              : [user.meta?.companyName, user.meta?.companyLocation].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  )
}

export default function ApprovalsPanel({
  apps,
  rejectedApps,
  busy,
  confirmingRemove,
  onApprove,
  onReject,
  onReactivate,
  onRequestRemove,
  onCancelRemove,
  onConfirmRemove,
}) {

  return (
    <>
      {/* Pending applications */}
      <section aria-label="Pending applications">
        <SectionHeader icon={UserCheck} label="Pending Applications" count={apps.length} tone="#F59E0B" />

        {apps.length === 0 ? (
          <div className="mt-4">
            <EmptyState message="No pending applications — you're all caught up." />
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40">
            <div className="divide-y divide-[rgba(148,163,184,0.08)]">
              {apps.map((a) => (
                <div key={a.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <PersonLine user={a} />
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      disabled={!!busy[a.id]}
                      onClick={() => onApprove(a)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <Check size={15} aria-hidden="true" /> {busy[a.id] === 'active' ? 'Saving…' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      disabled={!!busy[a.id]}
                      onClick={() => onReject(a)}
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

      {/* Rejected applications */}
      <section aria-label="Rejected applications" className="mt-10">
        <SectionHeader icon={UserX} label="Rejected Applications" count={rejectedApps.length} tone="#EC4899" />

        {rejectedApps.length === 0 ? (
          <div className="mt-4">
            <EmptyState message="No rejected applications." />
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-[rgba(236,72,153,0.2)] bg-abyss-2/40">
            <div className="divide-y divide-[rgba(148,163,184,0.08)]">
              {rejectedApps.map((a) => (
                <div key={a.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <PersonLine user={a} />
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      disabled={!!busy[a.id]}
                      onClick={() => onReactivate(a)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] px-4 py-2 text-sm font-semibold text-success transition-colors hover:bg-[rgba(16,185,129,0.15)] disabled:opacity-50"
                    >
                      <Undo2 size={15} aria-hidden="true" /> {busy[a.id] === 'active' ? 'Saving…' : 'Reactivate'}
                    </button>
                    {confirmingRemove === a.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!!busy[a.id]}
                          onClick={() => onConfirmRemove(a)}
                          className="inline-flex items-center gap-1 rounded-xl bg-[rgba(236,72,153,0.9)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[rgba(236,72,153,1)] disabled:opacity-50"
                        >
                          <Trash2 size={14} aria-hidden="true" /> {busy[a.id] === 'removing' ? 'Removing…' : 'Confirm'}
                        </button>
                        <button
                          type="button"
                          disabled={!!busy[a.id]}
                          onClick={onCancelRemove}
                          className="inline-flex items-center rounded-xl border border-[rgba(148,163,184,0.2)] px-3 py-2 text-sm text-mist transition-colors hover:text-snow"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={!!busy[a.id]}
                        onClick={() => onRequestRemove(a.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(236,72,153,0.3)] bg-[rgba(236,72,153,0.08)] px-4 py-2 text-sm font-semibold text-blush transition-colors hover:bg-[rgba(236,72,153,0.15)] disabled:opacity-50"
                      >
                        <Trash2 size={15} aria-hidden="true" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}