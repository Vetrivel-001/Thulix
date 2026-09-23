import { useState } from 'react'
import { AlertTriangle, Presentation } from 'lucide-react'
import {
  Badge,
  EmptyState,
  SectionHeader,
  StatusSelect,
  UserCell,
  formatSalary,
  TRAINER_APPLICATION_STATUS_LABELS,
  TRAINER_TINTS,
} from './adminUI'

export default function TrainersPanel({ trainerApps, busy, onChangeStatus }) {
  const [filter, setFilter] = useState('all')
  const displayed =
    filter === 'all' ? trainerApps : trainerApps.filter((t) => (t.application?.applicationStatus || 'new') === filter)

  return (
    <section aria-label="Trainer applications">
      <SectionHeader icon={Presentation} label="Trainer Applications" count={trainerApps.length} tone="#06B6D4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/70 px-3 py-2 text-sm text-snow outline-none focus:border-electric/50"
          aria-label="Filter trainer applications by status"
        >
          <option value="all">All statuses</option>
          {Object.entries(TRAINER_APPLICATION_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </SectionHeader>

      {trainerApps.length === 0 ? (
        <EmptyState message="No trainer applications yet." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[rgba(6,182,212,0.24)] bg-abyss-2/40">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(148,163,184,0.1)] text-xs uppercase tracking-wider text-mist">
                <th className="px-5 py-3 font-semibold">Application ID</th>
                <th className="px-5 py-3 font-semibold">Trainer</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Course Offered</th>
                <th className="px-5 py-3 font-semibold">Known Skills</th>
                <th className="px-5 py-3 font-semibold">Experience</th>
                <th className="px-5 py-3 font-semibold">Salary Exp.</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(148,163,184,0.08)]">
              {displayed.map((t) => {
                const current = t.application?.applicationStatus || 'new'
                return (
                  <tr key={t.id} className="align-middle">
                    <td className="px-5 py-3.5">
                      <span className="rounded-lg bg-electric/10 px-2 py-1 font-mono text-xs font-semibold text-electric">
                        {t.application?.applicationId || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <UserCell name={t.name} email={t.email} role="trainer" />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-mist">{t.application?.phone || '—'}</td>
                    <td className="max-w-[180px] truncate px-5 py-3.5 text-snow">{t.application?.courseOffered || '—'}</td>
                    <td className="max-w-[200px] truncate px-5 py-3.5 text-mist">
                      {(t.application?.knownSkills || []).join(', ') || '—'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-mist">{t.application?.experience || '—'}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-mist">{formatSalary(t.application?.salaryExpectation)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col items-start gap-1.5">
                        <Badge color={TRAINER_TINTS[current] || '#F59E0B'}>
                          {TRAINER_APPLICATION_STATUS_LABELS[current] || current}
                        </Badge>
                        <StatusSelect
                          value={current}
                          labels={TRAINER_APPLICATION_STATUS_LABELS}
                          disabled={!!busy[`trn_${t.id}`]}
                          onChange={(ev) => onChangeStatus(t.id, ev.target.value)}
                          ariaLabel={`Application status for ${t.name}`}
                          focusClass="focus:border-electric/60"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-mist">
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}
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