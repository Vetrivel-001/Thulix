import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { Icon } from '../../lib/icons'
import { FEATURES } from '../../lib/data'
import { stagger, viewportOnce } from '../../lib/animations'

function FeatureCard({ f, i }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 150, damping: 20 })
  const sy = useSpring(py, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(sy, [0, 1], [8, -8])
  const rotateY = useTransform(sx, [0, 1], [-8, 8])
  const glareX = useTransform(sx, [0, 1], ['10%', '90%'])
  const glareY = useTransform(py, [0, 1], ['10%', '90%'])
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, ${f.color}18, ${f.color}06 40%, transparent 65%)`
  )
  const iconX = useTransform(sx, [0, 1], [-3, 3])
  const iconY = useTransform(sy, [0, 1], [-3, 3])

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const isFeatured = i < 4

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
      viewport={viewportOnce}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 600, '--card-accent': f.color }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-abyss-3/[0.65] p-6 shadow-md shadow-black/10 backdrop-blur-sm transition-all duration-500 hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 ${
        isFeatured ? 'sm:col-span-2 lg:col-span-1' : ''
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-700 group-hover:opacity-100 animate-rainbow"
        style={{
          background: 'linear-gradient(135deg, #06B6D4, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6, #06B6D4)',
          backgroundSize: '300% 300%',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-[1px] rounded-[inherit] bg-abyss-3/[0.88] transition-opacity duration-700 group-hover:opacity-100"
        style={{ zIndex: 1 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glareBg, zIndex: 2 }}
      />

      <div aria-hidden="true" className="card-shimmer" style={{ zIndex: 3 }} />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${f.color}50, transparent)`, zIndex: 4 }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${f.color}30, transparent)`, zIndex: 4 }}
      />

      <span
        aria-hidden="true"
        className="absolute right-4 top-4 font-heading text-[10px] font-bold tracking-wider text-white/[0.08] transition-colors duration-500 group-hover:text-white/[0.15]"
      >
        {String(i + 1).padStart(2, '0')}
      </span>

      <div className="relative" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(2px)', zIndex: 5 }}>
        <div className="relative inline-block">
          <motion.span
            style={{ x: iconX, y: iconY, background: `${f.color}12`, color: f.color }}
            className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
          >
            <Icon name={f.icon} size={22} />
          </motion.span>
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ boxShadow: `0 0 20px ${f.color}25, inset 0 0 12px ${f.color}08` }}
          />
        </div>
        <h3 className="mt-5 font-heading text-lg font-bold text-snow">{f.title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-mist">{f.text}</p>
      </div>

      <span
        aria-hidden="true"
        className="absolute right-5 bottom-5 h-1.5 w-1.5 rounded-full opacity-0 transition-all duration-500 group-hover:opacity-50 group-hover:scale-150"
        style={{ background: f.color, zIndex: 5 }}
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-20"
        style={{ background: f.color, zIndex: 0 }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)`, zIndex: 6 }}
      />

      {isFeatured && (
        <div
          aria-hidden="true"
          className="absolute -left-10 -top-10 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-15"
          style={{ background: f.color }}
        />
      )}
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-abyss py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[40%] top-[-10%] h-[500px] w-[500px] bg-electric/4" />
      <div aria-hidden="true" className="orb right-[-8%] bottom-[20%] h-[350px] w-[350px] bg-neon/3" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Feature Universe"
          title="Everything You Need,"
          highlight="Nothing You Don't"
          description="Twenty-four capabilities fused into one seamless experience - engineered for learning, teaching and hiring at the speed of AI."
        />

        <motion.div
          variants={stagger(0.04)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
