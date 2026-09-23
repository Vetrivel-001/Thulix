import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Bell, Check, RefreshCw, Search } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { ENROLLMENT_STATUS_LABELS, TRAINER_APPLICATION_STATUS_LABELS, RECRUITER_APPLICATION_STATUS_LABELS } from '../auth/AuthService'
import AccountMenu from '../components/auth/AccountMenu'
import AdminSidebar, { MobileAdminNav } from '../components/admin/AdminSidebar'
import AdminOverview from '../components/admin/AdminOverview'
import ApprovalsPanel from '../components/admin/ApprovalsPanel'
import EnquiriesPanel from '../components/admin/EnquiriesPanel'
import TrainersPanel from '../components/admin/TrainersPanel'
import RecruitersPanel from '../components/admin/RecruitersPanel'
import UsersPanel from '../components/admin/UsersPanel'

const VIEW_META = {
  overview: { title: 'Welcome back', sub: 'A quick pulse of every application and account on Thulix.' },
  approvals: { title: 'Approvals', sub: 'Approve, reject or reactivate applications that need your attention.' },
  enquiries: { title: 'Learner Enquiries', sub: 'Track course enquiries from intake through enrollment.' },
  trainers: { title: 'Trainer Applications', sub: 'Review trainer profiles, skills and salary expectations.' },
  recruiters: { title: 'Recruiter Applications', sub: 'Review hiring partners and their company details.' },
  users: { title: 'All Users', sub: 'Search and manage every account on the platform.' },
}

