import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import TiltCard from '../ui/TiltCard'
import { Icon } from '../../lib/icons'
import { PROBLEMS } from '../../lib/data'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

export default function Problem() {
  return (
    <section id="problem" className="relative overflow-hidden py-16 lg:py-20">
      <div aria-hidden="true" className="orb right-[-10%] top-[10%] h-[420px] w-[420px] bg-electric/5" />
      <div aria-hidden="true" className="orb left-[-12%] bottom-[0%] h-[380px] w-[380px] bg-neon/5" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="The Problem"
          title="Education Should Lead"
          highlight="to Opportunity"
          description="Today the loop is broken. Knowledge is everywhere, yet the path from learning to earning remains fragmented across disconnected apps, spreadsheets and outdated portals."
        />
        <motion.div
          variants={stagger(0.16)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8"
        >
          {PROBLEMS.map((p, i) => (
            <motion.div key={p.title} variants={fadeUp(0)} className={i === 1 ? 'md:translate-y-10' : ''}>
              <TiltCard className="group h-full">
                <div className="glass-card group relative h-full overflow-hidden p-8">
                  <div
                    aria-hidden="true"
                    className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-10 blur-3xl transition-all duration-500 group-hover:opacity-20"
                    style={{ background: p.accent }}
                  />
                  <div className="relative">
                    <span
                      className="grid h-14 w-14 place-items-center rounded-2xl border border-gray-200"
                      style={{ background: `${p.accent}12`, color: p.accent }}
                    >
                      <Icon name={p.icon} size={26} />
                    </span>
                    <h3 className="mt-6 font-heading text-xl font-bold leading-snug text-snow">{p.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-mist">{p.body}</p>
                    <div className="mt-8 flex items-end gap-3 border-t border-gray-200 pt-5">
                      <span className="font-heading text-4xl font-bold" style={{ color: p.accent }}>
                        {p.stat}
                      </span>
                      <span className="pb-1.5 text-xs leading-tight text-mist">{p.statLabel}</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          variants={fadeUp(0, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto mt-16 max-w-3xl text-center font-heading text-2xl font-semibold leading-snug sm:text-3xl"
        >
          <span className="text-snow">All three sides of the equation are </span>
          <span className="text-gradient-animate">stuck in the same broken loop</span>
          <span className="text-snow"> &mdash; SkillBridge AI closes it.</span>
        </motion.p>
      </div>
    </section>
  )
}
