import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, Navigate } from 'react-router-dom'
import {
  GraduationCap, BookOpen, Phone, Mail, User, CalendarDays, Clock, FileText, ShieldAlert, ArrowRight,
  Pencil, Check, X,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { ENROLLMENT_STATUSES, ENROLLMENT_STATUS_LABELS } from '../auth/AuthService'
import { ROLE_LABELS } from '../auth/permission'
import { EASE } from '../lib/animations'
import FormField from '../components/auth/FormField'
import { SelectBlock } from '../components/auth/FormControls'
import { sendEnrollmentUpdate } from '../auth/EmailService'

const ENROLLMENT_TINT = '#8B5CF6'
const STATUS_TINT = { new: '#F59E0B', contacted: '#06B6D4', in_progress: '#8B5CF6', enrolled: '#10B981', closed: '#94A3B8' }

// Mirror of the enrollment wizard option lists (source of truth: LearnerRegister).
const DEGREE_OPTIONS = ['BCA', 'B.Sc Computer Science', 'B.Sc Information Technology', 'B.Tech / BE', 'MCA', 'M.Sc', 'MBA', 'Other']
const COURSE_OPTIONS = ['Full Stack Development', 'Java Development', 'React Development', 'Python Development', 'Data Science', 'AI / Machine Learning', 'UI/UX Design', 'Other']

// Builds editable draft state from a stored enrollment, mapping custom values
// back onto the "Other" branch of the select lists.
function enrollmentDraft(e = {}) {
  const degree = DEGREE_OPTIONS.includes(e.departmentOrDegree) ? e.departmentOrDegree : (e.departmentOrDegree ? 'Other' : '')
  const course = COURSE_OPTIONS.includes(e.neededCourse) ? e.neededCourse : (e.neededCourse ? 'Other' : '')
  return {
    name: e.name || '',
    phone: e.phone || '',
    degree,
    otherDegree: e.otherDegree || (degree === 'Other' ? e.departmentOrDegree || '' : ''),
    course,
    otherCourse: e.otherCourse || (course === 'Other' ? e.neededCourse || '' : ''),
  }
}

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
})

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 px-4 py-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-electric/15 text-electric" aria-hidden="true">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">{label}</p>
        <p className="truncate text-sm font-medium text-snow">{value || '—'}</p>
      </div>
    </div>
  )
}

