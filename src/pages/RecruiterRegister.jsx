import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/auth/FormField'
import { SelectBlock, TermsCheck } from '../components/auth/FormControls'
import PasswordInput from '../components/auth/PasswordInput'
import RegisterSteps from '../components/auth/RegisterSteps'
import { validateEmail, validatePhone, validatePassword, validateConfirm, validateName, validateRequired, isUrl } from '../auth/validation'
import { useAuth } from '../auth/AuthContext'

const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–1000', '1000+']
const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance / Banking', 'Education', 'Retail / E-commerce',
  'Manufacturing', 'Media / Marketing', 'Consulting', 'Other',
]

export default function RecruiterRegister() {
  const { registerRecruiter } = useAuth()
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
        jobTitle: validateRequired(d.jobTitle, 'job title'),
      }),
      form: ({ data, set, errors }) => (
        <>
          <FormField label="Full Name" id="name" value={data.name || ''} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder="Your full name" autoComplete="name" required />
          <FormField label="Work Email" id="email" type="email" value={data.email || ''} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="you@company.com" autoComplete="email" required />
          <FormField label="Phone Number" id="phone" type="tel" value={data.phone || ''} onChange={(e) => set('phone', e.target.value)} error={errors.phone} placeholder="+91 98765 43210" autoComplete="tel" note="Include country code." required />
          <FormField label="Job Title" id="jobTitle" value={data.jobTitle || ''} onChange={(e) => set('jobTitle', e.target.value)} error={errors.jobTitle} placeholder="e.g. Talent Acquisition Lead" required />
        </>
      ),
    },
    {
      id: 'company',
      label: 'Company',
      validate: (d) => ({
        companyName: validateRequired(d.companyName, 'company name'),
        companyEmail: validateRequired(d.companyEmail, 'company email'),
        companySize: validateRequired(d.companySize, 'company size'),
        industry: validateRequired(d.industry, 'industry'),
        website: d.website ? (isUrl(d.website) ? '' : 'Please enter a valid website URL.') : '',
      }),
      form: ({ data, set, errors }) => (
        <>
          <FormField label="Company Name" id="companyName" value={data.companyName || ''} onChange={(e) => set('companyName', e.target.value)} error={errors.companyName} placeholder="Acme Corp" required />
          <FormField label="Company Email / Domain" id="companyEmail" value={data.companyEmail || ''} onChange={(e) => set('companyEmail', e.target.value)} error={errors.companyEmail} placeholder="company.com" required />
          <SelectBlock label="Company Size (Employees)" id="companySize" options={COMPANY_SIZES} value={data.companySize} onChange={(v) => set('companySize', v)} error={errors.companySize} />
          <SelectBlock label="Industry" id="industry" options={INDUSTRIES} value={data.industry} onChange={(v) => set('industry', v)} error={errors.industry} />
          <FormField label="Company Website" id="website" type="url" value={data.website || ''} onChange={(e) => set('website', e.target.value)} error={errors.website} placeholder="https://company.com" note="Optional" />
        </>
      ),
    },
    {
      id: 'location',
      label: 'Location',
      validate: (d) => ({
        companyLocation: validateRequired(d.companyLocation, 'company location'),
        companyDescription: d.companyDescription ? (d.companyDescription.trim().length >= 40 ? '' : 'Please write at least 40 characters.') : '',
      }),
      form: ({ data, set, errors }) => (
        <>
          <FormField label="Company Location" id="companyLocation" value={data.companyLocation || ''} onChange={(e) => set('companyLocation', e.target.value)} error={errors.companyLocation} placeholder="e.g. Bengaluru, India" required />
          <FormField
            label="About the Company"
            id="companyDescription"
            rows={4}
            value={data.companyDescription || ''}
            onChange={(e) => set('companyDescription', e.target.value)}
            error={errors.companyDescription}
            placeholder="A short intro to your company and what you hire for..."
            note="Optional — helps candidates learn about your team."
          />
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
        </>
      ),
    },
  ]

  const onSubmit = async (data) => {
    setSubmitting(true)
    await registerRecruiter({
      name: data.name?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      jobTitle: data.jobTitle?.trim(),
      companyName: data.companyName?.trim(),
      companyEmail: data.companyEmail?.trim(),
      companySize: data.companySize,
      industry: data.industry,
      website: data.website?.trim(),
      companyLocation: data.companyLocation?.trim(),
      companyDescription: data.companyDescription?.trim(),
      password: data.password,
    })
    setSubmitting(false)
    navigate('/recruiter/pending')
  }

  return (
    <RegisterSteps
      eyebrow="Recruiter Signup"
      title="Create your Recruiter account"
      sub="Connect with verified talent. Your company profile can be completed later."
      steps={steps}
      finalLabel="Create Recruiter Account"
      onSubmit={onSubmit}
      submitting={submitting}
    />
  )
}
