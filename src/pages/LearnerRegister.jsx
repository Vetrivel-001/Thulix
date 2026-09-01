import FormField from '../components/auth/FormField'
import { SelectBlock, TermsCheck } from '../components/auth/FormControls'
import PasswordInput from '../components/auth/PasswordInput'
import RegisterSteps from '../components/auth/RegisterSteps'
import { validateEmail, validatePassword, validateConfirm, validateName, validateRequired, validatePhone } from '../auth/validation'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const DEGREES = ['B.E.', 'B.Tech', 'B.Sc.', 'BCA', 'MCA', 'M.E.', 'M.Tech', 'M.Sc.', 'MBA', 'Diploma', 'Other']
const DEPTS = [
  'Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical',
  'Civil', 'Data Science', 'Artificial Intelligence', 'Other',
]
const STATUSES = ['Student', 'Graduate', 'Working Professional', 'Job Seeker', 'Career Changer']
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say']

export default function LearnerRegister() {
  const { registerLearner } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const steps = [
    {
      id: 'personal',
      label: 'Personal',
      validate: (d) => ({
        name: validateName(d.name),
        email: validateEmail(d.email),
        phone: validatePhone(d.phone),
        gender: validateRequired(d.gender, 'gender'),
      }),
      form: ({ data, set, errors }) => (
        <>
          <FormField label="Full Name" id="name" value={data.name || ''} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder="Your full name" autoComplete="name" required />
          <FormField label="Email" id="email" type="email" value={data.email || ''} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="you@example.com" autoComplete="email" required />
          <FormField label="Phone Number" id="phone" type="tel" value={data.phone || ''} onChange={(e) => set('phone', e.target.value)} error={errors.phone} placeholder="+91 98765 43210" autoComplete="tel" note="Include country code." required />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">Gender</label>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('gender', g)}
                  aria-pressed={data.gender === g}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    data.gender === g
                      ? 'border-neon/70 bg-neon/15 text-snow'
                      : 'border-[rgba(148,163,184,0.15)] text-mist hover:text-snow'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.gender && <p role="alert" className="text-xs text-error">{errors.gender}</p>}
          </div>
        </>
      ),
    },
    {
      id: 'education',
      label: 'Education',
      validate: (d) => ({
        degree: validateRequired(d.degree, 'degree'),
        department: validateRequired(d.department, 'specialization'),
        educationStatus: validateRequired(d.educationStatus, 'current status'),
      }),
      form: ({ data, set, errors }) => (
        <>
          <SelectBlock label="Degree" id="degree" options={DEGREES} value={data.degree} onChange={(v) => set('degree', v)} error={errors.degree} />
          <SelectBlock label="Department / Specialization" id="department" options={DEPTS} value={data.department} onChange={(v) => set('department', v)} error={errors.department} />
          <SelectBlock label="Current Status" id="educationStatus" options={STATUSES} value={data.educationStatus} onChange={(v) => set('educationStatus', v)} error={errors.educationStatus} />
        </>
      ),
    },
    {
      id: 'location',
      label: 'Location',
      validate: (d) => ({ city: validateRequired(d.city, 'city') }),
      form: ({ data, set, errors }) => (
        <FormField label="City" id="city" value={data.city || ''} onChange={(e) => set('city', e.target.value)} error={errors.city} placeholder="e.g. Chennai, Bengaluru" required />
      ),
    },
    {
      id: 'security',
      label: 'Security',
      validate: (d) => ({
        password: validatePassword(d.password),
        confirm: validateConfirm(d.password, d.confirm),
        terms: d.terms ? '' : 'Please accept the Terms & Conditions.',
      }),
      form: ({ data, set, errors }) => (
        <>
          <PasswordInput id="password" label="Password" value={data.password || ''} onChange={(e) => set('password', e.target.value)} error={errors.password} />
          <PasswordInput id="confirm" label="Confirm Password" confirm value={data.confirm || ''} onChange={(e) => set('confirm', e.target.value)} error={errors.confirm} />
          <TermsCheck errors={errors} checked={!!data.terms} onChange={(v) => set('terms', v)} />
        </>
      ),
    },
  ]

  const onSubmit = async (data) => {
    setSubmitting(true)
    await registerLearner({
      name: data.name?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      gender: data.gender,
      degree: data.degree,
      department: data.department,
      educationStatus: data.educationStatus,
      city: data.city?.trim(),
      password: data.password,
    })
    setSubmitting(false)
    navigate('/learner/dashboard')
  }

  return (
    <RegisterSteps
      eyebrow="Learner Signup"
      title="Create your Learner account"
      sub="Tell us a little about you — it takes under a minute."
      steps={steps}
      finalLabel="Create Learner Account"
      onSubmit={onSubmit}
      submitting={submitting}
    />
  )
}
