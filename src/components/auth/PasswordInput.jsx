import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { passwordStrength } from '../../auth/validation'

const STRENGTHS = [
  { key: 'weak', label: 'Weak', color: '#FB7185', width: '25%' },
  { key: 'medium', label: 'Medium', color: '#FBBF24', width: '60%' },
  { key: 'strong', label: 'Strong', color: '#34D399', width: '100%' },
]

// Password input with visibility toggle + strength meter.
export default function PasswordInput({
  id,
  label = 'Password',
  value,
  onChange,
  onBlur,
  error,
  placeholder = '••••••••',
  confirm = false,
}) {
  const [show, setShow] = useState(false)
  const strength = passwordStrength(value)

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={confirm ? 'new-password' : 'new-password'}
          aria-label={label}
          className={`w-full rounded-xl border bg-abyss-2/70 px-4 py-3 pr-12 text-sm text-snow placeholder:text-mist/50 outline-none transition-all duration-300 focus:ring-2 ${
            error
              ? 'border-error/60 focus:border-error focus:ring-error/20'
              : 'border-[rgba(148,163,184,0.15)] focus:border-neon/70 focus:ring-neon/20'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-mist transition-colors hover:text-snow"
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Strength meter — only shown for the main password field */}
      {!confirm && value && (
        <div className="space-y-1 pt-0.5" aria-hidden="true">
          <div className="flex gap-1">
            {STRENGTHS.map((s) => {
              const active = strength === s.key || (strength === 'medium' && s.key !== 'weak') || (strength === 'strong' && s.key !== 'weak')
              return (
                <span
                  key={s.key}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{ background: active ? s.color : 'rgba(148,163,184,0.15)' }}
                />
              )
            })}
          </div>
          <p
            className="text-[11px] font-medium"
            style={{ color: STRENGTHS.find((s) => s.key === strength).color }}
          >
            Password strength: {STRENGTHS.find((s) => s.key === strength).label}
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-error">
          {error}
        </p>
      )}
    </div>
  )
}
