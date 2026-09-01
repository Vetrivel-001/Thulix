import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Phone, ArrowLeft } from 'lucide-react'
import AuthLayout, { AuthBrand } from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import ServiceButton from '../components/auth/ServiceButton'
import OTPInput from '../components/auth/OTPInput'
import SubmitButton from '../components/auth/SubmitButton'
import { useAuth } from '../auth/AuthContext'
import { validateEmail } from '../auth/validation'
import * as auth from '../auth/AuthService'
import { EASE } from '../lib/animations'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('email') // 'email' | 'phone'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // Phone OTP
  const [phone, setPhone] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef(null)

  const startCountdown = () => {
    clearInterval(timerRef.current)
    setCountdown(42)
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    const errs = {}
    if (validateEmail(email)) errs.email = validateEmail(email)
    if (!password) errs.password = 'Please enter your password.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setApiError('')
    try {
      const u = await login({ email, password, remember })
      if (u?.role) navigate(`/${u.role}/dashboard`, { replace: true })
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setApiError('')
    setOtpLoading(true)
    try {
      await auth.sendOtp(phone)
      setOtpStep(true)
      startCountdown()
    } catch (err) {
      setApiError(err.message)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setApiError('')
    setOtpLoading(true)
    try {
      await auth.verifyOtp(otp)
      // Phone login is an integration point — real auth maps phone -> user here.
      setApiError('Phone sign-in is not fully configured yet. Please use your email after verification.')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleGoogle = async () => {
    setApiError('')
    setLoading(true)
    try {
      await auth.loginWithGoogle()
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setApiError('')
    setErrors({})
    setOtpStep(false)
    setOtp('')
    setCountdown(0)
    clearInterval(timerRef.current)
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <AuthBrand
          eyebrow="Welcome back"
          title="Sign in to Thulix"
          sub="Sign in to continue your journey with Thulix."
        />

        <AuthCard>
          <AnimatePresence mode="wait">
            {mode === 'email' ? (
              <motion.form
                key="email"
                noValidate
                onSubmit={handleEmailLogin}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full rounded-xl border bg-abyss-2/70 px-4 py-3 text-sm text-snow placeholder:text-mist/50 outline-none transition-all duration-300 focus:ring-2 ${
                      errors.email
                        ? 'border-error/60 focus:border-error focus:ring-error/20'
                        : 'border-[rgba(148,163,184,0.15)] focus:border-neon/70 focus:ring-neon/20'
                    }`}
                  />
                  {errors.email && <p role="alert" className="text-xs text-error">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`w-full rounded-xl border bg-abyss-2/70 px-4 py-3 pr-12 text-sm text-snow placeholder:text-mist/50 outline-none transition-all duration-300 focus:ring-2 ${
                        errors.password
                          ? 'border-error/60 focus:border-error focus:ring-error/20'
                          : 'border-[rgba(148,163,184,0.15)] focus:border-neon/70 focus:ring-neon/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-mist transition-colors hover:text-snow"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p role="alert" className="text-xs text-error">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-mist">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-[rgba(148,163,184,0.3)] bg-abyss-2 text-neon"
                    />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="font-semibold text-electric hover:text-snow">
                    Forgot password?
                  </Link>
                </div>

                {apiError && (
                  <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
                    {apiError}
                  </p>
                )}

                <SubmitButton loading={loading} disabled={loading}>
                  Sign In <ArrowRight size={16} />
                </SubmitButton>
              </motion.form>
            ) : (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="space-y-4"
              >
                {!otpStep ? (
                  <>
                    <button
                      type="button"
                      onClick={() => switchMode('email')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-mist hover:text-snow"
                    >
                      <ArrowLeft size={14} /> Back to email sign in
                    </button>
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        className="w-full rounded-xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/70 px-4 py-3 text-sm text-snow placeholder:text-mist/50 outline-none transition-all duration-300 focus:border-neon/70 focus:ring-2 focus:ring-neon/20"
                      />
                    </div>
                    {apiError && <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">{apiError}</p>}
                    <SubmitButton loading={otpLoading} disabled={otpLoading} onClick={handleSendOtp} type="submit">
                      Send OTP
                    </SubmitButton>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-mist hover:text-snow"
                    >
                      <ArrowLeft size={14} /> Change number
                    </button>
                    <p className="text-sm text-mist">
                      Enter the 6-digit code sent to <span className="text-snow">{phone}</span>
                    </p>
                    <OTPInput value={otp} onChange={setOtp} disabled={otpLoading} />
                    <div className="text-center text-xs text-mist">
                      {countdown > 0 ? (
                        <span>
                          Resend OTP in <span className="text-snow">00:{String(countdown).padStart(2, '0')}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setApiError('')
                            auth.resendOtp()
                            startCountdown()
                          }}
                          className="font-semibold text-electric hover:text-snow"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    {apiError && <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">{apiError}</p>}
                    <SubmitButton loading={otpLoading} disabled={otpLoading || otp.length < 6} onClick={handleVerifyOtp} type="submit">
                      Verify &amp; Continue
                    </SubmitButton>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[rgba(148,163,184,0.15)]" />
            <span className="text-xs uppercase tracking-[0.2em] text-mist/60">or</span>
            <span className="h-px flex-1 bg-[rgba(148,163,184,0.15)]" />
          </div>

          <div className="space-y-3">
            <ServiceButton icon={GoogleIcon} onClick={handleGoogle} disabled={loading}>
              Continue with Google
            </ServiceButton>
            <ServiceButton icon={Phone} disabled={mode === 'phone' && otpStep} onClick={() => switchMode('phone')}>
              Continue with Phone
            </ServiceButton>
          </div>
        </AuthCard>

        <p className="mt-6 text-center text-sm text-mist">
          Don't have an account?{' '}
          <Link to="/get-started" className="font-semibold text-electric hover:text-snow">
            Create Account
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  )
}
