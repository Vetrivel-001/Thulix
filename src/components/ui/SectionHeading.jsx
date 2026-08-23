import { motion } from 'framer-motion'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

export default function SectionHeading({
  eyebrow,
  title,
  highlight = null,
  description,
  align = 'center',
  className = '',
  light = false,
}) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <motion.div
      variants={stagger(0.14)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`flex flex-col ${alignCls} gap-5 ${className}`}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp(0)}
          className="inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-glow" aria-hidden="true" />
          <span className="text-gradient">{eyebrow}</span>
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp(0.05)}
        className={`font-heading text-4xl font-bold leading-[1.08] tracking-tight text-snow sm:text-5xl lg:text-6xl ${light ? 'text-snow' : ''}`}
      >
        {title}{' '}
        {highlight && (
          <span className="text-gradient-animate block sm:inline">{highlight}</span>
        )}
      </motion.h2>
      {description && (
        <motion.p variants={fadeUp(0.1)} className="max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
