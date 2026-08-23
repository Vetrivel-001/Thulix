import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { HIGHLIGHTS } from '../../lib/data'
import { Icon } from '../../lib/icons'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

function MetricCard({ h }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 160, damping: 20 })
  const sy = useSpring(py, { stiffness: 160, damping: 20 })
  const rotateX = useTransform(sy, [0, 1], [6, -6])
  const rotateY = useTransform(sx, [0, 1], [-6, 6])
  const glareX = useTransform(sx, [0, 1], ['10%', '90%'])
  const glareY = useTransform(py, [0, 1], ['10%', '90%'])
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, ${h.accent}15, transparent 60%)`
  )

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => { px.set(0.5); py.set(0.5) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      variants={fadeUp(0)}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 600 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-abyss-3/[0.65] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-electric/30 hover:shadow-glow-electric"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glareBg }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${h.accent}40, transparent)` }}
      />
      <div style={{ transformStyle: 'preserve-3d', transform: 'translateZ(2px)' }}>
        <span className="grid h-10 w-10 place-items-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow-electric" style={{ background: `${h.accent}15`, color: h.accent }}>
          <Icon name={h.icon} size={20} />
        </span>
        <p className="mt-4 font-heading text-3xl font-bold text-snow">{h.value}</p>
        <p className="mt-1.5 text-sm text-mist">{h.title}</p>
      </div>
    </motion.div>
  )
}

export default function Highlights() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-abyss-2 py-16 lg:py-20">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.2), rgba(139,92,246,0.15), transparent)' }} />
      <div aria-hidden="true" className="orb left-[-10%] bottom-[-30%] h-[350px] w-[350px] bg-neon/5" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">In Numbers</p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-snow sm:text-4xl">
              Built different.<br />
              <span className="text-gradient">Measurably better.</span>
            </h2>
            <motion.a
              href="#cta"
              onClick={(e) => { e.preventDefault(); document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-electric/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-electric"
            >
              Start now <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </motion.a>
          </div>
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-4 sm:grid-cols-2"
          >
            {HIGHLIGHTS.map((h) => (
              <MetricCard key={h.title} h={h} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
