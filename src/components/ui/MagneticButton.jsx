import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 will-change-transform select-none'

const variants = {
  primary:
    'text-white shadow-lg shadow-electric/20 bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] hover:shadow-xl hover:shadow-electric/30 hover:-translate-y-0.5',
  ghost:
    'glass text-snow border border-border hover:border-electric/30 hover:shadow-glow-electric hover:-translate-y-0.5',
  soft: 'text-snow bg-white/[0.04] border border-border hover:bg-abyss-3/[0.8] hover:-translate-y-0.5',
}

export default function MagneticButton({
  children,
  to = null,
  href = null,
  onClick,
  variant = 'primary',
  className = '',
  strength = 0.35,
  type = 'button',
  'aria-label': ariaLabel,
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 })

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const classes = `${base} ${variants[variant]} ${className}`
  const motionProps = { style: { x: sx, y: sy }, onMouseMove: onMove, onMouseLeave: onLeave }

  if (to) {
    return (
      <motion.div ref={ref} {...motionProps} className="inline-block">
        <Link to={to} className={classes} aria-label={ariaLabel}>
          {children}
        </Link>
      </motion.div>
    )
  }
  if (href) {
    return (
      <motion.div ref={ref} {...motionProps} className="inline-block">
        <a href={href} className={classes} aria-label={ariaLabel}>
          {children}
        </a>
      </motion.div>
    )
  }
  return (
    <motion.button ref={ref} {...motionProps} type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {children}
    </motion.button>
  )
}
