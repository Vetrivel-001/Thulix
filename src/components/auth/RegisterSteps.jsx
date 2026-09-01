import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLayout, { AuthBrand } from './AuthLayout'
import StepIndicator from './StepIndicator'
import SubmitButton from './SubmitButton'
import { EASE } from '../../lib/animations'

// Reusable multi-step registration shell.
// build them from: array of { id, title, label, form }
// manages state, validation, back/continue, transitions.
export default function RegisterSteps({
  eyebrow,
  title,
  sub,
  steps,               // [{ id, label, validate(data), form: fn(data,setData) }]
  finalLabel,          // button text on last step
  onSubmit,            // fn(data) -> called on submit
  submitting = false,
}) {
  const [index, setIndex] = useState(0)
  const [errors, setErrors] = useState({})
  const [data, setData] = useState({})
  const [attempted, setAttempted] = useState(false)

  const step = steps[index]
  const isLast = index === steps.length - 1

  const set = (key, value) => {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validateCurrent = () => {
    const errs = step.validate ? step.validate(data) : {}
    setErrors(errs)
    return Object.values(errs).every((v) => !v)
  }

  const next = () => {
    setAttempted(true)
    if (!validateCurrent()) return
    setAttempted(false)
    setIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  const back = () => {
    setErrors({})
    setAttempted(false)
    setIndex((i) => Math.max(i - 1, 0))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setAttempted(true)
    if (!validateCurrent()) return
    setAttempted(false)
    onSubmit(data)
  }

  const visibleErrors = attempted ? Object.values(errors).filter((e) => e) : []

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <AuthBrand eyebrow={eyebrow} title={title} sub={sub} />

        <StepIndicator steps={steps.map((s) => s.label)} current={index + 1} />

        <form onSubmit={handleSubmit} className="mt-6" noValidate>
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="space-y-5"
            >
              {step.form({ data, set, errors })}
            </motion.div>
          </AnimatePresence>

          {visibleErrors.length > 0 && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-xl border border-error/40 bg-error/10 px-4 py-3"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0 text-error" aria-hidden="true" />
              <div className="text-sm text-snow">
                <p className="font-semibold">Almost there — please fix the following:</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5 text-mist">
                  {visibleErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-7 flex items-center gap-3">
            {index > 0 && (
              <button
                type="button"
                onClick={back}
                className="group inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.2)] px-5 py-3.5 text-sm font-semibold text-snow transition-colors hover:border-electric/40"
              >
                <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                Back
              </button>
            )}
            {isLast ? (
              <SubmitButton loading={submitting} disabled={submitting} className="flex-1">
                {finalLabel}
              </SubmitButton>
            ) : (
              <button
                type="button"
                onClick={next}
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-neon/30"
              >
                Continue
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-mist">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-electric hover:text-snow">
            Sign In
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}
