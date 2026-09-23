import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Presentation } from 'lucide-react'
import AuthLayout, { AuthBrand } from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'
import PasswordInput from '../components/auth/PasswordInput'
import StatusScreen from '../components/auth/StatusScreen'
import SkillsInput from '../components/auth/SkillsInput'
import { SelectBlock, TermsCheck } from '../components/auth/FormControls'
import RegisterSteps from '../components/auth/RegisterSteps'
import ReviewSummary from '../components/auth/ReviewSummary'
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirm,
  validateRequired,
  validateAmount,
} from '../auth/validation'
import { useAuth } from '../auth/AuthContext'
import { sendTrainerApplicationConfirmation } from '../auth/EmailService'
import { TRAINER_APPLICATION_STATUS_LABELS, isEmailTaken, isPhoneTaken } from '../auth/AuthService'
import { COURSE_OPTIONS, TRAINER_EXPERIENCE_OPTIONS, SKILL_SUGGESTIONS } from '../lib/catalog'
import { EASE } from '../lib/animations'

export default function TrainerRegister() {
  const { enrollTrainer, user } = useAuth()
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
            label="Email"
            id="email"
            type="email"
            value={data.email || ''}
            onChange={(e) => set('email', e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
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
        </>
      ),
    },
    {
      id: 'professional',
      label: 'Professional',
      validate: (d) => ({
        course: validateRequired(d.course, 'course you offer'),
        otherCourse: d.course === 'Other' ? validateRequired(d.otherCourse, 'course name') : '',
        knownSkills: d.knownSkills && d.knownSkills.length ? '' : 'Please add at least one skill you teach.',
        experience: validateRequired(d.experience, 'years of experience'),
        salary: validateAmount(d.salary, 'salary expectation'),
      }),
      form: ({ data, set, errors }) => (
        <>
          <SelectBlock
            label="What Course Do You Offer?"
            id="course"
            options={COURSE_OPTIONS}
            value={data.course}
            onChange={(v) => set('course', v)}
            error={errors.course}
          />
          {data.course === 'Other' && (
            <FormField
              label="Please specify the course"
              id="otherCourse"
              value={data.otherCourse || ''}
              onChange={(e) => set('otherCourse', e.target.value)}
              error={errors.otherCourse}
              placeholder="e.g. Cloud Computing, DevOps"
              required
            />
          )}
          <SkillsInput
            id="knownSkills"
            label="Known Skills"
            value={data.knownSkills || []}
            onChange={(v) => set('knownSkills', v)}
            error={errors.knownSkills}
            suggestions={SKILL_SUGGESTIONS}
            placeholder="e.g. React, Java, SQL — press Enter to add"
            note="Add the skills you can teach. Separate with Enter or commas."
          />
          <SelectBlock
            label="Years of Experience"
            id="experience"
            options={TRAINER_EXPERIENCE_OPTIONS}
            value={data.experience}
            onChange={(v) => set('experience', v)}
            error={errors.experience}
          />
          <FormField
            label="Salary Expectation (per month)"
            id="salary"
            inputMode="numeric"
            value={data.salary || ''}
            onChange={(e) => set('salary', e.target.value.replace(/[^0-9]/g, ''))}
            error={errors.salary}
            placeholder="e.g. 50000"
            note="Numbers only — this helps us match you with the right opportunities."
            inputClassName="[appearance:textfield]"
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
          <div className="rounded-2xl border border-[rgba(139,92,246,0.2)] bg-neon/5 p-4">
            <div className="flex items-start gap-2.5">
              <Presentation size={17} className="mt-0.5 shrink-0 text-neon" />
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
      form: ({ data, goTo }) => {
        const skills = Array.isArray(data.knownSkills) ? data.knownSkills : []
        return (
          <ReviewSummary
            accent="#06B6D4"
            goTo={goTo}
            rows={[
              { label: 'Full name', value: data.name, edit: 0 },
              { label: 'Email', value: data.email, edit: 0 },
              { label: 'Phone', value: data.phone, edit: 0 },
              { label: 'Course offered', value: data.course === 'Other' ? data.otherCourse : data.course, edit: 1 },
              {
                label: 'Known skills',
                value: skills.length ? (
                  <span className="flex flex-wrap justify-end gap-1.5">
                    {skills.map((s) => (
                      <span key={s} className="rounded-md bg-electric/15 px-2 py-0.5 text-xs font-medium text-electric">
                        {s}
                      </span>
                    ))}
                  </span>
                ) : null,
                edit: 1,
              },
              { label: 'Experience', value: data.experience, edit: 1 },
              {
                label: 'Salary expectation',
                value: data.salary ? `₹${Number(data.salary).toLocaleString('en-IN')} / month` : null,
                edit: 1,
              },
              { label: 'Account & Password', value: '••••••••', edit: 2 },
            ]}
          />
        )
      },
    },
  ]

  // Success state — application is saved; redirect happens automatically.
  if (applied) {
    const statusLabel = TRAINER_APPLICATION_STATUS_LABELS[applied.applicationStatus] || applied.applicationStatus
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
            title="Trainer Application Submitted"
            message={`Thank you ${applied.name}. A confirmation email has been sent to ${applied.email} with your application number ${applied.applicationId}. Our team will review your application for ${applied.courseOffered}. Your application status is ${statusLabel}.`}
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
      const result = await enrollTrainer({
        name: data.name,
        email: data.email,
        phone: data.phone,
        courseOffered: data.course === 'Other' ? data.otherCourse : data.course,
        otherCourse: data.course === 'Other' ? data.otherCourse : '',
        knownSkills: data.knownSkills || [],
        experience: data.experience,
        salaryExpectation: data.salary,
        password: data.password,
      })
      // Confirmation email (DEVELOPMENT/MOCK). If the mock ever fails, the
      // application must NOT be rolled back — the trainer still succeeded.
      try {
        await sendTrainerApplicationConfirmation(result.application)
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
      eyebrow="Trainer Application"
      title="Become a Thulix Trainer"
      sub="Tell us what you teach and your experience — it takes under a minute."
      steps={steps}
      finalLabel="Submit Trainer Application"
      onSubmit={onSubmit}
      submitting={submitting}
      apiError={apiError}
    />
  )
}
