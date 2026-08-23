import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Mail, ArrowUp } from 'lucide-react'
import { SiX, SiYoutube, SiGithub, SiInstagram, SiDiscord } from 'react-icons/si'
import { FOOTER_LINKS } from '../../lib/data'
import { scrollToId } from '../../lib/smooth-scroll'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

const socials = [
  { icon: SiX, label: 'X (Twitter)' },
  { icon: SiYoutube, label: 'YouTube' },
  { icon: SiGithub, label: 'GitHub' },
  { icon: SiInstagram, label: 'Instagram' },
  { icon: SiDiscord, label: 'Discord' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = (e) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <footer className="relative overflow-hidden border-t border-border bg-abyss-2">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#06B6D4,#8B5CF6,#06B6D4,transparent)]"
      />
      <div aria-hidden="true" className="orb left-[-10%] top-[20%] h-72 w-72 bg-electric/5" />
      <div aria-hidden="true" className="orb right-[-8%] bottom-[10%] h-72 w-72 bg-neon/5" />

      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"
      >
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <motion.div variants={fadeUp(0)} className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="block h-11 w-11">
                <img
                  src="/logo.png"
                  alt="Thulix logo"
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="font-heading text-xl font-bold text-snow">
                Thuli<span className="text-gradient-animate">x</span>
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-mist">
              The AI-powered career &amp; learning ecosystem where students learn, trainers teach, and recruiters hire — one intelligent platform for the entire journey.
            </p>
            <form onSubmit={subscribe} className="mt-7" aria-label="Newsletter">
              <label htmlFor="newsletter" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-mist">
                Join the newsletter
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-border glass p-1.5 transition-all duration-300 focus-within:border-electric/30 focus-within:shadow-glow-electric">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@future.com"
                  className="w-full bg-transparent px-3 py-2 text-sm text-snow placeholder:text-mist/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-electric"
                  aria-label="Subscribe"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </div>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs font-medium text-electric"
                  role="status"
                >
                  You're in! Welcome to the future of learning.
                </motion.p>
              )}
            </form>
            <div className="mt-7 flex gap-4">
              {socials.map(({ icon: Icon, label }) => (
                <div key={label} className="social-isometric relative">
                  <span className="iso-layer iso-layer-3" />
                  <span className="iso-layer iso-layer-2" />
                  <span className="iso-layer iso-layer-1" />
                  <a
                    href="#"
                    aria-label={label}
                    onClick={(e) => e.preventDefault()}
                    className="social-icon grid h-12 w-12 place-items-center rounded-full border border-border glass text-mist transition-all duration-300"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                  <span className="social-label">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <motion.div key={group} variants={fadeUp(0.05)}>
                <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-snow">{group}</h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="group relative inline-block text-sm text-mist transition-colors duration-300 hover:text-snow"
                      >
                        {link}
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-0.5 left-0 h-px w-0 bg-[linear-gradient(90deg,#06B6D4,#8B5CF6)] transition-all duration-300 group-hover:w-full"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-mist">&copy; {new Date().getFullYear()} Thulix. Crafted for the future of work.</p>
          <div className="flex items-center gap-6 text-xs text-mist">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} aria-hidden="true" className="text-electric" /> Bengaluru, India &middot; Remote-first
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail size={13} aria-hidden="true" className="text-mint" /> hello@thulix.ai
            </span>
          </div>
          <button
            onClick={() => scrollToId('home')}
            className="grid h-11 w-11 place-items-center rounded-xl border border-border glass text-snow transition-all duration-300 hover:-translate-y-1 hover:border-electric/30 hover:shadow-glow-electric"
            aria-label="Back to top"
          >
            <ArrowUp size={18} aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </footer>
  )
}
