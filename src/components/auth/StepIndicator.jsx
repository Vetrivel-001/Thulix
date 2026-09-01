import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

// Animated multi-step progress indicator.
// steps: array of label strings, current: 1-based index.
export default function StepIndicator({ steps = [], current = 1 }) {
  return (
    <div className="flex items-center justify-between" role="group" aria-label="Registration progress">
      {steps.map((label, i) => {
        const idx = i + 1
        const done = idx < current
        const active = idx === current
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.span
                animate={{
                  background: done ? '#34D399' : active ? 'linear-gradient(135deg,#06B6D4,#8B5CF6)' : 'rgba(148,163,184,0.15)',
                  color: done ? '#0B0F1A' : active ? '#F8FAFC' : '#94A3B8',
                  scale: active ? 1.08 : 1,
                }}
                whileHover={active ? { scale: 1.12 } : undefined}
                transition={{ duration: 0.3 }}
                className="grid h-8 w-8 place-items-center rounded-full border border-border text-xs font-bold"
              >
                {done ? <Check size={14} /> : idx}
              </motion.span>
              <span
                className={`text-[10px] font-medium uppercase tracking-wide ${
                  active ? 'text-snow' : done ? 'text-mist' : 'text-mist/50'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length && (
              <div className="relative mx-1 h-0.5 flex-1 self-start mt-4">
                <div className="absolute inset-0 rounded-full bg-[rgba(148,163,184,0.15)]" />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-electric to-neon"
                  initial={false}
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
