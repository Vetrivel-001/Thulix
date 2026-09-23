import { useState } from 'react'
import { AlertTriangle, Briefcase } from 'lucide-react'
import {
  Badge,
  EmptyState,
  SectionHeader,
  StatusSelect,
  UserCell,
  RECRUITER_APPLICATION_STATUS_LABELS,
  RECRUITER_TINTS,
} from './adminUI'

export default function RecruitersPanel({ recruiterApps, busy, onChangeStatus }) {
  const [filter, setFilter] = useState('all')
  const displayed =
    filter === 'all'
      ? recruiterApps
      : recruiterApps.filter((r) => (r.application?.applicationStatus || 'new') === filter)

  return (
    <section aria-label="Recruiter applications">
      <SectionHeader icon={Briefcase} label="Recruiter Applications" count={recruiterApps.length} tone="#10B981">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/70 px-3 py-2 text-sm text-snow outline-none focus:border-mint/50"
          aria-label="Filter recruiter applications by status"
        >
          <option value="all">All statuses</option>
          {Object.entries(RECRUITER_APPLICATION_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </SectionHeader>

      {recruiterApps.length === 0 ? (
        <EmptyState message="No recruiter applications yet." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[rgba(16,185,129,0.24)] bg-abyss-2/40">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(148,163,184,0.1)] text-xs uppercase tracking-wider text-mist">
                <th className="px-5 py-3 font-semibold">Application ID</th>
                <th className="px-5 py-3 font-semibold">Recruiter</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Job Title</th>
                <th className="px-5 py-3 font-semibold">Company Name</th>
                <th className="px-5 py-3 font-semibold">Company Email / Domain</th>
                <th className="px-5 py-3 font-semibold">Website</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(148,163,184,0.08)]">
              {displayed.map((r) => {
                const current = r.application?.applicationStatus || 'new'
                return (
                  <tr key={r.id} className="align-middle">
                    <td className="px-5 py-3.5">
                      <span className="rounded-lg bg-mint/10 px-2 py-1 font-mono text-xs font-semibold text-mint">
                        {r.application?.applicationId || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <UserCell name={r.name} email={r.email} role="recruiter" />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-mist">{r.application?.phone || '—'}</td>
                    <td className="max-w-[160px] truncate px-5 py-3.5 text-snow">{r.application?.jobTitle || '—'}</td>
                    <td className="max-w-[180px] truncate px-5 py-3.5 text-snow">{r.application?.companyName || '—'}</td>
                    <td className="max-w-[180px] truncate px-5 py-3.5 text-mist">{r.application?.companyEmail || '—'}</td>
                    <td className="max-w-[180px] truncate px-5 py-3.5 text-mist">{r.application?.website || '—'}</td>
                    <td className="max-w-[160px] truncate px-5 py-3.5 text-mist">{r.application?.companyLocation || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col items-start gap-1.5">
                        <Badge color={RECRUITER_TINTS[current] || '#F59E0B'}>
                          {RECRUITER_APPLICATION_STATUS_LABELS[current] || current}
                        </Badge>
                        <StatusSelect
                          value={current}
                          labels={RECRUITER_APPLICATION_STATUS_LABELS}
                          disabled={!!busy[`rcr_${r.id}`]}
                          onChange={(ev) => onChangeStatus(r.id, ev.target.value)}
                          ariaLabel={`Application status for ${r.name}`}
                          focusClass="focus:border-mint/60"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-mist">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {displayed.length === 0 && (
            <div className="flex items-center gap-3 p-6 text-sm text-mist">
              <AlertTriangle size={18} className="text-golden" aria-hidden="true" /> No applications match this status.
            </div>
          )}
        </div>
      )}
    </section>
  )
}