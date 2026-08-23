// Global Lenis instance registry so nav/CTA can smooth-scroll to anchors.
let lenis = null

export function setLenis(instance) {
  lenis = instance
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, {
      offset: -80,
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export function getLenis() {
  return lenis
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, {
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
