// Shared Framer Motion variants for consistent scroll choreography.
export const EASE = [0.22, 1, 0.36, 1]

export const fadeUp = (delay = 0, distance = 40) => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay },
  },
})

export const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: EASE, delay } },
})

export const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -64 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE, delay } },
})

export const fadeRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 64 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE, delay } },
})

export const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.86 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE, delay } },
})

export const blurIn = (delay = 0) => ({
  hidden: { opacity: 0, filter: 'blur(16px)', y: 24 },
  visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 1, ease: EASE, delay } },
})

export const stagger = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
})

export const viewportOnce = { once: true, amount: 0.25 }

export const letterReveal = {
  hidden: { opacity: 0, y: '0.9em', rotate: 6 },
  visible: (i = 0) => ({
    opacity: 1,
    y: '0em',
    rotate: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.05 * i },
  }),
}
