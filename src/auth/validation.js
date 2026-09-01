// Shared validation logic.
// Kept dependency-free and reusable across every auth form.

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

export function isUrl(value) {
  const v = String(value || '').trim()
  if (!v) return false
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v)
}

export function isPhone(value) {
  // Tolerate common separators (spaces, dashes, parens, dots) — e.g. "+91 98765 43210"
  const digits = String(value || '').replace(/[\s()./-]/g, '')
  if (!digits) return false
  return /^\+?[0-9]{8,15}$/.test(digits)
}

export function required(value) {
  return String(value ?? '').trim().length > 0
}

export function minLength(value, n = 8) {
  return String(value ?? '').length >= n
}

// Password strength: weak / medium / strong
export function passwordStrength(value = '') {
  const s = String(value)
  if (s.length < 8) return 'weak'
  let score = 0
  if (s.length >= 10) score += 1
  if (/[A-Z]/.test(s)) score += 1
  if (/[0-9]/.test(s)) score += 1
  if (/[^A-Za-z0-9]/.test(s)) score += 1
  if (score >= 3) return 'strong'
  if (score >= 2) return 'medium'
  return 'weak'
}

export function validateEmail(value) {
  if (!required(value)) return 'Please enter your email address.'
  if (!isEmail(value)) return 'Please enter a valid email address.'
  return ''
}

export function validatePassword(value) {
  if (!required(value)) return 'Please enter a password.'
  if (!minLength(value, 8)) return 'Password must contain at least 8 characters.'
  return ''
}

export function validateConfirm(password, confirm) {
  if (!required(confirm)) return 'Please confirm your password.'
  if (password !== confirm) return 'Passwords do not match.'
  return ''
}

export function validatePhone(value) {
  if (!required(value)) return 'Please enter your phone number.'
  if (!isPhone(value)) return 'Please enter a valid phone number.'
  return ''
}

export function validateName(value) {
  if (!required(value)) return 'Please enter your full name.'
  return ''
}

export function validateRequired(value, label) {
  if (!required(value)) return `Please enter your ${label}.`
  return ''
}
