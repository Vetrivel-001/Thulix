import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, Volume2, Mic } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { AI_PROMPTS, AI_CHAT } from '../../lib/data'
import { fadeLeft, fadeRight } from '../../lib/animations'

function VoiceWave() {
  return (
    <div className="flex h-6 items-center gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <span
          key={i}
          className="w-[3px] origin-center rounded-full bg-[linear-gradient(180deg,#2563EB,#4F46E5)] animate-wave"
          style={{ height: `${8 + (i % 4) * 4}px`, animationDelay: `${i * 0.09}s`, animationDuration: `${0.9 + (i % 3) * 0.2}s` }}
        />
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([{ role: 'ai', text: AI_CHAT.intro }])
  const [typing, setTyping] = useState(false)
  const [typed, setTyped] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, typed, typing])

  const ask = (prompt) => {
    if (typing) return
    const reply =
      AI_CHAT.replies[prompt] ||
      "Great question! I've noted it and I'm studying it for you. Try one of my suggested prompts for a deeper dive, or ask again in a moment."
    setMessages((m) => [...m, { role: 'user', text: prompt }])
    setTyping(true)
    setTyped('')
    setSpeaking(true)

    let i = 0
    const full = reply
    const timer = setInterval(() => {
      i += 2
      setTyped(full.slice(0, i))
      if (i >= full.length) {
        clearInterval(timer)
        setTyping(false)
        setSpeaking(false)
        setMessages((m) => [...m, { role: 'ai', text: full }])
        setTyped('')
      }
    }, 24)
  }

  return (
    <section id="ai-assistant" className="relative overflow-hidden py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[-10%] top-[20%] h-[460px] w-[460px] bg-electric/5" />
      <div aria-hidden="true" className="orb right-[-8%] bottom-[10%] h-[400px] w-[400px] bg-neon/5" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <motion.div variants={fadeLeft(0)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <SectionHeading
            align="left"
            eyebrow="Aura - AI Assistant"
            title="Your AI Mentor,"
            highlight="Available 24/7"
            description="Aura isn't a chatbot - it's your personal career coach. It drafts resumes, generates learning plans, explains any topic, runs mock interviews and guides your next move."
          />

          <div className="mt-8 flex items-center gap-4">
            <div className="glass-card flex items-center gap-4 px-6 py-4">
              <Volume2 size={20} className="text-electric" aria-hidden="true" />
              <VoiceWave />
              <span className="text-sm font-semibold text-mist">
                {speaking ? 'Aura is responding...' : 'Tap a prompt to talk to Aura'}
              </span>
            </div>
          </div>

          <div className="relative mt-8 hidden lg:block" aria-hidden="true">
            <div className="glass absolute -left-4 top-0 animate-float rounded-2xl border border-gray-200 px-5 py-3 text-xs font-medium text-snow">
              "Explain React like I'm 5"
            </div>
            <div className="glass absolute right-2 top-20 animate-float-slow rounded-2xl border border-gray-200 px-5 py-3 text-xs font-medium text-snow">
              Resume score: 86/100
            </div>
            <div className="glass absolute -left-8 top-44 animate-float-slower rounded-2xl border border-gray-200 px-5 py-3 text-xs font-medium text-snow">
              Next milestone: React Certified
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeRight(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="relative"
        >
          <div aria-hidden="true" className="orb -right-10 -top-10 h-52 w-52 bg-electric/10" />
          <div className="glass-card relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/80 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="relative grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(135deg,#2563EB,#4F46E5)]">
                  <Bot size={22} className="text-white" aria-hidden="true" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75 animate-ring-pulse" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-mint" />
                  </span>
                </span>
                <div>
                  <p className="font-heading font-bold text-snow">Aura</p>
                  <p className="text-[11px] text-mint">Online - Career AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white text-mist" title="Voice input">
                  <Mic size={16} aria-hidden="true" />
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white text-mist" title="Assistant settings">
                  <Sparkles size={16} aria-hidden="true" />
                </span>
              </div>
            </div>

            <div className="h-[340px] space-y-4 overflow-y-auto px-6 py-5">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={`${i}-${m.text.slice(0, 12)}`}
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'rounded-br-md bg-[linear-gradient(120deg,#2563EB,#4F46E5)] font-medium text-white'
                          : 'rounded-bl-md border border-gray-200 bg-gray-50 text-snow'
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-gray-200 bg-gray-50 px-4 py-3">
                    {typed ? (
                      <p className="text-sm leading-relaxed text-snow">{typed}<span className="animate-blink">_</span></p>
                    ) : (
                      <div className="flex gap-1.5 py-1" aria-label="Aura is typing">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-electric" style={{ animationDelay: `${d * 0.15}s` }} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-gray-200 bg-white px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {AI_PROMPTS.slice(0, 5).map((p) => (
                  <button
                    key={p}
                    onClick={() => ask(p)}
                    disabled={typing}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-mist transition-all duration-300 hover:border-electric/40 hover:text-snow disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-1.5 pl-4">
                <input
                  placeholder="Ask Aura anything..."
                  className="w-full bg-transparent text-sm text-snow placeholder:text-mist/60 focus:outline-none"
                  aria-label="Chat with Aura"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      ask(e.target.value.trim())
                      e.target.value = ''
                    }
                  }}
                />
                <button
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(120deg,#2563EB,#4F46E5)] text-white transition-transform hover:scale-105 disabled:opacity-50"
                  aria-label="Send message"
                  disabled={typing}
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement.querySelector('input')
                    if (input && input.value.trim()) {
                      ask(input.value.trim())
                      input.value = ''
                    }
                  }}
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
