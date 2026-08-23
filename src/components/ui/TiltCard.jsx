import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({ children, className = '', max = 12, glare = true, depth = true }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 150, damping: 20 })
  const sy = useSpring(py, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const glareX = useTransform(sx, [0, 1], ['10%', '90%'])
  const glareY = useTransform(sy, [0, 1], ['10%', '90%'])
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(6,182,212,0.12), rgba(139,92,246,0.04) 40%, transparent 65%)`
  )
  const shadowX = useTransform(sx, [0, 0.5, 1], [-8, 0, 8])
  const shadowY = useTransform(sy, [0, 0.5, 1], [12, 8, 4])
  const shadowBlur = useTransform(sy, [0, 1], [40, 24])
  const shadowAlpha = useTransform(sy, [0, 0.5, 1], [0.25, 0.15, 0.1])

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      className={`relative ${className}`}
    >
      {depth && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 rounded-[inherit]"
          style={{
            x: shadowX,
            y: shadowY,
            filter: `blur(${shadowBlur}px)`,
            background: 'rgba(6,182,212,0.15)',
            opacity: shadowAlpha,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(-30px)',
          }}
        />
      )}
      <div style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: glareBg,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(1px)',
          }}
        />
      )}
    </motion.div>
  )
}
