import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, X } from 'lucide-react'
import { AI_CHAT, AI_PROMPTS } from '../../lib/data'

const AUTO_OPEN_DELAY = 5000
const AUTO_OPEN_DURATION = 5000

function getReply(prompt) {
  const key = AI_CHAT.replies[prompt]
  if (key) return key
  const norm = prompt.trim().toLowerCase()
  const match = Object.keys(AI_CHAT.replies).find((k) => norm.includes(k.toLowerCase()))
  return (
    AI_CHAT.replies[match] ||
    "Great question! I've noted it and I'm studying it for you. Try one of my suggested prompts for a deeper dive, or ask again in a moment."
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'ai', text: AI_CHAT.intro }])
  const [typing, setTyping] = useState(false)
  const [typed, setTyped] = useState('')
  const [input, setInput] = useState('')
  const endRef = useRef(null)
  const typingTimer = useRef(null)
  const autoDone = useRef(false)
  const openTimer = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    openTimer.current = setTimeout(() => {
      if (autoDone.current) return
      autoDone.current = true
      setOpen(true)
      closeTimer.current = setTimeout(() => setOpen(false), AUTO_OPEN_DURATION)
    }, AUTO_OPEN_DELAY)
    return () => {
      clearTimeout(openTimer.current)
      clearTimeout(closeTimer.current)
    }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, typed, typing])

  const ask = (prompt) => {
    const text = prompt.trim()
    if (!text || typing) return
    setMessages((m) => [...m, { role: 'user', text }])
    setTyping(true)
    setTyped('')
    let i = 0
    const full = getReply(text)
    if (typingTimer.current) clearInterval(typingTimer.current)
    typingTimer.current = setInterval(() => {
      i += 2
      setTyped(full.slice(0, i))
      if (i >= full.length) {
        clearInterval(typingTimer.current)
        setTyping(false)
        setTyped('')
        setMessages((m) => [...m, { role: 'ai', text: full }])
      }
    }, 24)
  }

  const cancelAuto = () => {
    clearTimeout(openTimer.current)
    clearTimeout(closeTimer.current)
  }

  const toggle = () => {
    cancelAuto()
    setOpen((v) => !v)
  }

  const close = () => {
    cancelAuto()
    setOpen(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Aura"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glow-card h-[480px] w-[min(92vw,380px)]"
          >
            <div className="glow-card-border" />
            <div className="glow-card-inner flex h-full flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#06B6D4,#8B5CF6)] shadow-lg shadow-neon/20">
                    <Bot size={20} className="text-white" aria-hidden="true" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75 animate-ring-pulse" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-mint" />
                    </span>
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-snow">Aura</p>
                    <p className="text-[11px] font-medium text-electric">Online - Career AI</p>
                  </div>
                </div>
                <button
                  onClick={close}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-mist transition-all duration-200 hover:bg-white/[0.06] hover:text-snow"
                  aria-label="Close chat"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>

              <hr className="glow-card-line" />

              <div className="flex-1 space-y-4 overflow-y-auto py-1">
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
                          ? 'rounded-br-md bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] font-medium text-white shadow-lg shadow-electric/10'
                          : 'rounded-bl-md border border-white/[0.06] bg-white/[0.04] text-snow'
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}

                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.04] px-4 py-3">
                      {typed ? (
                        <p className="text-sm leading-relaxed text-snow">
                          {typed}
                          <span className="animate-blink text-electric">|</span>
                        </p>
                      ) : (
                        <div className="flex gap-1.5 py-1" aria-label="Aura is typing">
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className="h-2 w-2 animate-bounce rounded-full bg-electric"
                              style={{ animationDelay: `${d * 0.15}s` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
                <div ref={endRef} />
              </div>

              <hr className="glow-card-line" />

              <div className="chat-tags">
                {AI_PROMPTS.slice(0, 4).map((p) => (
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

              <div className="chat-input-wrap ml-1.5 mr-0.5">
                <div className="chat-input-border">
                  <div className="chat-input-inner">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask Aura anything..."
                      className="w-full bg-transparent text-sm text-snow placeholder:text-mist/60 focus:outline-none"
                      aria-label="Chat with Aura"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          ask(input)
                          setInput('')
                        }
                      }}
                    />
                    <button
                      className="chat-submit shrink-0"
                      aria-label="Send message"
                      disabled={typing}
                      onClick={() => {
                        ask(input)
                        setInput('')
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
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, scale: 0, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
        onClick={toggle}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(135deg,#06B6D4,#8B5CF6)] text-white shadow-lg shadow-electric/30 transition-all duration-300 hover:scale-110 hover:shadow-electric/40"
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-electric/20 animate-ring-pulse"
        />
        <span
          aria-hidden="true"
          className="absolute -inset-1 rounded-full bg-gradient-to-r from-electric/10 via-neon/10 to-electric/10 blur-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              className="relative"
            >
              <X size={24} aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              className="relative"
            >
              <Bot size={26} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-abyss bg-mint"
          />
        )}
      </motion.button>
    </div>
  )
}
