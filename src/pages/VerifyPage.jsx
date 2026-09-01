import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Phone, ArrowRight } from 'lucide-react'
import AuthLayout from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import OTPInput from '../components/auth/OTPInput'
import SubmitButton from '../components/auth/SubmitButton'
import * as auth from '../auth/AuthService'
import { EASE } from '../lib/animations'

const META = {
  email: {
    end: 'email address',
    icon: Mail,
    channel: 'email',
    accent: '#06B6D4',
  },
  phone: {
    end: 'phone number',
    icon: Phone,
    channel: 'phone',
    accent: '#10B981',
  },
}

export default function VerifyPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const meta = META[location.pathname.includes('phone') ? 'phone' : 'email']

  const [destination, setDestination] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0) // 0 = enter, 1 = otp

  const sendCode = async (e) => {
    e?.preventDefault()
    setApiError('')
    if (!destination) {
      setError(`Please enter your ${meta.channel === 'email' ? 'email' : 'phone number'}.`)
      return
    }
    setError('')
    setLoading(true)
    try {
      if (meta.channel === 'email') await auth.resendVerification(destination)
      else await auth.sendOtp(destination)
      setStep(1)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verify = async () => {
    setApiError('')
    if (otp.length < 6) {
      setError('Please enter the 6-digit code.')
      return
    }
    setError('')
    setLoading(true)
    try {
      if (meta.channel === 'email') await auth.verifyEmail(destination, otp)
      else await auth.verifyOtp(otp)
      navigate('/', { state: { verified: true } })
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <div className="text-center">
          <div
            className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border"
            style={{ color: meta.accent, borderColor: `${meta.accent}33`, background: `${meta.accent}14` }}
          >
            <meta.icon size={40} aria-hidden="true" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-snow">
            Verify your {meta.channel === 'email' ? 'email' : 'phone'}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-mist">
            {step === 0
              ? `Enter your ${meta.end} and we'll send a verification code.`
              : `${meta.icon === Mail ? 'A code has been sent to your email.' : `A code has been sent to ${destination}.`}`}
          </p>
        </div>

        <div className="mt-7">
          <AuthCard>
            {step === 0 ? (
              <form onSubmit={sendCode} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    {meta.channel === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  <input
                    type={meta.channel === 'email' ? 'email' : 'tel'}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={meta.channel === 'email' ? 'you@example.com' : '+91 98765 43210'}
                    autoComplete={meta.channel}
                    className={`w-full rounded-xl border bg-abyss-2/70 px-4 py-3 text-sm text-snow placeholder:text-mist/50 outline-none transition-all duration-300 focus:ring-2 ${
                      error
                        ? 'border-error/60 focus:border-error focus:ring-error/20'
                        : 'border-[rgba(148,163,184,0.15)] focus:border-neon/70 focus:ring-neon/20'
                    }`}
                  />
                  {error && <p role="alert" className="text-xs text-error">{error}</p>}
                </div>
                {apiError && <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">{apiError}</p>}
                <SubmitButton loading={loading} disabled={loading}>
                  {meta.channel === 'email' ? 'Send Verification Code' : 'Send OTP'} <ArrowRight size={16} />
                </SubmitButton>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-mist">
                  Enter the 6-digit code{meta.channel === 'email' ? '' : ` sent to ${destination}`}.
                </p>
                <OTPInput value={otp} onChange={setOtp} disabled={loading} />
                {error && <p role="alert" className="text-xs text-error">{error}</p>}
                {apiError && <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">{apiError}</p>}
                <SubmitButton loading={loading} disabled={loading || otp.length < 6} onClick={verify} type="button">
                  Verify &amp; Continue <ArrowRight size={16} />
                </SubmitButton>
                <div className="text-center text-xs text-mist">
                  Didn't get a code?{' '}
                  <button type="button" onClick={sendCode} className="font-semibold text-electric hover:text-snow">
                    Resend
                  </button>
                </div>
              </div>
            )}
          </AuthCard>
        </div>

        <div className="mt-6 text-center text-sm text-mist">
          <Link to="/login" className="font-semibold text-electric hover:text-snow">
            Already verified? Sign in
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  )
}
