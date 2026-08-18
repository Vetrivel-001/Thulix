import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const mx = useMotionValue(-500)
  const my = useMotionValue(-500)
  const x = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 })
  const y = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 })

  useEffect(() => {
    const onMove = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[5] h-[560px] w-[560px] rounded-full"
        style={{
          left: x,
          top: y,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.06), rgba(79,70,229,0.03) 40%, transparent 70%)',
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[6] hidden h-2.5 w-2.5 rounded-full bg-electric lg:block"
        style={{
          left: x,
          top: y,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: '0 0 18px 4px rgba(37,99,235,0.3)',
        }}
      />
    </>
  )
}
