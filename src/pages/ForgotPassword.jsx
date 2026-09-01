import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import AuthLayout, { AuthBrand } from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import FormField from '../components/auth/FormField'
import SubmitButton from '../components/auth/SubmitButton'
import * as auth from '../auth/AuthService'
import { validateEmail } from '../auth/validation'
import { EASE } from '../lib/animations'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validateEmail(email)
    if (v) {
      setError(v)
      return
    }
    setError('')
    setLoading(true)
    try {
      await auth.forgotPassword(email)
      navigate('/reset-password', { state: { email: email.trim() } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <AuthBrand
          eyebrow="Recover account"
          title="Forgot your password?"
          sub="Enter the email associated with your Thulix account and we'll send you a reset link."
        />
        <AuthCard>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <SubmitButton loading={loading} disabled={loading}>
              <Send size={16} /> Send Reset Link
            </SubmitButton>
          </form>
          <Link to="/login" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mist transition-colors hover:text-snow">
            <ArrowLeft size={15} /> Back to Sign In
          </Link>
        </AuthCard>
      </motion.div>
    </AuthLayout>
  )
}
