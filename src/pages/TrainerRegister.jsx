import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/auth/FormField'
import { SelectBlock, TermsCheck } from '../components/auth/FormControls'
import PasswordInput from '../components/auth/PasswordInput'
import RegisterSteps from '../components/auth/RegisterSteps'
import { validateEmail, validatePhone, validatePassword, validateConfirm, validateName, validateRequired } from '../auth/validation'
import { useAuth } from '../auth/AuthContext'

const EXPERTISE = [
  'Web Development', 'Mobile Development', 'Data Science & AI', 'Cloud & DevOps',
  'Cybersecurity', 'UI/UX Design', 'Digital Marketing', 'Business & Finance', 'Other',
]
const EXPERIENCE_OPTIONS = ['Fresher', '1–3 years', '3–6 years', '6–10 years', '10+ years']

export default function TrainerRegister() {
  const { registerTrainer } = useAuth()
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
      }),
      form: ({ data, set, errors }) => (
        <>
          <FormField label="Full Name" id="name" value={data.name || ''} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder="Your full name" autoComplete="name" required />
          <FormField label="Email" id="email" type="email" value={data.email || ''} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="you@example.com" autoComplete="email" required />
          <FormField label="Phone Number" id="phone" type="tel" value={data.phone || ''} onChange={(e) => set('phone', e.target.value)} error={errors.phone} placeholder="+91 98765 43210" autoComplete="tel" note="Include country code." required />
        </>
      ),
    },
    {
      id: 'professional',
      label: 'Professional',
      validate: (d) => ({
        professionalTitle: validateRequired(d.professionalTitle, 'professional title'),
        expertise: validateRequired(d.expertise, 'area of expertise'),
        experience: validateRequired(d.experience, 'years of experience'),
      }),
      form: ({ data, set, errors }) => (
        <>
          <FormField label="Professional Title" id="professionalTitle" value={data.professionalTitle || ''} onChange={(e) => set('professionalTitle', e.target.value)} error={errors.professionalTitle} placeholder="e.g. Senior Software Engineer" required />
          <SelectBlock label="Primary Area of Expertise" id="expertise" options={EXPERTISE} value={data.expertise} onChange={(v) => set('expertise', v)} error={errors.expertise} />
          <SelectBlock label="Years of Experience" id="experience" options={EXPERIENCE_OPTIONS} value={data.experience} onChange={(v) => set('experience', v)} error={errors.experience} />
          <p className="text-[11px] text-mist/70">
            You can detail your certifications and past teaching later — this helps our review team verify your profile.
          </p>
        </>
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
          <div className="rounded-2xl border border-[rgba(139,92,246,0.2)] bg-neon/5 p-4">
            <p className="text-xs leading-relaxed text-mist">
              Your trainer account is <span className="text-snow">reviewed by our team</span> before trainer access is
              enabled. After submitting you can log in, but your workspace stays pending until approval.
            </p>
          </div>
        </>
      ),
    },
  ]

  const onSubmit = async (data) => {
    setSubmitting(true)
    await registerTrainer({
      name: data.name?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      professionalTitle: data.professionalTitle?.trim(),
      expertise: data.expertise,
      experience: data.experience,
      password: data.password,
    })
    setSubmitting(false)
    navigate('/trainer/pending')
  }

  return (
    <RegisterSteps
      eyebrow="Trainer Signup"
      title="Become a Thulix Trainer"
      sub="Tell us about your expertise — it takes under a minute."
      steps={steps}
      finalLabel="Submit for Review"
      onSubmit={onSubmit}
      submitting={submitting}
    />
  )
}
