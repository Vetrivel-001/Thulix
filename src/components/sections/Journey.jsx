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
    <section id="journey" className="relative overflow-hidden py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[-10%] top-[30%] h-[440px] w-[440px] bg-mint/5" />
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="The Learning Journey"
          title="From First Lesson"
          highlight="to First Job Offer"
          description="Eleven milestones. One continuous, AI-guided path. Watch your journey unfold as you scroll."
        />
        <div ref={ref} className="relative mt-14">
          <div className="absolute left-5 top-0 h-full w-px bg-gray-200 md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />
          <motion.div
            style={{ scaleY: progress }}
            className="absolute left-5 top-0 h-full w-px origin-top bg-[linear-gradient(180deg,#2563EB,#4F46E5,#06B6D4,#10B981)] md:left-1/2 md:-translate-x-1/2"
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
                    className="absolute left-5 top-2 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border-2 bg-white md:left-1/2"
                    style={{ borderColor: step.accent }}
                    aria-hidden="true"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: step.accent }} />
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, x: left ? -64 : 64, y: 12 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`ml-12 md:ml-0 ${left ? 'md:col-start-1 md:pr-4 md:text-right' : 'md:col-start-2 md:pl-4'}`}
                  >
                    <div className="glass-card group relative overflow-hidden p-6 transition-all duration-500 hover:-translate-y-1">
                      <div
                        aria-hidden="true"
                        className="absolute -left-10 -top-10 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
                        style={{ background: step.accent }}
                      />
                      <div className={`flex items-center gap-3 ${left ? 'md:flex-row-reverse' : ''}`}>
                        <span className="font-heading text-4xl font-bold text-transparent" style={{ WebkitTextStroke: `1px ${step.accent}` }}>
                          {step.n}
                        </span>
                        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${step.accent}12`, color: step.accent }}>
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
