import { useRef } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { Icon } from '../../lib/icons'
import { FEATURES } from '../../lib/data'
import { scaleIn, stagger, viewportOnce } from '../../lib/animations'

function FeatureCard({ f, i }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      variants={scaleIn(0)}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 transition-[border-color,box-shadow] duration-500 hover:border-gray-300 hover:shadow-[0_0_36px_-14px_rgba(37,99,235,0.15)] ${
        i === 0 || i === 11 ? 'sm:col-span-2 lg:col-span-1' : ''
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(320px circle at var(--mx) var(--my), rgba(37,99,235,0.06), transparent 60%)' }}
      />
      <div className="relative">
        <span
          className="grid h-12 w-12 place-items-center rounded-2xl border border-gray-200 bg-gray-50 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{ color: f.color }}
        >
          <Icon name={f.icon} size={22} />
        </span>
        <h3 className="mt-5 font-heading text-lg font-bold text-snow">{f.title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-mist">{f.text}</p>
      </div>
      <span
        aria-hidden="true"
        className="absolute right-5 top-5 h-2 w-2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-80"
        style={{ background: f.color, boxShadow: `0 0 10px ${f.color}40` }}
      />
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[40%] top-[-10%] h-[500px] w-[500px] bg-electric/5" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Feature Universe"
          title="Everything You Need,"
          highlight="Nothing You Don't"
          description="Twenty-four capabilities fused into one seamless experience - engineered for learning, teaching and hiring at the speed of AI."
        />

        <motion.div
          variants={stagger(0.05)}
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
