import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import AuthLayout, { AuthBrand } from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import OTPInput from '../components/auth/OTPInput'
import SubmitButton from '../components/auth/SubmitButton'
import { useAuth } from '../auth/AuthContext'
import * as auth from '../auth/AuthService'
import { validatePassword, validateConfirm } from '../auth/validation'
import { EASE } from '../lib/animations'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const email = location.state?.email || null

  const [step, setStep] = useState(0) // 0 = OTP, 1 = new password, 2 = done
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  // If no email provided, we have nothing to reset. Link back.
  if (!email) {
    return (
      <AuthLayout>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="text-center">
          <AuthBrand eyebrow="Recover account" title="Missing email" sub="We need to know which account to reset. Start over below." />
          <Link to="/forgot-password" className="inline-flex items-center gap-1.5 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-3 text-sm font-semibold text-white">
            <ArrowLeft size={16} /> Back to Forgot Password
          </Link>
        </motion.div>
      </AuthLayout>
    )
  }

  const verifyOtp = async () => {
    setApiError('')
    setErrors({})
    if (otp.length < 6) {
      setErrors({ otp: 'Please enter the 6-digit code.' })
      return
    }
    setLoading(true)
    try {
      await auth.verifyOtp(otp)
      setStep(1)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const submitNewPassword = async (e) => {
    e.preventDefault()
    const errs = {
      password: validatePassword(password),
      confirm: validateConfirm(password, confirm),
    }
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return
    setApiError('')
    setLoading(true)
    try {
      const { verifiedUser } = await auth.resetPassword(email, password)
      setStep(2)
      // Auto sign-in so they land in their dashboard.
      if (verifiedUser) {
        await login({ email, password })
      }
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <AuthBrand
          eyebrow="Reset password"
          title="Set a new password"
          sub={`Reset password for ${email}.`}
        />
        <AuthCard>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="space-y-4"
              >
                <p className="text-sm text-mist">Enter the 6-digit verification code sent to your email.</p>
                <OTPInput value={otp} onChange={setOtp} disabled={loading} />
                {errors.otp && <p role="alert" className="text-xs text-error">{errors.otp}</p>}
                {apiError && <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">{apiError}</p>}
                <SubmitButton loading={loading} disabled={loading || otp.length < 6} onClick={verifyOtp} type="button">
                  Verify Code <ArrowRight size={16} />
                </SubmitButton>
                <div className="text-center text-xs text-mist">
                  Didn't get a code?{' '}
                  <button type="button" onClick={() => auth.resendOtp()} className="font-semibold text-electric hover:text-snow">
                    Resend
                  </button>{' '}
                  or{' '}
                  <Link to="/forgot-password" className="font-semibold text-electric hover:text-snow">
                    use a different email
                  </Link>
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.form
                key="newpw"
                noValidate
                onSubmit={submitNewPassword}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label htmlFor="rp-pass" className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="rp-pass"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/70 px-4 py-3 pr-12 text-sm text-snow outline-none transition-all duration-300 focus:border-neon/70 focus:ring-2 focus:ring-neon/20"
                    />
                    <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-mist transition-colors hover:text-snow" aria-label="Toggle password visibility">
                      {showPw ? <EyeOff16 /> : <Eye16 />}
                    </button>
                  </div>
                  {errors.password && <p role="alert" className="text-xs text-error">{errors.password}</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="rp-confirm" className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    Confirm New Password
                  </label>
                  <input
                    id="rp-confirm"
                    type={showPw ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/70 px-4 py-3 text-sm text-snow outline-none transition-all duration-300 focus:border-neon/70 focus:ring-2 focus:ring-neon/20"
                  />
                  {errors.confirm && <p role="alert" className="text-xs text-error">{errors.confirm}</p>}
                </div>
                {apiError && <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">{apiError}</p>}
                <SubmitButton loading={loading} disabled={loading}>
                  Reset Password <ArrowRight size={16} />
                </SubmitButton>
              </motion.form>
            )}
            {step === 2 && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="space-y-4 text-center"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint/15 text-mint">
                  <CheckIcon />
                </div>
                <h3 className="font-heading text-xl font-bold text-snow">Password reset</h3>
                <p className="text-sm text-mist">Your password has been updated successfully. You're now signed in.</p>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Continue to Thulix
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </AuthCard>
      </motion.div>
    </AuthLayout>
  )
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
function Eye16() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
function EyeOff16() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}
