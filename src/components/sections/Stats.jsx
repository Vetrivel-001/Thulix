import { motion } from 'framer-motion'
import Counter from '../ui/Counter'
import { STATS } from '../../lib/data'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

export default function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-abyss-2 py-12 lg:py-16">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.2), rgba(139,92,246,0.15), transparent)' }} />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.15), rgba(6,182,212,0.2), transparent)' }} />
      <div aria-hidden="true" className="orb left-[10%] top-[-20%] h-[360px] w-[360px] bg-electric/10" />
      <div aria-hidden="true" className="orb bottom-[-25%] right-[8%] h-[320px] w-[320px] bg-neon/10" />
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
              className="relative text-center lg:border-l lg:border-border lg:first:border-0"
            >
              <div className="relative mx-auto h-24 w-24">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={s.color} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${(i + 1) * 55} 264`}
                  />
                </svg>
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
