import { motion } from 'framer-motion'
import { Icon } from '../../lib/icons'
import { LIVE_ACTIVITY as LIVE_EVENTS } from '../../lib/data'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

const roleStyles = {
  student: { bg: 'bg-electric/10', text: 'text-electric' },
  trainer: { bg: 'bg-neon/10', text: 'text-neon' },
  recruiter: { bg: 'bg-accent-blue/10', text: 'text-accent-blue' },
  system: { bg: 'bg-golden/10', text: 'text-golden' },
  ai: { bg: 'bg-mint/10', text: 'text-mint' },
}

export default function LiveActivity() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-abyss-2 py-12">
      <div aria-hidden="true" className="orb right-[10%] top-[-30%] h-[300px] w-[300px] bg-electric/5" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">Live Activity</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-snow">Happening Right Now</h2>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-border bg-abyss-3/[0.8] px-4 py-2 text-xs font-semibold text-mist">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            Real-time
          </span>
        </div>

        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {LIVE_EVENTS.map((ev, i) => {
            const s = roleStyles[ev.role] || roleStyles.system
            return (
              <motion.div
                key={i}
                variants={fadeUp(0)}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-abyss-3/[0.65] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-electric/30 hover:shadow-glow-electric"
              >
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${s.bg} ${s.text}`}>
                  <Icon name={ev.icon} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-snow">{ev.text}</p>
                  <p className="text-xs text-mist">{ev.time}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
