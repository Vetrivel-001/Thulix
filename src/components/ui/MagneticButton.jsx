import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 will-change-transform select-none'

const variants = {
  primary:
    'text-white shadow-glow-electric bg-[linear-gradient(120deg,#2563EB,#4F46E5_55%,#06B6D4)] hover:shadow-[0_0_50px_-6px_rgba(37,99,235,0.5)]',
  ghost:
    'glass text-snow border-gray-200 hover:border-electric/40 hover:shadow-glow-electric',
  soft: 'text-snow bg-gray-100 border border-gray-200 hover:bg-gray-200',
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
