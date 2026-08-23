import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { TESTIMONIALS } from '../../lib/data'
import { stagger, viewportOnce } from '../../lib/animations'

const fanRotations = [-12, 3, 14]

export default function SuccessStories() {
  return (
    <section id="stories" className="relative overflow-hidden bg-abyss py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[30%] top-[10%] h-[400px] w-[400px] bg-neon/10" />
      <div aria-hidden="true" className="orb bottom-[-20%] right-[-5%] h-[350px] w-[350px] bg-electric/5 animate-aurora-a" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Success Stories"
          title="Real People,"
          highlight="Real Outcomes"
          description="From career switches to first hires - hear from the learners, trainers and companies building their future with Thulix."
        />
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12"
        >
          <div className="stories-fan">
            {TESTIMONIALS.map((story, i) => (
              <div
                key={story.name}
                className="stories-glass"
                style={{ '--r': fanRotations[i] }}
                data-name={story.name}
              >
                <div className="stories-glass-accent" style={{ background: `linear-gradient(90deg, ${story.color}, ${story.color}88)` }} />
                <div className="stories-glass-glow" style={{ background: story.color }} />
                <div className="stories-glass-content">
                  <div className="stories-glass-top">
                    <span
                      className="stories-glass-avatar"
                      style={{ background: story.color }}
                    >
                      {story.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <div className="stories-glass-info">
                      <p className="stories-glass-name">{story.name}</p>
                      <p className="stories-glass-role">{story.role}</p>
                    </div>
                  </div>
                  <p className="stories-glass-quote">&ldquo;{story.quote}&rdquo;</p>
                  <div className="stories-glass-bottom">
                    <div className="stories-glass-stars">
                      {[...Array(story.rating ?? 5)].map((_, si) => (
                        <Star key={si} size={11} fill="currentColor" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="stories-glass-journey">
                      <span>{story.journey}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
