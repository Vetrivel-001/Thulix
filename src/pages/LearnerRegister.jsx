import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import AuthLayout, { AuthBrand } from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'
import PasswordInput from '../components/auth/PasswordInput'
import StatusScreen from '../components/auth/StatusScreen'
import { SelectBlock, TermsCheck } from '../components/auth/FormControls'
import RegisterSteps from '../components/auth/RegisterSteps'
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirm,
  validateRequired,
} from '../auth/validation'
import { useAuth } from '../auth/AuthContext'
import { sendEnrollmentConfirmation } from '../auth/EmailService'
import { ENROLLMENT_STATUS_LABELS } from '../auth/AuthService'
import { EASE } from '../lib/animations'

// Degree / course option lists — module-level so they can later be sourced from
// the backend without touching the form UI.
const DEGREE_OPTIONS = [
  'BCA',
  'B.Sc Computer Science',
  'B.Sc Information Technology',
  'B.Tech / BE',
  'MCA',
  'M.Sc',
  'MBA',
  'Other',
]

const COURSE_OPTIONS = [
  'Full Stack Development',
  'Java Development',
  'React Development',
  'Python Development',
  'Data Science',
  'AI / Machine Learning',
  'UI/UX Design',
  'Other',
]

export default function LearnerRegister() {
  const { enrollLearner } = useAuth()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [enrolled, setEnrolled] = useState(null) // sanitized enrollment record

  useEffect(() => {
    if (!enrolled) return
    const t = setTimeout(() => navigate('/', { replace: true }), 4000)
    return () => clearTimeout(t)
  }, [enrolled, navigate])

  const steps = [
    {
      id: 'personal',
      label: 'Personal',
      validate: (d) => ({
        name: validateName(d.name),
        email: validateEmail(d.email),
        phone: validatePhone(d.phone),
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
      id: 'course',
      label: 'Course Interest',
      validate: (d) => ({
        degree: validateRequired(d.degree, 'department / degree'),
        otherDegree: d.degree === 'Other' ? validateRequired(d.otherDegree, 'your degree') : '',
        course: validateRequired(d.course, 'needed course'),
        otherCourse: d.course === 'Other' ? validateRequired(d.otherCourse, 'your course') : '',
      }),
      form: ({ data, set, errors }) => (
        <>
          <SelectBlock
            label="Department / Degree"
            id="degree"
            options={DEGREE_OPTIONS}
            value={data.degree}
            onChange={(v) => set('degree', v)}
            error={errors.degree}
          />
          {data.degree === 'Other' && (
            <FormField
              label="Please specify your degree"
              id="otherDegree"
              value={data.otherDegree || ''}
              onChange={(e) => set('otherDegree', e.target.value)}
              error={errors.otherDegree}
              placeholder="e.g. B.Com, Diploma in ECE"
              required
            />
          )}
          <SelectBlock
            label="Needed Course"
            id="course"
            options={COURSE_OPTIONS}
            value={data.course}
            onChange={(v) => set('course', v)}
            error={errors.course}
          />
          {data.course === 'Other' && (
            <FormField
              label="Please specify your course"
              id="otherCourse"
              value={data.otherCourse || ''}
              onChange={(e) => set('otherCourse', e.target.value)}
              error={errors.otherCourse}
              placeholder="e.g. Cloud Computing, DevOps"
              required
            />
          )}
        </>
      ),
    },
    {
      id: 'account',
      label: 'Your Account',
      validate: (d) => ({
        password: validatePassword(d.password),
        confirm: validateConfirm(d.password, d.confirm),
        terms: d.terms ? '' : 'Please accept the Terms & Conditions to enroll.',
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
              <GraduationCap size={17} className="mt-0.5 shrink-0 text-neon" />
              <p className="text-xs leading-relaxed text-mist">
                Once submitted, you can <span className="text-snow">sign in right away</span> and track your
                enrollment from your profile. Our team will reach out about your course using the details provided.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ]

  // Success state — enrollment is saved; redirect happens automatically.
  if (enrolled) {
    const statusLabel = ENROLLMENT_STATUS_LABELS[enrolled.enrollmentStatus] || enrolled.enrollmentStatus
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <AuthBrand
            eyebrow="Enrollment received"
            title="We received your enquiry"
            sub="Redirecting you to the Thulix home page..."
          />
          <StatusScreen
            variant="success"
            title="Enrollment Submitted"
            message={`Thank you ${enrolled.name}. A confirmation email has been sent to ${enrolled.email} with your application number ${enrolled.enquiryId}. Our team will reach out about ${enrolled.neededCourse}. Your enrollment status is ${statusLabel}.`}
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
      const result = await enrollLearner({
        name: data.name,
        email: data.email,
        phone: data.phone,
        departmentOrDegree: data.degree === 'Other' ? data.otherDegree : data.degree,
        neededCourse: data.course === 'Other' ? data.otherCourse : data.course,
        otherCourse: data.course === 'Other' ? data.otherCourse : '',
        otherDegree: data.degree === 'Other' ? data.otherDegree : '',
        password: data.password,
      })
      // Confirmation email (DEVELOPMENT/MOCK). If the mock ever fails, the
      // enrollment must NOT be rolled back — the learner still succeeded.
      try {
        await sendEnrollmentConfirmation(result.enrollment)
      } catch (emailErr) {
        // eslint-disable-next-line no-console
        console.warn('[EmailService:DEVELOPMENT-ONLY] confirmation not delivered', emailErr)
      }
      setEnrolled(result.enrollment)
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <RegisterSteps
      eyebrow="Learner Enrollment"
      title="Start Your Learning Journey"
      sub="Tell us what you want to learn — it takes under a minute. Submit your details in three steps."
      steps={steps}
      finalLabel="Submit Enrollment"
      onSubmit={onSubmit}
      submitting={submitting}
      apiError={apiError}
    />
  )
}