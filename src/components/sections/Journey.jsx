import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { Icon } from '../../lib/icons'
import { JOURNEY_STEPS } from '../../lib/data'

export default function Journey() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 })

  return (
    <section id="journey" className="relative overflow-hidden bg-abyss py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[-10%] top-[25%] h-[480px] w-[480px] bg-electric/5" />
      <div aria-hidden="true" className="orb right-[-12%] bottom-[15%] h-[420px] w-[420px] bg-neon/5" />
      <div aria-hidden="true" className="orb left-[35%] top-[60%] h-[360px] w-[360px] bg-mint/3" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="The Thulix Learning Journey"
          title="From First Lesson"
          highlight="to First Job Offer"
          description="Eleven milestones. One continuous, AI-guided path on Thulix. Watch your journey unfold as you scroll."
        />
        <div ref={ref} className="relative mt-14">
          <div className="absolute left-5 top-0 h-full w-px bg-abyss-3 md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />
          <motion.div
            style={{ scaleY: progress }}
            className="absolute left-5 top-0 h-full w-px origin-top bg-[linear-gradient(180deg,#06B6D4,#8B5CF6)] md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />
          <div className="space-y-8 md:space-y-12">
            {JOURNEY_STEPS.map((step, i) => {
              const left = i % 2 === 0
              return (
                <div key={step.n} className="relative md:grid md:grid-cols-2 md:gap-16">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="absolute left-5 top-2 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border-2 border-white/80 bg-abyss shadow-lg shadow-black/40 md:left-1/2"
                    style={{ boxShadow: `0 0 18px ${step.accent}40, 0 4px 12px rgba(0,0,0,0.45)` }}
                    aria-hidden="true"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full transition-all duration-300"
                      style={{ background: step.accent, boxShadow: `0 0 8px ${step.accent}` }}
                    />
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, x: left ? -64 : 64, y: 12 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`ml-12 md:ml-0 ${left ? 'md:col-start-1 md:pr-4 md:text-right' : 'md:col-start-2 md:pl-4'}`}
                  >
                    <div className="group relative overflow-hidden rounded-2xl border border-border bg-abyss-3/[0.65] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-xl hover:shadow-black/30">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-25"
                        style={{ background: step.accent }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{ background: `linear-gradient(90deg, transparent, ${step.accent}40, transparent)` }}
                      />
                      <div className={`flex items-center gap-3 ${left ? 'md:flex-row-reverse' : ''}`}>
                        <span className="font-heading text-4xl font-bold text-transparent" style={{ WebkitTextStroke: `1px ${step.accent}` }}>
                          {step.n}
                        </span>
                        <span className="grid h-10 w-10 place-items-center rounded-xl border border-border transition-all duration-300" style={{ background: `${step.accent}14`, color: step.accent }}>
                          <Icon name={step.icon} size={20} />
                        </span>
                      </div>
                      <h3 className="mt-4 font-heading text-lg font-bold text-snow">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-mist">{step.text}</p>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
