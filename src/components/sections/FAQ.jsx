import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { FAQS } from '../../lib/data'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[-8%] bottom-[0%] h-[380px] w-[380px] bg-electric/5" />
      <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions?"
          highlight="Answered."
          description="Everything you need to know about SkillBridge AI. Can't find your answer? Aura is online 24/7."
        />

        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 space-y-4"
        >
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.div key={f.q} variants={fadeUp(0)} className="glass-card overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className={`font-heading text-base font-bold transition-colors sm:text-lg ${isOpen ? 'text-gradient' : 'text-snow'}`}>
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors ${
                      isOpen ? 'border-electric bg-electric/10 text-electric' : 'border-gray-200 bg-gray-50 text-mist'
                    }`}
                    aria-hidden="true"
                  >
                    <Plus size={17} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-mist sm:text-base">{f.a}</p>
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
