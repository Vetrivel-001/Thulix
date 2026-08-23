import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, Volume2, Mic, Paperclip, Image, Globe } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { AI_PROMPTS, AI_CHAT } from '../../lib/data'
import { fadeLeft, fadeRight } from '../../lib/animations'

function VoiceWave() {
  return (
    <div className="flex h-5 items-center gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <span
          key={i}
          className="w-[3px] origin-center rounded-full bg-[linear-gradient(180deg,#06B6D4,#8B5CF6)] animate-wave"
          style={{ height: `${6 + (i % 4) * 3}px`, animationDelay: `${i * 0.09}s`, animationDuration: `${0.9 + (i % 3) * 0.2}s` }}
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
    <section id="ai-assistant" className="relative overflow-hidden bg-abyss py-16 lg:py-20">
      <div aria-hidden="true" className="orb left-[-10%] top-[20%] h-[460px] w-[460px] bg-electric/5" />
      <div aria-hidden="true" className="orb right-[-8%] bottom-[10%] h-[420px] w-[420px] bg-neon/4" />

      <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <motion.div variants={fadeLeft(0)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <SectionHeading
            align="left"
            eyebrow="Aura - Thulix AI Assistant"
            title="Your Thulix AI Mentor,"
            highlight="Available 24/7"
            description="Aura isn't a chatbot - it's your personal Thulix career coach. It drafts resumes, generates learning plans, explains any topic, runs mock interviews and guides your next move."
          />

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-4 rounded-2xl border border-border glass px-6 py-4 shadow-lg shadow-black/30 transition-all duration-300 hover:border-electric/30">
              <Volume2 size={20} className="text-electric" aria-hidden="true" />
              <VoiceWave />
              <span className="text-sm font-semibold text-mist">
                {speaking ? 'Aura is responding...' : 'Tap a prompt to talk to Aura'}
              </span>
            </div>
          </div>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-mist">
            Try asking about resume tips, interview prep, or learning paths. Use the floating chatbot anytime for instant help.
          </p>
        </motion.div>

        <motion.div
          variants={fadeRight(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="relative"
        >
          <div className="glow-card">
            <div className="glow-card-border" />
            <div className="glow-card-inner">
              <div className="glow-card-header" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="relative grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#06B6D4,#8B5CF6)] shadow-lg shadow-neon/20">
                    <Bot size={20} className="text-white" aria-hidden="true" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75 animate-ring-pulse" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
                    </span>
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-snow">Aura</p>
                    <p className="text-[10px] font-medium text-electric">Online &middot; Thulix Career AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" className="chat-input-btns" title="Voice input">
                    <Mic size={15} />
                  </button>
                  <button type="button" className="chat-input-btns" title="Settings">
                    <Sparkles size={15} />
                  </button>
                </div>
              </div>

              <hr className="glow-card-line" />

              <div className="h-[260px] space-y-3 overflow-y-auto py-1">
                <AnimatePresence initial={false}>
                  {messages.map((m, i) => (
                    <motion.div
                      key={`${i}-${m.text.slice(0, 12)}`}
                      initial={{ opacity: 0, y: 14, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed transition-all duration-300 ${
                          m.role === 'user'
                            ? 'rounded-br-md bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] font-medium text-white shadow-lg shadow-neon/15'
                            : 'rounded-bl-md border border-white/[0.06] bg-white/[0.04] text-snow'
                        }`}
                      >
                        {m.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {typing && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.04] px-4 py-2.5">
                      {typed ? (
                        <p className="text-[13px] leading-relaxed text-snow">{typed}<span className="animate-blink">_</span></p>
                      ) : (
                        <div className="flex gap-1.5 py-1" aria-label="Aura is typing">
                          {[0, 1, 2].map((d) => (
                            <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-electric" style={{ animationDelay: `${d * 0.15}s` }} />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
                <div ref={endRef} />
              </div>

              <hr className="glow-card-line" />

              <div className="flex flex-wrap gap-1.5">
                {AI_PROMPTS.slice(0, 5).map((p) => (
                  <button
                    key={p}
                    onClick={() => ask(p)}
                    disabled={typing}
                    className="chat-tag disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="chat-input-wrap">
                <div className="chat-input-border">
                  <div className="chat-input-inner">
                    <textarea
                      placeholder="Imagine Something...✦˚"
                      className="chat-input-textarea"
                      rows={1}
                      aria-label="Chat with Aura"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && e.target.value.trim()) {
                          e.preventDefault()
                          ask(e.target.value.trim())
                          e.target.value = ''
                        }
                      }}
                    />
                    <div className="chat-input-actions">
                      <div className="chat-input-btns">
                        <button type="button" title="Attach file"><Paperclip size={16} /></button>
                        <button type="button" title="Generate image"><Image size={16} /></button>
                        <button type="button" title="Web search"><Globe size={16} /></button>
                      </div>
                      <button
                        className="chat-submit"
                        aria-label="Send message"
                        disabled={typing}
                        onClick={(e) => {
                          const textarea = e.currentTarget.closest('.chat-input-inner').querySelector('textarea')
                          if (textarea && textarea.value.trim()) {
                            ask(textarea.value.trim())
                            textarea.value = ''
                          }
                        }}
                      >
                        <span className="chat-submit-inner">
                          <Send size={14} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
