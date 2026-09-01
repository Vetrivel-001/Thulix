// Shared form controls used across role registration flows.

export function SelectBlock({ label, id, options, value, onChange, error }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
        {label}
      </label>
      <select
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl border bg-abyss-2/70 px-4 py-3 text-sm text-snow outline-none transition-all duration-300 focus:ring-2 ${
          error
            ? 'border-error/60 focus:border-error focus:ring-error/20'
            : 'border-[rgba(148,163,184,0.15)] focus:border-neon/70 focus:ring-neon/20'
        } `}
        style={value ? undefined : { color: 'rgba(148,163,184,0.6)' }}
      >
        <option value="" disabled className="bg-abyss-2">
          Select {label.toLowerCase()}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-abyss-2 text-snow">
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="text-xs text-error">
          {error}
        </p>
      )}
    </div>
  )
}

export function TermsCheck({ errors, checked, onChange }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-mist">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[rgba(148,163,184,0.3)] bg-abyss-2 text-neon focus:ring-neon/30"
        />
        <span>
          I agree to the <span className="text-electric">Terms &amp; Conditions</span> and{' '}
          <span className="text-electric">Privacy Policy</span>
        </span>
      </label>
      {errors.terms && (
        <p role="alert" className="mt-1 text-xs text-error">
          {errors.terms}
        </p>
      )}
    </div>
  )
}
