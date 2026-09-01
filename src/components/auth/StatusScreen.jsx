import { motion } from 'framer-motion'
import { Clock, XCircle, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import MagneticButton from '../ui/MagneticButton'
import { EASE } from '../../lib/animations'

// Reusable status screen: pending approval, rejected, or success.
// variant: 'pending' | 'rejected' | 'success'
export default function StatusScreen({
  variant = 'pending',
  accent,
  title,
  message,
  actions = [],
}) {
  const Icon = variant === 'pending' ? Clock : variant === 'rejected' ? XCircle : CheckCircle2
  const color = accent || (variant === 'pending' ? '#FBBF24' : variant === 'rejected' ? '#FB7185' : '#34D399')

  return (
    <div className="flex flex-col items-center text-center">
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative grid h-16 w-16 place-items-center rounded-2xl"
        style={{ background: `${color}1a`, color }}
      >
        <Icon size={30} aria-hidden="true" />
        <span
          className="absolute inset-0 -z-10 rounded-2xl"
          style={{ boxShadow: `0 0 40px ${color}33` }}
          aria-hidden="true"
        />
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
        className="mt-5 font-heading text-2xl font-bold text-snow sm:text-3xl"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist"
      >
        {message}
      </motion.p>

      {actions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {actions.map((a) =>
            a.to ? (
              <MagneticButton key={a.label} to={a.to} variant={a.variant || 'ghost'}>
                {a.label}
              </MagneticButton>
            ) : (
              <Link
                key={a.label}
                to="/"
                className="inline-flex items-center rounded-full border border-[rgba(148,163,184,0.2)] px-7 py-3.5 text-sm font-semibold text-snow transition-colors hover:border-electric/40"
              >
                {a.label}
              </Link>
            ),
          )}
        </motion.div>
      )}
    </div>
  )
}
