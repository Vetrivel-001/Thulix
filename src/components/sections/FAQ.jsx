import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { FAQS } from '../../lib/data'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="relative overflow-hidden bg-abyss py-16 lg:py-20">
      <div aria-hidden="true" className="orb right-[-10%] top-[20%] h-[400px] w-[400px] bg-electric/5" />
      <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked"
          highlight="Questions"
          description="Everything you need to know about getting started with Thulix."
        />
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 space-y-3"
        >
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                variants={fadeUp(0)}
                className={`relative overflow-hidden rounded-2xl border border-border bg-abyss-3/[0.65] transition-all duration-300 ${isOpen ? 'border-electric/30 shadow-glow-electric' : 'hover:-translate-y-0.5 hover:border-electric/20 hover:shadow-glow-electric'}`}
              >
                {isOpen && <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)' }} />}
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-sm font-semibold text-snow sm:text-base">{faq.q}</span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-abyss-3/[0.8] transition-colors duration-300 ${isOpen ? 'text-electric' : 'text-mist'}`}>
                    {isOpen ? <X size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-mist">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
