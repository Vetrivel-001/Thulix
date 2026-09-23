import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import AuthLayout, { AuthBrand } from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'
import PasswordInput from '../components/auth/PasswordInput'
import StatusScreen from '../components/auth/StatusScreen'
import { TermsCheck } from '../components/auth/FormControls'
import RegisterSteps from '../components/auth/RegisterSteps'
import ReviewSummary from '../components/auth/ReviewSummary'
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirm,
  validateRequired,
  validateUrl,
  validateCompanyEmail,
} from '../auth/validation'
import { useAuth } from '../auth/AuthContext'
import { sendRecruiterApplicationConfirmation } from '../auth/EmailService'
import { RECRUITER_APPLICATION_STATUS_LABELS, isEmailTaken, isPhoneTaken } from '../auth/AuthService'
import { EASE } from '../lib/animations'

export default function RecruiterRegister() {
  const { enrollRecruiter, user } = useAuth()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [applied, setApplied] = useState(null) // sanitized application record

  useEffect(() => {
    if (!applied) return
    const t = setTimeout(() => navigate('/', { replace: true }), 4000)
    return () => clearTimeout(t)
  }, [applied, navigate])

  const steps = [
    {
      id: 'personal',
      label: 'Personal',
      validate: (d) => ({
        name: validateName(d.name),
        email:
          validateEmail(d.email) ||
          (isEmailTaken(d.email, user?.id)
            ? 'This email is already registered. Please use a different email address.'
            : ''),
        phone:
          validatePhone(d.phone) ||
          (isPhoneTaken(d.phone, user?.id)
            ? 'This mobile number is already registered. Please use a different mobile number.'
            : ''),
        jobTitle: validateRequired(d.jobTitle, 'job title'),
      }),
      form: ({ data, set, errors }) => (
        <>
          <FormField
            label="Full Name"
            id="name"
            value={data.name || ''}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
            placeholder="Your full name"
            autoComplete="name"
            required
          />
          <FormField
            label="Work Email"
            id="email"
            type="email"
            value={data.email || ''}
            onChange={(e) => set('email', e.target.value)}
            error={errors.email}
            placeholder="you@company.com"
            autoComplete="email"
            required
          />
          <FormField
            label="Phone Number"
            id="phone"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => set('phone', e.target.value)}
            error={errors.phone}
            placeholder="+91 98765 43210"
            autoComplete="tel"
            note="Include country code."
            required
          />
          <FormField
            label="Job Title"
            id="jobTitle"
            value={data.jobTitle || ''}
            onChange={(e) => set('jobTitle', e.target.value)}
            error={errors.jobTitle}
            placeholder="e.g. Talent Acquisition Lead"
            autoComplete="organization-title"
            required
          />
        </>
      ),
    },
    {
      id: 'company',
      label: 'Company',
      validate: (d) => ({
        companyName: validateRequired(d.companyName, 'company name'),
        companyEmail: validateCompanyEmail(d.companyEmail),
        website: validateUrl(d.website, 'website URL'),
      }),
      form: ({ data, set, errors }) => (
        <>
          <FormField
            label="Company Name"
            id="companyName"
            value={data.companyName || ''}
            onChange={(e) => set('companyName', e.target.value)}
            error={errors.companyName}
            placeholder="Acme Corp"
            required
          />
          <FormField
            label="Company Email / Domain"
            id="companyEmail"
            value={data.companyEmail || ''}
            onChange={(e) => set('companyEmail', e.target.value)}
            error={errors.companyEmail}
            placeholder="careers@company.com or company.com"
            note="The address or domain your team checks for hiring."
            required
          />
          <FormField
            label="Company Website"
            id="website"
            type="url"
            value={data.website || ''}
            onChange={(e) => set('website', e.target.value)}
            error={errors.website}
            placeholder="https://company.com"
            note="Optional."
          />
        </>
      ),
    },
    {
      id: 'location',
      label: 'Location',
      validate: (d) => ({
        companyLocation: validateRequired(d.companyLocation, 'company location'),
      }),
      form: ({ data, set, errors }) => (
        <>
          <FormField
            label="Company Location"
            id="companyLocation"
            value={data.companyLocation || ''}
            onChange={(e) => set('companyLocation', e.target.value)}
            error={errors.companyLocation}
            placeholder="e.g. Bengaluru, India"
            required
          />
        </>
      ),
    },
    {
      id: 'account',
      label: 'Your Account',
      validate: (d) => ({
        password: validatePassword(d.password),
        confirm: validateConfirm(d.password, d.confirm),
        terms: d.terms ? '' : 'Please accept the Terms & Conditions to apply.',
      }),
      form: ({ data, set, errors }) => (
        <>
          <PasswordInput
            id="password"
            label="Create Password"
            value={data.password || ''}
            onChange={(e) => set('password', e.target.value)}
            error={errors.password}
          />
          <PasswordInput
            id="confirm"
            label="Confirm Password"
            confirm
            value={data.confirm || ''}
            onChange={(e) => set('confirm', e.target.value)}
            error={errors.confirm}
          />
          <TermsCheck errors={errors} checked={!!data.terms} onChange={(v) => set('terms', v)} />
          <div className="rounded-2xl border border-[rgba(16,185,129,0.2)] bg-mint/5 p-4">
            <div className="flex items-start gap-2.5">
              <Briefcase size={17} className="mt-0.5 shrink-0 text-mint" />
              <p className="text-xs leading-relaxed text-mist">
                Once submitted, you can <span className="text-snow">sign in right away</span> and track your
                application from your profile. Our team will review it and reach out using the details provided.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'review',
      label: 'Review',
      validate: () => ({}),
      form: ({ data, goTo }) => (
        <ReviewSummary
          accent="#10B981"
          goTo={goTo}
          rows={[
            { label: 'Full name', value: data.name, edit: 0 },
            { label: 'Work email', value: data.email, edit: 0 },
            { label: 'Phone', value: data.phone, edit: 0 },
            { label: 'Job title', value: data.jobTitle, edit: 0 },
            { label: 'Company name', value: data.companyName, edit: 1 },
            { label: 'Company email / domain', value: data.companyEmail, edit: 1 },
            { label: 'Website', value: data.website, edit: 1 },
            { label: 'Company location', value: data.companyLocation, edit: 2 },
            { label: 'Account & Password', value: '••••••••', edit: 3 },
          ]}
        />
      ),
    },
  ]

  // Success state — application is saved; redirect happens automatically.
  if (applied) {
    const statusLabel = RECRUITER_APPLICATION_STATUS_LABELS[applied.applicationStatus] || applied.applicationStatus
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <AuthBrand
            eyebrow="Application received"
            title="We received your application"
            sub="Redirecting you to the Thulix home page..."
          />
          <StatusScreen
            variant="success"
            title="Recruiter Application Submitted"
            message={`Thank you ${applied.name}. A confirmation email has been sent to ${applied.email} with your application number ${applied.applicationId}. Our team will review your application for ${applied.companyName}. Your application status is ${statusLabel}.`}
            actions={[{ label: 'Back to Home', to: '/', variant: 'primary' }]}
          />
        </motion.div>
      </AuthLayout>
    )
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    setApiError('')
    try {
      const result = await enrollRecruiter({
        name: data.name,
        email: data.email,
        phone: data.phone,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        website: data.website,
        companyLocation: data.companyLocation,
        password: data.password,
      })
      // Confirmation email (DEVELOPMENT/MOCK). If the mock ever fails, the
      // application must NOT be rolled back — the recruiter still succeeded.
      try {
        await sendRecruiterApplicationConfirmation(result.application)
      } catch (emailErr) {
        // eslint-disable-next-line no-console
        console.warn('[EmailService:DEVELOPMENT-ONLY] confirmation not delivered', emailErr)
      }
      setApplied(result.application)
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <RegisterSteps
      eyebrow="Recruiter Application"
      title="Become a Thulix Recruiter"
      sub="Tell us about your company and hiring needs — it takes under a minute."
      steps={steps}
      finalLabel="Submit Recruiter Application"
      onSubmit={onSubmit}
      submitting={submitting}
      apiError={apiError}
    />
  )
}