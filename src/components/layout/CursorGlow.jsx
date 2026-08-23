import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const mx = useMotionValue(-500)
  const my = useMotionValue(-500)
  const x = useSpring(mx, { stiffness: 50, damping: 20, mass: 0.8 })
  const y = useSpring(my, { stiffness: 50, damping: 20, mass: 0.8 })

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
        className="pointer-events-none fixed z-[5] h-[600px] w-[600px] rounded-full"
        style={{
          left: x,
          top: y,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.07), rgba(139,92,246,0.03) 40%, transparent 70%)',
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[6] hidden h-2.5 w-2.5 rounded-full bg-electric/50 lg:block"
        style={{
          left: x,
          top: y,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: '0 0 20px 6px rgba(6,182,212,0.2), 0 0 40px 12px rgba(139,92,246,0.08)',
        }}
      />
    </>
  )
}
