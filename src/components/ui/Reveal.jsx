import { motion } from 'framer-motion'

// Flexible scroll-reveal wrapper. Pass any variant object via `variants`.
export default function Reveal({
  children,
  variants = { hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } },
  className = '',
  delay = 0,
  amount = 0.25,
  as = 'div',
}) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  )
}
