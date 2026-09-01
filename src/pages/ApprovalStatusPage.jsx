import { motion } from 'framer-motion'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Clock, ShieldAlert, Mail, ArrowRight } from 'lucide-react'
import AuthLayout from '../components/auth/AuthLayout'
import { isReviewRole, ROLE_LABELS } from '../auth/permission'
import { useAuth } from '../auth/AuthContext'
import { EASE } from '../lib/animations'

const VARIANTS = {
  pending: {
    icon: Clock,
    accent: '#F59E0B',
    eyebrow: 'Application under review',
    title: "We're reviewing your application",
    desc: (role) =>
      `Thanks for joining Thulix as a ${ROLE_LABELS[role] || 'member'}. Our team reviews every ${role} account to keep the platform trusted. You'll be notified by email once your account is approved.`,
    cta: 'Back to Home',
  },
  rejected: {
    icon: ShieldAlert,
    accent: '#EC4899',
    eyebrow: 'Application not approved',
    title: 'We could not approve your application',
    desc: (role) =>
      `Unfortunately your ${ROLE_LABELS[role] || 'member'} application wasn't approved at this time. This usually happens when we can't verify company or professional details. You can re-apply with updated information.`,
    cta: 'Update Application',
  },
}

export default function ApprovalStatusPage({ variant, role: roleProp }) {
  const { role: roleParam } = useParams()
  const role = roleProp || roleParam || ''

  const navigate = useNavigate()
  const { user, logout } = useAuth()

  if (!isReviewRole(role)) {
    // Wrong / unknown role on this page.
    return <Navigate to="/unauthorized" replace />
  }

  // Only allow a user to view their own role's status page.
  if (user?.role !== role) {
    return <Navigate to="/unauthorized" replace />
  }

  const cfg = VARIANTS[variant]

  const primaryAction = () => {
    if (variant === 'pending') {
      // Don't send pending users to their dashboard (it redirects straight back to pending).
      navigate('/')
    } else {
      // Re-apply -> switch to the matching register flow for the role.
      navigate(`/register/${role}`)
    }
  }

  const onLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="text-center">
        <div
          className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border"
          style={{ color: cfg.accent, borderColor: `${cfg.accent}33`, background: `${cfg.accent}14` }}
        >
          <cfg.icon size={40} aria-hidden="true" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: cfg.accent }}>
          {cfg.eyebrow}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-snow sm:text-4xl">{cfg.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-mist">{cfg.desc(role)}</p>

        {variant === 'pending' && (
          <p className="mx-auto mt-6 inline-flex max-w-md items-center gap-2 rounded-xl border border-golden/30 bg-golden/10 px-4 py-3 text-left text-sm text-snow">
            <Mail size={16} className="shrink-0 text-golden" />
            <span>
              Keep an eye on your inbox — approval is typically quick. You can also{' '}
              <button type="button" onClick={() => window.__resendApprovalEmail?.()} className="font-semibold text-golden hover:text-snow">
                resend the notification
              </button>
              .
            </span>
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={primaryAction}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-neon/30"
          >
            {cfg.cta} <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(148,163,184,0.2)] px-6 py-3 text-sm font-semibold text-mist transition-colors hover:text-snow"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-mist">
          Need help?{' '}
          <Link to="/login" className="font-semibold text-electric hover:text-snow">
            Contact Support
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  )
}
