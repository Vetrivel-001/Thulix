import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Activity } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { Icon } from '../../lib/icons'
import { LIVE_ACTIVITY } from '../../lib/data'
import { fadeLeft, fadeRight } from '../../lib/animations'

export default function LiveActivity() {
  const [cursor, setCursor] = useState(0)
  const WINDOW = 4

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => c + 1), 2600)
    return () => clearInterval(t)
  }, [])

  const visible = Array.from({ length: WINDOW }, (_, i) => LIVE_ACTIVITY[(cursor + i) % LIVE_ACTIVITY.length])

  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div aria-hidden="true" className="orb right-[-10%] top-[20%] h-[420px] w-[420px] bg-mint/5" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <motion.div variants={fadeLeft(0)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <SectionHeading
            align="left"
            eyebrow="Live Platform Activity"
            title="The Ecosystem"
            highlight="Never Sleeps"
            description="Certificates earned, courses published, internships posted, roadmaps generated - a pulse of progress happening every second across SkillBridge AI."
          />
          <div className="mt-8 flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-2 text-sm font-semibold text-mint">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ring-pulse rounded-full bg-mint" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
              </span>
              Live now
            </span>
            <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-mist">1,284 actions in the last hour</span>
          </div>
          <div className="mt-8 hidden gap-3 lg:flex" aria-hidden="true">
            {['#2563EB', '#4F46E5', '#06B6D4', '#10B981', '#F59E0B'].map((c, i) => (
              <motion.span
                key={c}
                className="h-3 w-3 rounded-full"
                style={{ background: c, boxShadow: `0 0 14px ${c}40` }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeRight(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="relative">
          <div aria-hidden="true" className="orb -left-12 top-1/3 h-48 w-48 bg-electric/10" />
          <div className="glass-card relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <Radio size={17} className="text-electric" aria-hidden="true" />
                <p className="font-heading font-bold text-snow">Global Activity Feed</p>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-mist">
                <Activity size={13} className="text-mint" aria-hidden="true" /> Streaming
              </span>
            </div>

            <div className="flex h-[360px] flex-col justify-end gap-3 overflow-hidden px-6 py-5">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((item, idx) => (
                  <motion.div
                    key={`${cursor}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: idx === 0 ? 1 : 0.55, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 ${idx === 0 ? 'shadow-sm' : ''}`}
                  >
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                      style={{ background: `${item.color}12`, color: item.color }}
                    >
                      <Icon name={item.icon} size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-snow">
                        <span className="font-semibold">{item.actor}</span>{' '}
                        <span className="text-mist">{item.action}</span>
                      </p>
                      <p className="text-[11px] text-mist">{item.time}</p>
                    </div>
                    {idx === 0 && <span className="ml-auto h-2 w-2 shrink-0 animate-pulse rounded-full bg-mint" aria-hidden="true" />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
