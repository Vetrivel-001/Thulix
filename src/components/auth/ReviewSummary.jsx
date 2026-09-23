import { CheckCircle2, Pencil } from 'lucide-react'

// Read-only summary of the current form before the final submit.
// Usage: rows: [{ label, value, edit? }] — `edit` is the step index to jump to
// when the user clicks Edit. `goTo(index)` is provided by RegisterSteps and
// preserves all existing form values.
// Deliberately never shows passwords, confirmations or the terms checkbox.
export default function ReviewSummary({ rows = [], goTo, accent = '#8B5CF6' }) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 p-1.5">
        <dl className="divide-y divide-[rgba(148,163,184,0.08)]">
          {rows.map(({ label, value, edit }) => (
            <div key={label} className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 px-4 py-3">
              <dt className="min-w-0 shrink-0 pt-0.5 text-xs font-medium uppercase tracking-wide text-mist">{label}</dt>
              <dd className="min-w-0 flex-1 break-words text-right text-sm font-medium text-snow">{value || '—'}</dd>
              {typeof edit === 'number' && goTo ? (
                <button
                  type="button"
                  onClick={() => goTo(edit)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[rgba(148,163,184,0.2)] px-2 py-1 text-[11px] font-semibold text-mist transition-colors hover:border-electric/40 hover:text-snow"
                >
                  <Pencil size={11} aria-hidden="true" /> Edit
                </button>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
      <div className="flex items-start gap-2.5 rounded-xl border px-4 py-3" style={{ borderColor: `${accent}33`, background: `${accent}0d` }}>
        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
        <p className="min-w-0 break-words text-xs leading-relaxed text-mist">
          Everything look right? Hit <span className="font-semibold text-snow">Submit</span> to finish, use{' '}
          <span className="font-semibold text-snow">Edit</span> to fix any section, or{' '}
          <span className="font-semibold text-snow">Back</span> to review again. Your password stays private — it is
          never shown here.
        </p>
      </div>
    </div>
  )
}