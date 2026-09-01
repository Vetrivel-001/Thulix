import { useRef } from 'react'

// 6-digit OTP input. Each box is an input; auto-advances; backspace moves back.
// value: string (digits), onChange: fn(string)
export default function OTPInput({ value = '', onChange, disabled = false, length = 6 }) {
  const refs = useRef([])
  const digits = Array.from({ length }, (_, i) => value[i] || '')

  const handleChange = (i, v) => {
    const clean = v.replace(/\D/g, '')
    const next = digits.slice()
    next[i] = clean.slice(-1)
    const joined = next.join('')
    onChange(joined)
    if (clean && i < length - 1) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length)
    onChange(text)
    refs.current[Math.min(text.length, length - 1)]?.focus()
  }

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="Verification code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          inputMode="numeric"
          maxLength={2}
          aria-label={`Digit ${i + 1}`}
          className="h-12 w-full rounded-xl border border-[rgba(148,163,184,0.18)] bg-abyss-2/70 text-center text-lg font-bold text-snow outline-none transition-all duration-200 focus:border-neon/70 focus:ring-2 focus:ring-neon/20 disabled:opacity-50"
        />
      ))}
    </div>
  )
}
