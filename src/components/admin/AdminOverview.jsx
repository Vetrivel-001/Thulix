import { ArrowUpRight, Clock, UserCheck, UserX, Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ROLE_LABELS } from '../../auth/permission'
import {
  Badge,
  RoleBadge,
  StatusBadge,
  ENROLLMENT_TINTS,
  TRAINER_TINTS,
  RECRUITER_TINTS,
  ROLE_TINTS,
  ENROLLMENT_STATUS_LABELS,
  TRAINER_APPLICATION_STATUS_LABELS,
  RECRUITER_APPLICATION_STATUS_LABELS,
} from './adminUI'

const TOOLTIP_STYLE = {
  background: '#0F172A',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: 12,
  fontSize: 12,
  color: '#F8FAFC',
}
const TICK_STYLE = { color: '#94A3B8', fontSize: 11 }

function countByStatus(list, labelMap, path) {
  return Object.keys(labelMap).map((key) => ({
    status: labelMap[key],
    count: list.filter((item) => (path(item) || 'new') === key).length,
  }))
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-snow">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-mist">{subtitle}</p>}
      </div>
      <div className="min-h-[180px] flex-1">{children}</div>
    </div>
  )
}

function StatusBars({ data, dataKey, color, height = 180 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -14, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
        <XAxis dataKey="status" tickLine={false} axisLine={false} tick={TICK_STYLE} interval={0} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={TICK_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={26} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function KpiCard({ label, value, icon: Icon, color, note, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 p-5 text-left transition-colors hover:border-[rgba(148,163,184,0.25)]"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl" style={{ background: `${color}44` }} />
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${color}1a`, color }}>
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-3 font-heading text-3xl font-bold text-snow">{value}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-mist">
        {note}
        <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
      </p>
    </button>
  )
}

export default function AdminOverview({ stats, enrollments, trainerApps, recruiterApps, onNavigate }) {
  const roleData = Object.entries(stats.byRole)
    .filter(([, v]) => v > 0)
    .map(([role, count]) => ({ name: ROLE_LABELS[role], value: count, color: ROLE_TINTS[role] }))

  const learnerData = countByStatus(
    enrollments,
    ENROLLMENT_STATUS_LABELS,
    (e) => e.enrollment?.enrollmentStatus,
  )
  const trainerData = countByStatus(
    trainerApps,
    TRAINER_APPLICATION_STATUS_LABELS,
    (t) => t.application?.applicationStatus,
  )
  const recruiterData = countByStatus(
    recruiterApps,
    RECRUITER_APPLICATION_STATUS_LABELS,
    (r) => r.application?.applicationStatus,
  )

  const kpis = [
    { label: 'Total Users', value: stats.total, icon: Users, color: '#94A3B8', note: 'Across all roles', view: 'users' },
    { label: 'Active', value: stats.active, icon: UserCheck, color: '#10B981', note: 'Can sign in today', view: 'users' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: '#F59E0B', note: 'Waiting on review', view: 'approvals' },
    { label: 'Rejected', value: stats.rejectedApps, icon: UserX, color: '#EC4899', note: 'Rejected applications', view: 'approvals' },
  ]

  return (
    <>
      <section aria-label="Statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} onClick={() => onNavigate(k.view)} />
        ))}
      </section>

      <section aria-label="Charts" className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Users by role" subtitle="Live distribution of every account">
          {roleData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-mist">No users yet.</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={46} outerRadius={68} paddingAngle={3} strokeWidth={0}>
                    {roleData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                {roleData.map((r) => (
                  <Badge key={r.name} color={r.color}>
                    {r.name} · {r.value}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </ChartCard>

        <ChartCard title="Learner enquiries" subtitle="By enrollment status">
          <StatusBars data={learnerData} dataKey="count" color={ENROLLMENT_TINTS.enrolled} />
        </ChartCard>

        <ChartCard title="Trainer applications" subtitle="By application status">
          <StatusBars data={trainerData} dataKey="count" color={TRAINER_TINTS.reviewed} />
        </ChartCard>
      </section>

      <section aria-label="More" className="mt-4 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Recruiter applications" subtitle="By application status">
          <StatusBars data={recruiterData} dataKey="count" color={RECRUITER_TINTS.reviewed} />
        </ChartCard>

        <div className="flex flex-col rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 p-5 lg:col-span-2">
          <div className="mb-3">
            <p className="text-sm font-semibold text-snow">Recent activity</p>
            <p className="mt-0.5 text-xs text-mist">Newest accounts and submissions</p>
          </div>
          {stats.recent.length === 0 ? (
            <p className="text-sm text-mist">Nothing here yet.</p>
          ) : (
            <ul className="divide-y divide-[rgba(148,163,184,0.08)]">
              {stats.recent.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-3 py-3">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold"
                    style={{ background: `${ROLE_TINTS[r.role] || '#94A3B8'}33`, color: ROLE_TINTS[r.role] || '#94A3B8' }}
                  >
                    {(r.name || 'U').slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-snow">{r.name}</p>
                    <p className="truncate text-xs text-mist">{r.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RoleBadge role={r.role} />
                    <StatusBadge status={r.status} />
                  </div>
                  <span className="w-24 whitespace-nowrap text-right text-xs text-mist">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}