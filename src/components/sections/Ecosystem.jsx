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
    <section id="platform" className="relative overflow-hidden py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[30%] top-[20%] h-[500px] w-[500px] bg-electric/5" />
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
                    stroke={n.accent} strokeOpacity="0.2" strokeWidth="1.5"
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
            <div className="relative grid h-44 w-44 place-items-center rounded-full gradient-border bg-white">
              <span className="absolute inset-0 rounded-full bg-electric/10 blur-3xl animate-pulse-glow" aria-hidden="true" />
              <div className="relative text-center">
                <Icon name="network" size={30} className="mx-auto text-electric" />
                <p className="mt-2 font-heading text-base font-bold leading-tight text-snow">
                  Thu<span className="text-gradient">lix</span>
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
                  className={`glass-card flex w-40 items-center gap-3 p-4 text-left transition-all duration-500 ${
                    active === n.id ? 'shadow-glow-electric' : ''
                  }`}
                  style={active === n.id ? { borderColor: `${n.accent}60`, boxShadow: `0 0 32px -8px ${n.accent}40` } : {}}
                >
                  <span
                    className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                    style={{ background: `${n.accent}15`, color: n.accent }}
                  >
                    <Icon name={n.icon} size={22} />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white" style={{ background: n.accent }} />
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
                className="glass-card absolute bottom-0 left-1/2 z-30 w-[420px] -translate-x-1/2 p-5"
              >
                {(() => {
                  const n = ECOSYSTEM_NODES.find((x) => x.id === active)
                  return (
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${n.accent}15`, color: n.accent }}>
                          <Icon name={n.icon} size={18} />
                        </span>
                        <p className="font-heading font-bold text-snow">{n.label} &mdash; <span style={{ color: n.accent }}>{n.tagline}</span></p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {n.features.map((f) => (
                          <span key={f} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-snow">
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
          <div className="glass-card mx-auto grid w-40 place-items-center rounded-full p-6 text-center">
            <Icon name="network" size={26} className="text-electric" />
            <p className="mt-2 font-heading text-sm font-bold text-snow">SkillBridge AI</p>
          </div>
          {ECOSYSTEM_NODES.map((n) => (
            <motion.div key={n.id} variants={fadeUp(0)} className="glass-card flex items-center gap-4 p-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: `${n.accent}15`, color: n.accent }}>
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
