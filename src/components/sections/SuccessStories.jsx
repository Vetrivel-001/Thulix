import { motion } from 'framer-motion'
import { Star, Quote, ArrowUpRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { TESTIMONIALS } from '../../lib/data'
import { fadeUp, fadeLeft, fadeRight, viewportOnce } from '../../lib/animations'

function Stars({ n }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={15} fill={i < n ? '#F59E0B' : 'rgba(0,0,0,0.1)'} color={i < n ? '#F59E0B' : 'rgba(0,0,0,0.1)'} aria-hidden="true" />
      ))}
    </div>
  )
}

export default function SuccessStories() {
  const [featured, ...rest] = TESTIMONIALS

  return (
    <section id="about" className="relative overflow-hidden py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[30%] top-[0%] h-[440px] w-[440px] bg-golden/5" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Success Stories"
          title="Real People."
          highlight="Real Outcomes."
          description="Every certificate is a story. Every placement is a transformation. Here's what happens when learning finally meets opportunity."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <motion.article
            variants={fadeLeft(0)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="group relative overflow-hidden rounded-3xl gradient-border p-8 lg:col-span-2 lg:p-10"
          >
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-electric/10 blur-3xl transition-opacity duration-700 group-hover:opacity-50" />
            <Quote size={44} className="text-electric/30" aria-hidden="true" />
            <div className="relative mt-6">
              <p className="text-lg leading-relaxed text-snow sm:text-xl">"{featured.quote}"</p>
              <div className="mt-8 flex items-center gap-4">
                <span
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${featured.color}, #4F46E5)` }}
                >
                  {featured.initials}
                </span>
                <div>
                  <p className="font-heading font-bold text-snow">{featured.name}</p>
                  <p className="text-sm text-mist">{featured.role}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <Stars n={featured.rating} />
                <span className="flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-3.5 py-1.5 text-xs font-semibold text-mint">
                  <ArrowUpRight size={13} aria-hidden="true" /> {featured.journey}
                </span>
              </div>
            </div>
          </motion.article>

          <div className="flex flex-col gap-6 lg:col-span-3">
            {rest.map((t, i) => (
              <motion.article
                key={t.name}
                variants={i === 0 ? fadeRight(0) : fadeUp(0)}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="glass-card group relative overflow-hidden p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-electric"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <Quote size={26} className="text-electric/30" aria-hidden="true" />
                    <p className="mt-4 text-base leading-relaxed text-snow">"{t.quote}"</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${t.color}, #06B6D4)` }}
                    >
                      {t.initials}
                    </span>
                    <div>
                      <p className="font-heading font-bold text-snow">{t.name}</p>
                      <p className="text-xs text-mist">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Stars n={t.rating} />
                    <span className="text-[11px] font-semibold text-mint">{t.journey}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
