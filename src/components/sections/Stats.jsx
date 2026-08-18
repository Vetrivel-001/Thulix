import { motion } from 'framer-motion'
import Counter from '../ui/Counter'
import { STATS } from '../../lib/data'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

export default function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-gray-200 bg-gray-50 py-16 lg:py-20">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#2563EB,#4F46E5,#06B6D4,transparent)]" />
      <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp(0)}
              className="relative text-center lg:border-l lg:border-gray-200 lg:first:border-0"
            >
              <div className="relative mx-auto h-24 w-24">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={s.color} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${(i + 1) * 55} 264`}
                    style={{ filter: `drop-shadow(0 0 4px ${s.color}40)` }}
                  />
                </svg>
                <span
                  className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                  style={{ background: `${s.color}15` }}
                />
              </div>
              <p className="mt-4 font-heading text-4xl font-bold tracking-tight text-snow lg:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1.5 font-heading text-sm font-semibold uppercase tracking-[0.16em] text-snow">{s.label}</p>
              <p className="mt-1 text-xs text-mist">{s.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