// Visual lifecycle: New → Contacted → In Progress → Enrolled → Closed.
function StatusTimeline({ current }) {
  const idx = ENROLLMENT_STATUSES.indexOf(current)
  return (
    <div className="border-t border-[rgba(148,163,184,0.1)] px-5 py-5 sm:px-6">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">Enrollment Progress</p>
      <div className="flex items-center">
        {ENROLLMENT_STATUSES.map((key, i) => {
          const done = i < idx
          const active = i === idx
          const color = STATUS_TINT[key]
          return (
            <div key={key} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold transition-colors"
                  style={{
                    background: done || active ? `${color}22` : 'rgba(148,163,184,0.08)',
                    color: done || active ? color : '#64748B',
                    border: `1px solid ${done || active ? color : 'rgba(148,163,184,0.2)'}`,
                    boxShadow: active ? `0 0 0 4px ${color}14` : undefined,
                  }}
                >
                  {i + 1}
                </span>
                <span className={`whitespace-nowrap text-[9px] font-medium uppercase tracking-wide ${active ? 'text-snow' : done ? 'text-mist' : 'text-mist/40'}`}>
                  {ENROLLMENT_STATUS_LABELS[key]}
                </span>
              </div>
              {i < ENROLLMENT_STATUSES.length - 1 && (
                <div className="relative mx-1.5 mt-3 h-0.5 min-w-3 flex-1 self-start">
                  <div className="absolute inset-0 rounded-full bg-[rgba(148,163,184,0.15)]" />
                  {done && <div className="absolute inset-y-0 left-0 rounded-full" style={{ background: color }} />}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Learner profile + enrollment enquiry summary. Never renders password/auth data.
export default function ProfilePage() {
  const { user, getLearnerEnrollment, updateLearnerEnrollment } = useAuth()
  const [enrollment, setEnrollment] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveOk, setSaveOk] = useState(false)

  useEffect(() => {
    if (user?.role === 'learner') setEnrollment(getLearnerEnrollment(user.id) || null)
  }, [user, getLearnerEnrollment])

  const roleLabel = ROLE_LABELS[user?.role] || 'Member'

  if (user?.role === 'learner' && user?.status === 'rejected') return <Navigate to="/" replace />

  // Learners may edit their own enquiry until our team starts acting on it.
  const canEdit = enrollment?.enrollmentStatus === 'new'

  const startEdit = () => {
    setDraft(enrollmentDraft(enrollment || {}))
    setSaveError('')
    setSaveOk(false)
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setDraft(null)
    setSaveError('')
  }

  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }))

  const saveEdit = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateLearnerEnrollment(user.id, {
        name: draft.name,
        phone: draft.phone,
        departmentOrDegree: draft.degree === 'Other' ? draft.otherDegree : draft.degree,
        neededCourse: draft.course === 'Other' ? draft.otherCourse : draft.course,
        otherDegree: draft.degree === 'Other' ? draft.otherDegree : '',
        otherCourse: draft.course === 'Other' ? draft.otherCourse : '',
      })
      setEnrollment(updated)
      setEditing(false)
      setDraft(null)
      setSaveOk(true)
      // Update notification (DEVELOPMENT/MOCK) — never blocks the save.
      try {
        await sendEnrollmentUpdate(updated)
      } catch (emailErr) {
        // eslint-disable-next-line no-console
        console.warn('[EmailService:DEVELOPMENT-ONLY] update email not delivered', emailErr)
      }
    } catch (err) {
      setSaveError(err.message || 'Could not save your changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-abyss pt-28 pb-20">
      <div aria-hidden="true" className="absolute inset-0 grid-bg" />

      <div className="relative mx-auto max-w-3xl px-5 lg:px-8">
        <motion.div {...rise(0.05)}>
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gradient">My Account</p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-snow sm:text-4xl">My Profile</h1>
            <p className="mt-2 text-mist">Your details and course enquiry on Thulix.</p>
          </header>

          {/* Identity card */}
          <div className="relative overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/60 p-6 backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl" style={{ background: `${ENROLLMENT_TINT}44` }} />
            <div className="relative flex flex-wrap items-center gap-5">
              <span
                className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-white"
                style={{ background: `linear-gradient(120deg,#06B6D4,#8B5CF6)` }}
              >
                {(enrollment?.name || user?.name || 'U').slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-xl font-bold text-snow">{enrollment?.name || user?.name}</p>
                <p className="truncate text-sm text-mist">{enrollment?.email || user?.email}</p>
                <span className="mt-2 inline-flex rounded-full bg-[rgba(139,92,246,0.15)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neon">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Enrollment enquiry (learners) */}
          {user?.role === 'learner' ? (
            <motion.div {...rise(0.1)} className="mt-6">
              {enrollment ? (
                <div className="overflow-hidden rounded-3xl border border-[rgba(139,92,246,0.2)] bg-abyss-2/40">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(148,163,184,0.1)] px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <GraduationCap size={18} className="text-neon" aria-hidden="true" />
                      <h2 className="font-heading text-lg font-bold text-snow">My Enrollment</h2>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{
                          background: `${STATUS_TINT[enrollment.enrollmentStatus] || '#F59E0B'}1a`,
                          color: STATUS_TINT[enrollment.enrollmentStatus] || '#F59E0B',
                        }}
                      >
                        {ENROLLMENT_STATUS_LABELS[enrollment.enrollmentStatus] || enrollment.enrollmentStatus}
                      </span>
                      {canEdit && !editing ? (
                        <button
                          type="button"
                          onClick={startEdit}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.3)] bg-neon/10 px-3 py-1.5 text-xs font-semibold text-neon transition-colors hover:bg-neon/20"
                        >
                          <Pencil size={13} aria-hidden="true" /> Edit
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {!canEdit && !editing ? (
                    <p className="border-b border-[rgba(148,163,184,0.1)] px-6 py-2.5 text-[11px] text-mist">
                      Your enquiry is now being handled by our team, so it can no longer be edited here. Contact admissions to make changes.
                    </p>
                  ) : null}

                  {saveOk ? (
                    <div className="flex items-center gap-2 border-b border-[rgba(16,185,129,0.25)] bg-success/10 px-6 py-2.5 text-xs font-medium text-success">
                      <Check size={14} aria-hidden="true" /> Your enrollment details were updated.
                    </div>
                  ) : null}

                  {editing ? (
                    <div className="space-y-4 p-6">
                      {saveError ? (
                        <p role="alert" className="rounded-xl border border-error/40 bg-error/10 px-4 py-2.5 text-xs font-medium text-error">
                          {saveError}
                        </p>
                      ) : null}
                      <FormField
                        label="Full Name"
                        id="edit-name"
                        value={draft.name}
                        onChange={(e) => setField('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                      <FormField
                        label="Phone Number"
                        id="edit-phone"
                        type="tel"
                        value={draft.phone}
                        onChange={(e) => setField('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                      <SelectBlock
                        label="Department / Degree"
                        id="edit-degree"
                        options={DEGREE_OPTIONS}
                        value={draft.degree}
                        onChange={(v) => setField('degree', v)}
                      />
                      {draft.degree === 'Other' ? (
                        <FormField
                          label="Please specify your degree"
                          id="edit-otherDegree"
                          value={draft.otherDegree}
                          onChange={(e) => setField('otherDegree', e.target.value)}
                          placeholder="e.g. B.Com, Diploma in ECE"
                          required
                        />
                      ) : null}
                      <SelectBlock
                        label="Needed Course"
                        id="edit-course"
                        options={COURSE_OPTIONS}
                        value={draft.course}
                        onChange={(v) => setField('course', v)}
                      />
                      {draft.course === 'Other' ? (
                        <FormField
                          label="Please specify your course"
                          id="edit-otherCourse"
                          value={draft.otherCourse}
                          onChange={(e) => setField('otherCourse', e.target.value)}
                          placeholder="e.g. Cloud Computing, DevOps"
                          required
                        />
                      ) : null}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={saveEdit}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          <Check size={15} aria-hidden="true" /> {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.2)] px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:text-snow disabled:opacity-60"
                        >
                          <X size={15} aria-hidden="true" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 p-6 sm:grid-cols-2">
                      <Field icon={FileText} label="Application No" value={enrollment.enquiryId} />
                      <Field icon={User} label="Full Name" value={enrollment.name} />
                      <Field icon={Mail} label="Email" value={enrollment.email} />
                      <Field icon={Phone} label="Phone" value={enrollment.phone} />
                      <Field icon={GraduationCap} label="Department / Degree" value={enrollment.departmentOrDegree} />
                      <Field icon={BookOpen} label="Interested Course" value={enrollment.neededCourse} />
                      <Field
                        icon={CalendarDays}
                        label="Submission Date"
                        value={enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : ''}
                      />
                      <Field
                        icon={Clock}
                        label="Last Updated"
                        value={enrollment.updatedAt ? new Date(enrollment.updatedAt).toLocaleDateString() : ''}
                      />
                    </div>
                  )}

                  <StatusTimeline current={enrollment.enrollmentStatus} />
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-[rgba(139,92,246,0.2)] bg-abyss-2/40 p-6 text-sm text-mist">
                  <ShieldAlert size={18} className="text-neon" />
                  No enrollment record found for this account.
                </div>
              )}
            </motion.div>
          ) : null}

          <motion.div {...rise(0.15)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-neon/30"
            >
              Back to Home <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}