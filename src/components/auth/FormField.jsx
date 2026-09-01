import { Check } from 'lucide-react'

// Reusable labeled input with error / success states.
export default function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  success,
  placeholder,
  autoComplete,
  note,
  rows,
  children,
  inputClassName = '',
}) {
  const fieldId = id
  const base =
    'w-full rounded-xl border bg-abyss-2/70 px-4 py-3 text-sm text-snow placeholder:text-mist/50 outline-none transition-all duration-300 focus:ring-2'
  const state =
    error
      ? 'border-error/60 focus:border-error focus:ring-error/20'
      : success
        ? 'border-success/50 focus:border-success focus:ring-success/20'
        : 'border-[rgba(148,163,184,0.15)] focus:border-neon/70 focus:ring-neon/20'

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
        {label}
      </label>
      <div className="relative">
        {rows ? (
          <textarea
            id={fieldId}
            rows={rows}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`${base} ${state} ${inputClassName} resize-none`}
          />
        ) : (
          <input
            id={fieldId}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`${base} ${state} ${inputClassName}`}
          />
        )}
        {success && !error && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-success" aria-hidden="true">
            <Check size={16} />
          </span>
        )}
        {children}
      </div>
      {error && (
        <p role="alert" className="text-xs text-error">
          {error}
        </p>
      )}
      {note && !error && <p className="text-[11px] text-mist/70">{note}</p>}
    </div>
  )
}
