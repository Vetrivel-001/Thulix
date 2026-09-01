// Premium dark card used as the auth form container.
export default function AuthCard({ children, className = '' }) {
  return (
    <div
      className={`relative rounded-3xl border border-[rgba(148,163,184,0.15)] bg-[rgba(16,24,39,0.86)] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8 ${className}`}
    >
      {children}
    </div>
  )
}
