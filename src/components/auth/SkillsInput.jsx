import { useState } from 'react'
import { X } from 'lucide-react'

// Chip/tag input for skills. Free text; commits on Enter, comma or blur.
// Structured as an array so it can be sent to a backend unchanged.
export default function SkillsInput({
  id,
  label,
  value = [],
  onChange,
  error,
  suggestions = [],
  placeholder = 'Type a skill and press Enter',
  note,
}) {
  const [text, setText] = useState('')

  const commit = (raw) => {
    const parts = String(raw || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (!parts.length) return
    const next = [...value]
    for (const p of parts) {
      if (!next.some((s) => s.toLowerCase() === p.toLowerCase())) next.push(p)
    }
    onChange(next)
    setText('')
  }

  const remove = (skill) => onChange(value.filter((s) => s !== skill))

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit(text)
    } else if (e.key === 'Backspace' && !text && value.length) {
      remove(value[value.length - 1])
    }
  }

  const available = suggestions
    .filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()))
    .slice(0, 6)

  const border = error
    ? 'border-error/60 focus-within:border-error focus-within:ring-error/20'
    : 'border-[rgba(148,163,184,0.15)] focus-within:border-neon/70 focus-within:ring-neon/20'

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
        {label}
      </label>
      <div className={`rounded-xl border bg-abyss-2/70 p-2.5 transition-all duration-300 focus-within:ring-2 ${border}`}>
        {value.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {value.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-lg bg-neon/10 px-2 py-1 text-xs font-medium text-snow">
                {s}
                <button
                  type="button"
                  onClick={() => remove(s)}
                  aria-label={`Remove ${s}`}
                  className="text-mist transition-colors hover:text-blush"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          id={id}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => commit(text)}
          placeholder={placeholder}
          className="w-full bg-transparent px-1 py-0.5 text-sm text-snow placeholder:text-mist/50 outline-none"
        />
      </div>
      {error ? (
        <p role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : note ? (
        <p className="text-[11px] text-mist/70">{note}</p>
      ) : null}
      {available.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] text-mist/60">Suggestions:</span>
          {available.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => commit(s)}
              className="rounded-lg border border-[rgba(148,163,184,0.18)] px-2 py-0.5 text-[11px] text-mist transition-colors hover:border-neon/40 hover:text-snow"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
