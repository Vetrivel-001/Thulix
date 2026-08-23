import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { Icon } from '../../lib/icons'
import { ECOSYSTEM_NODES } from '../../lib/data'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

const centers = {
  students: ['18%', '14%'],
  trainers: ['82%', '14%'],
  recruiters: ['82%', '86%'],
  ai: ['18%', '86%'],
}

export default function Ecosystem() {
  const [active, setActive] = useState('ai')

  return (
    <section id="platform" className="relative overflow-hidden bg-abyss py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[30%] top-[20%] h-[500px] w-[500px] bg-electric/10" />
      <div aria-hidden="true" className="orb bottom-[8%] right-[4%] h-[420px] w-[420px] bg-neon/10" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="The Ecosystem"
          title="One Platform,"
          highlight="Every Side of the Bridge"
          description="Students, trainers, recruiters and AI operate in perfect sync. Every action in one circle feeds intelligence into the next."
        />
        <div className="relative mt-16 hidden h-[560px] md:block">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 560" fill="none" preserveAspectRatio="none" aria-hidden="true">
            {ECOSYSTEM_NODES.map((n) => {
              const x2 = (n.x / 100) * 1000
              const y2 = (n.y / 100) * 560
              return (
                <g key={n.id}>
                  <line
                    x1="500" y1="280" x2={x2} y2={y2}
                    stroke="rgba(6,182,212,0.15)" strokeWidth="1.5"
                    strokeDasharray="6 8" className="animate-dash"
                  />
                </g>
              )
            })}
          </svg>
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass-card relative grid h-44 w-44 place-items-center rounded-full shadow-lg shadow-black/30">
              <div className="relative text-center">
                <Icon name="network" size={30} className="mx-auto text-electric" />
                <p className="mt-2 font-heading text-base font-bold leading-tight text-snow">
                  Thul<span className="text-gradient">ix</span>
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-mist">Core Engine</p>
              </div>
            </div>
          </motion.div>
          {ECOSYSTEM_NODES.map((n, i) => {
            const [cx, cy] = centers[n.id]
            return (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.12 }}
                onMouseEnter={() => setActive(n.id)}
                onClick={() => setActive(n.id)}
                onFocus={() => setActive(n.id)}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: cx, top: cy }}
                aria-label={`${n.label} - click for details`}
                aria-expanded={active === n.id}
              >
                <div
                  className={`flex w-40 items-center gap-3 rounded-2xl border border-border glass p-4 text-left transition-all duration-300 hover:shadow-glow-electric ${
                    active === n.id ? 'border-electric/30 shadow-lg' : 'hover:border-white/20'
                  }`}
                  style={active === n.id ? { boxShadow: `0 4px 24px -6px ${n.accent}40, 0 0 0 1px ${n.accent}20 inset` } : undefined}
                >
                  <span
                    className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                    style={{ background: `${n.accent}10`, color: n.accent }}
                  >
                    <Icon name={n.icon} size={22} />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-abyss" style={{ background: n.accent }} />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-snow">{n.label}</p>
                    <p className="text-[11px] text-mist">{n.tagline}</p>
                  </div>
                </div>
              </motion.button>
            )
          })}
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="glass-card absolute bottom-0 left-1/2 z-30 w-[420px] -translate-x-1/2 rounded-2xl p-5 shadow-xl shadow-black/30"
              >
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(6,182,212,0.3), rgba(139,92,246,0.2), transparent)` }} />
                {(() => {
                  const n = ECOSYSTEM_NODES.find((x) => x.id === active)
                  return (
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${n.accent}10`, color: n.accent }}>
                          <Icon name={n.icon} size={18} />
                        </span>
                        <p className="font-heading font-bold text-snow">{n.label} &mdash; <span style={{ color: n.accent }}>{n.tagline}</span></p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {n.features.map((f) => (
                          <span key={f} className="rounded-full border border-border bg-abyss-3/[0.65] px-3 py-1.5 text-xs font-medium text-snow">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid gap-4 md:hidden"
        >
          <div className="glass-card mx-auto grid w-40 place-items-center rounded-full p-6 text-center shadow-sm shadow-black/20">
            <Icon name="network" size={26} className="text-electric" />
            <p className="mt-2 font-heading text-sm font-bold text-snow">Thulix</p>
          </div>
          {ECOSYSTEM_NODES.map((n) => (
            <motion.div key={n.id} variants={fadeUp(0)} className="glass flex items-center gap-4 rounded-2xl border border-border p-4 transition-all duration-300 hover:shadow-glow-electric">
              <span className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: `${n.accent}10`, color: n.accent }}>
                <Icon name={n.icon} size={22} />
              </span>
              <div>
                <p className="font-heading font-bold text-snow">{n.label}</p>
                <p className="text-xs text-mist">{n.tagline}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
