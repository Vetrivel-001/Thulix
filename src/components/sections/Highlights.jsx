import { useRef } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { Icon } from '../../lib/icons'
import { HIGHLIGHTS } from '../../lib/data'
import { scaleIn, stagger, viewportOnce } from '../../lib/animations'

export default function Highlights() {
  const ref = useRef(null)

  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div aria-hidden="true" className="orb right-[-8%] top-[10%] h-[420px] w-[420px] bg-neon/5" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Platform Highlights"
          title="Engineered Like a"
          highlight="Mission-Critical System"
          description="The beauty you see is powered by serious infrastructure - security, scale and speed under every pixel."
        />

        <motion.div
          ref={ref}
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.title}
              variants={scaleIn(0)}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7"
            >
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
                style={{ background: h.color }}
              />
              <div className="relative flex items-start justify-between">
                <span
                  className="grid h-13 w-13 place-items-center rounded-2xl border border-gray-200 p-3.5 transition-transform duration-500 group-hover:scale-110"
                  style={{ background: `${h.color}10`, color: h.color }}
                >
                  <Icon name={h.icon} size={24} />
                </span>
                <span
                  className="h-2 w-2 rounded-full opacity-30 transition-opacity duration-500 group-hover:opacity-80"
                  style={{ background: h.color, boxShadow: `0 0 8px ${h.color}60` }}
                />
              </div>
              <h3 className="relative mt-5 font-heading text-lg font-bold text-snow">{h.title}</h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-mist">{h.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
