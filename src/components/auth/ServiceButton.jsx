// Button used for third-party / secondary auth actions (Google, Phone, etc.)
export default function ServiceButton({ icon: Icon, children, onClick, disabled, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full items-center justify-center gap-3 rounded-xl border border-[rgba(148,163,184,0.18)] bg-abyss-2/60 px-4 py-3 text-sm font-semibold text-snow transition-all duration-300 hover:border-[rgba(148,163,184,0.35)] hover:bg-abyss-3/50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {Icon && <Icon className="shrink-0 text-mist transition-colors group-hover:text-snow" size={18} aria-hidden="true" />}
      {children}
    </button>
  )
}
