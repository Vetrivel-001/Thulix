import { Loader2 } from 'lucide-react'

// Primary submit button with loading state.
export default function SubmitButton({ children, loading = false, disabled = false, className = '' }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-neon/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {loading && <Loader2 className="animate-spin" size={16} aria-hidden="true" />}
      {children}
    </button>
  )
}
