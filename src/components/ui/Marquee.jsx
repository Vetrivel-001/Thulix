import { motion } from 'framer-motion'
import { fadeIn, viewportOnce } from '../../lib/animations'

export default function Marquee({ children, reverse = false, speed = 36, className = '' }) {
  return (
    <motion.div
      variants={fadeIn(0)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`mask-fade-x relative flex w-full overflow-hidden ${className}`}
      aria-label="Trusted by leading companies"
    >
      <div
        className={`flex min-w-full shrink-0 items-center gap-14 pr-14 ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children}
      </div>
    </motion.div>
  )
}
