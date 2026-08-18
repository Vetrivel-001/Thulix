// Global Lenis instance registry so nav/CTA can smooth-scroll to anchors.
let lenis = null

export function setLenis(instance) {
  lenis = instance
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function getLenis() {
  return lenis
}
