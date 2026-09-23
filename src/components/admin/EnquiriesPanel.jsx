import { useState } from 'react'
import { AlertTriangle, GraduationCap } from 'lucide-react'
import {
  Badge,
  EmptyState,
  SectionHeader,
  StatusSelect,
  UserCell,
  ENROLLMENT_STATUS_LABELS,
  ENROLLMENT_TINTS,
} from './adminUI'

export default function EnquiriesPanel({ enrollments, busy, onChangeStatus }) {
  const [filter, setFilter] = useState('all')
  const displayed = filter === 'all' ? enrollments : enrollments.filter((e) => (e.enrollment?.enrollmentStatus || 'new') === filter)

  return (
    <section aria-label="Learner enquiries">
      <SectionHeader icon={GraduationCap} label="Learner Enquiries" count={enrollments.length} tone="#8B5CF6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/70 px-3 py-2 text-sm text-snow outline-none focus:border-neon/50"
          aria-label="Filter enquiries by status"
        >
          <option value="all">All statuses</option>
          {Object.entries(ENROLLMENT_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </SectionHeader>

      {enrollments.length === 0 ? (
        <EmptyState message="No learner enquiries yet." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[rgba(139,92,246,0.22)] bg-abyss-2/40">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(148,163,184,0.1)] text-xs uppercase tracking-wider text-mist">
                <th className="px-5 py-3 font-semibold">Enquiry ID</th>
                <th className="px-5 py-3 font-semibold">Learner</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Department / Degree</th>
                <th className="px-5 py-3 font-semibold">Needed Course</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(148,163,184,0.08)]">
              {displayed.map((e) => {
                const current = e.enrollment?.enrollmentStatus || 'new'
                return (
                  <tr key={e.id} className="align-middle">
                    <td className="px-5 py-3.5">
                      <span className="rounded-lg bg-neon/10 px-2 py-1 font-mono text-xs font-semibold text-neon">
                        {e.enrollment?.enquiryId || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <UserCell name={e.name} email={e.email} role="learner" />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-mist">{e.enrollment?.phone || '—'}</td>
                    <td className="max-w-[180px] truncate px-5 py-3.5 text-mist">{e.enrollment?.departmentOrDegree || '—'}</td>
                    <td className="max-w-[180px] truncate px-5 py-3.5 text-snow">{e.enrollment?.neededCourse || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col items-start gap-1.5">
                        <Badge color={ENROLLMENT_TINTS[current] || '#F59E0B'}>
                          {ENROLLMENT_STATUS_LABELS[current] || current}
                        </Badge>
                        <StatusSelect
                          value={current}
                          labels={ENROLLMENT_STATUS_LABELS}
                          disabled={!!busy[`enr_${e.id}`]}
                          onChange={(ev) => onChangeStatus(e.id, ev.target.value)}
                          ariaLabel={`Enrollment status for ${e.name}`}
                          focusClass="focus:border-neon/60"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-mist">
                      {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {displayed.length === 0 && (
            <div className="flex items-center gap-3 p-6 text-sm text-mist">
              <AlertTriangle size={18} className="text-golden" aria-hidden="true" /> No enquiries match this status.
            </div>
          )}
        </div>
      )}
    </section>
  )
}