export default function AdminDashboard() {
  const {
    user,
    getAllUsers,
    getPendingApplications,
    getRejectedApplications,
    getStats,
    setUserStatus,
    deleteUser,
    getLearnerEnrollments,
    updateEnrollmentStatus,
    getTrainerApplications,
    updateTrainerApplicationStatus,
    getRecruiterApplications,
    updateRecruiterApplicationStatus,
  } = useAuth()

  const [view, setView] = useState('overview')
  const [users, setUsers] = useState([])
  const [apps, setApps] = useState([])
  const [rejectedApps, setRejectedApps] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [trainerApps, setTrainerApps] = useState([])
  const [recruiterApps, setRecruiterApps] = useState([])
  const [stats, setStats] = useState(null)
  const [busy, setBusy] = useState({})
  const [notice, setNotice] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [confirmingRemove, setConfirmingRemove] = useState(null)
  const [query, setQuery] = useState('')

  const reload = useCallback(() => {
    setUsers(getAllUsers())
    setApps(getPendingApplications())
    setRejectedApps(getRejectedApplications())
    setEnrollments(getLearnerEnrollments())
    setTrainerApps(getTrainerApplications())
    setRecruiterApps(getRecruiterApplications())
    setStats(getStats())
  }, [getAllUsers, getPendingApplications, getRejectedApplications, getLearnerEnrollments, getTrainerApplications, getRecruiterApplications, getStats])

  useEffect(() => {
    reload()
    const onStorage = (e) => {
      if (e.key === 'thulix_users') reload()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [reload])

  const flash = (msg, ok = true) => {
    setNotice({ msg, ok })
    setTimeout(() => setNotice(null), 3500)
  }

  const handleRefresh = () => {
    if (refreshing) return
    setRefreshing(true)
    reload()
    flash('Dashboard refreshed.')
    setTimeout(() => setRefreshing(false), 600)
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

  const approve = (u) => act(u.id, 'active', `${u.name} approved — they can now sign in.`)
  const reject = (u) => act(u.id, 'rejected', `${u.name} rejected.`)
  const reactivate = (u) => act(u.id, 'active', `${u.name} reactivated — they can now sign in.`)
  const deactivate = (u) => act(u.id, 'rejected', `${u.name} deactivated.`)

  const changeEnrollmentStatus = async (id, status) => {
    const entry = enrollments.find((x) => x.id === id)
    setBusy((b) => ({ ...b, [`enr_${id}`]: status }))
    try {
      await updateEnrollmentStatus(id, status)
      reload()
      flash(`${entry?.name || 'Learner'} enquiry marked ${ENROLLMENT_STATUS_LABELS[status] || status}.`)
    } catch (e) {
      flash(e.message || 'Something went wrong.', false)
    } finally {
      setBusy((b) => ({ ...b, [`enr_${id}`]: undefined }))
    }
  }

  const changeTrainerStatus = async (id, status) => {
    const entry = trainerApps.find((x) => x.id === id)
    setBusy((b) => ({ ...b, [`trn_${id}`]: status }))
    try {
      await updateTrainerApplicationStatus(id, status)
      reload()
      flash(`${entry?.name || 'Trainer'} application marked ${TRAINER_APPLICATION_STATUS_LABELS[status] || status}.`)
    } catch (e) {
      flash(e.message || 'Something went wrong.', false)
    } finally {
      setBusy((b) => ({ ...b, [`trn_${id}`]: undefined }))
    }
  }

  const changeRecruiterStatus = async (id, status) => {
    const entry = recruiterApps.find((x) => x.id === id)
    setBusy((b) => ({ ...b, [`rcr_${id}`]: status }))
    try {
      await updateRecruiterApplicationStatus(id, status)
      reload()
      flash(`${entry?.name || 'Recruiter'} application marked ${RECRUITER_APPLICATION_STATUS_LABELS[status] || status}.`)
    } catch (e) {
      flash(e.message || 'Something went wrong.', false)
    } finally {
      setBusy((b) => ({ ...b, [`rcr_${id}`]: undefined }))
    }
  }

  const removeApp = async (u) => {
    setBusy((b) => ({ ...b, [u.id]: 'removing' }))
    try {
      await deleteUser(u.id)
      reload()
      flash(`${u.name} removed.`)
    } catch (e) {
      flash(e.message || 'Something went wrong.', false)
    } finally {
      setBusy((b) => ({ ...b, [u.id]: undefined }))
      setConfirmingRemove(null)
    }
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abyss" role="status" aria-label="Loading">
        <div className="loader" />
      </div>
    )
  }

  const meta = VIEW_META[view] || VIEW_META.overview

  return (
    <div className="flex min-h-screen bg-abyss">
      <AdminSidebar active={view} onNavigate={setView} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-[rgba(148,163,184,0.1)] bg-abyss/80 backdrop-blur-xl">
          <div className="flex items-center gap-2.5 px-4 py-3 sm:px-6">
            <div className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/60 px-3 py-2">
              <Search size={15} className="text-mist" aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users, emails, companies..."
                className="w-full bg-transparent text-sm text-snow placeholder:text-mist/50 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label={refreshing ? 'Refreshing' : 'Refresh dashboard'}
              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.2)] px-3.5 py-2 text-sm font-semibold text-mist transition-colors hover:text-snow disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={15} aria-hidden="true" className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{refreshing ? 'Refreshing…' : 'Refresh'}</span>
            </button>
            <span className="relative grid h-9 w-9 place-items-center rounded-xl text-mist transition-colors hover:text-snow" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-golden" />
            </span>
            <AccountMenu align="right" />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 xl:px-10">
          <MobileAdminNav active={view} onNavigate={setView} />

          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-snow sm:text-3xl">
              {meta.title}
              {view === 'overview' && (
                <span className="text-golden">, {user?.name?.split(' ')[0] || 'Admin'}</span>
              )}
            </h1>
            <p className="mt-2 text-sm text-mist">{meta.sub}</p>
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

          {view === 'overview' && (
            <AdminOverview
              stats={stats}
              enrollments={enrollments}
              trainerApps={trainerApps}
              recruiterApps={recruiterApps}
              onNavigate={setView}
            />
          )}

          {view === 'approvals' && (
            <ApprovalsPanel
              apps={apps}
              rejectedApps={rejectedApps}
              busy={busy}
              confirmingRemove={confirmingRemove}
              onApprove={approve}
              onReject={reject}
              onReactivate={reactivate}
              onRequestRemove={setConfirmingRemove}
              onCancelRemove={() => setConfirmingRemove(null)}
              onConfirmRemove={removeApp}
            />
          )}

          {view === 'enquiries' && (
            <EnquiriesPanel enrollments={enrollments} busy={busy} onChangeStatus={changeEnrollmentStatus} />
          )}

          {view === 'trainers' && (
            <TrainersPanel trainerApps={trainerApps} busy={busy} onChangeStatus={changeTrainerStatus} />
          )}

          {view === 'recruiters' && (
            <RecruitersPanel recruiterApps={recruiterApps} busy={busy} onChangeStatus={changeRecruiterStatus} />
          )}

          {view === 'users' && (
            <UsersPanel
              users={users}
              query={query}
              busy={busy}
              selfId={user?.id}
              onApprove={approve}
              onReactivate={reactivate}
              onDeactivate={deactivate}
            />
          )}
        </main>
      </div>
    </div>
  )
}