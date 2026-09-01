import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

// Role selection card for /get-started.
// accent: role accent color; icon: component; selected: bool; onSelect: fn.
export default function RoleCard({ title, desc, icon: Icon, accent, selected, onSelect, features = [], disabled = false }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -6, scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-pressed={selected}
      className={`relative w-full overflow-hidden rounded-2xl border bg-abyss-2/60 p-6 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 ${
        selected ? 'border-transparent shadow-2xl' : 'border-[rgba(148,163,184,0.15)] hover:border-[rgba(148,163,184,0.3)]'
      }`}
      style={selected ? { boxShadow: `0 0 0 1px ${accent}66, 0 12px 40px ${accent}22` } : undefined}
    >
      {/* accent glow */}
      {selected && (
        <span
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full"
          style={{ background: `radial-gradient(circle, ${accent}33, transparent 70%)` }}
          aria-hidden="true"
        />
      )}
      <div className="flex items-center gap-4">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-300"
          style={{ background: `${accent}1a`, color: accent, transform: selected ? 'scale(1.1)' : undefined }}
        >
          <Icon size={22} aria-hidden="true" />
        </span>
        <div className="flex-1">
          <h3 className="font-heading text-lg font-bold text-snow">{title}</h3>
          <p className="mt-0.5 text-xs text-mist">{desc}</p>
        </div>
        <span
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-300"
          style={{
            background: selected ? accent : 'transparent',
            borderColor: selected ? accent : 'rgba(148,163,184,0.4)',
            color: selected ? '#0B0F1A' : 'transparent',
          }}
          aria-hidden="true"
        >
          {selected && <Check size={13} strokeWidth={3} />}
        </span>
      </div>

      {features.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {features.map((f) => (
            <span
              key={f}
              className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              style={{ background: `${accent}14`, color: accent }}
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  )
}
