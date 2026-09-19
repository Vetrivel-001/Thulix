// ============================================================================
// DEVELOPMENT / MOCK EMAIL SERVICE  (isolated)
//
// This simulates the future backend email service (Spring Boot + Provider).
// It does NOT send real email — it logs the payload and records a mock entry,
// which is enough to prove the flow end-to-end in development.
//
// WHEN A REAL BACKEND EXISTS: replace these functions with API calls returning
// the same shapes. No email provider keys or SMTP credentials ever belong in
// frontend code.
// ============================================================================

const MAIL_STORAGE_KEY = 'thulix_dev_emails'
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms))

// Resolves a stored enquiry value for display, avoiding the literal placeholder
// and de-duplicating when a custom "Other" value is also echoed.
const joinDetail = (...parts) => [...new Set(parts.filter((v) => v && v !== 'Other'))].join(' · ')

// Reusable, backend-ready template. Returns { subject, body }.
export function enrollmentConfirmationTemplate(enrollment = {}) {
  const degree = joinDetail(enrollment.departmentOrDegree, enrollment.otherDegree)
  const course = joinDetail(enrollment.neededCourse, enrollment.otherCourse)
  const reference = enrollment.enquiryId || '—'
  return {
    subject: 'Thulix – Enrollment Enquiry Received',
    body: [
      `Hi ${enrollment.name},`,
      '',
      'Thank you for your interest in Thulix.',
      '',
      'We have successfully received your enrollment enquiry.',
      '',
      'Enrollment Details:',
      `Application Reference: ${reference}`,
      `Name: ${enrollment.name}`,
      `Department / Degree: ${degree || '—'}`,
      `Interested Course: ${course || '—'}`,
      `Enrollment Status: New`,
      '',
      'Our team will review your enquiry and contact you using the details provided.',
      'You can track your enrollment status anytime from your Thulix profile.',
      '',
      'Thank you for choosing Thulix.',
      '',
      'Thulix Team',
    ].join('\n'),
  }
}

// Reusable, backend-ready template for a learner-initiated enquiry edit.
export function enrollmentUpdateTemplate(enrollment = {}) {
  const degree = joinDetail(enrollment.departmentOrDegree, enrollment.otherDegree)
  const course = joinDetail(enrollment.neededCourse, enrollment.otherCourse)
  const reference = enrollment.enquiryId || '—'
  return {
    subject: 'Thulix – Enrollment Enquiry Updated',
    body: [
      `Hi ${enrollment.name},`,
      '',
      'Your enrollment enquiry has been updated.',
      '',
      'Enrollment Details:',
      `Application Reference: ${reference}`,
      `Name: ${enrollment.name}`,
      `Department / Degree: ${degree || '—'}`,
      `Interested Course: ${course || '—'}`,
      'Our team will review your revised enquiry and contact you using the details provided.',
      'You can track your enrollment status anytime from your Thulix profile.',
      '',
      'Thank you for choosing Thulix.',
      '',
      'Thulix Team',
    ].join('\n'),
  }
}

// DEVELOPMENT ONLY — sends nothing. Logs + records the mock email.
export async function sendEnrollmentConfirmation(enrollment = {}) {
  await delay(500)
  const email = enrollmentConfirmationTemplate(enrollment)
  const entry = {
    to: enrollment.email,
    subject: email.subject,
    body: email.body,
    sentAt: new Date().toISOString(),
    devOnly: true,
  }
  try {
    const raw = JSON.parse(localStorage.getItem(MAIL_STORAGE_KEY) || '[]')
    raw.push(entry)
    localStorage.setItem(MAIL_STORAGE_KEY, JSON.stringify(raw))
  } catch {
    // Storage failure must never block the enrollment flow.
  }
  // eslint-disable-next-line no-console
  console.info('[EmailService:DEVELOPMENT-ONLY] Enrollment confirmation', entry)
  return { ok: true, devOnly: true, messageId: `mock_${Date.now().toString(36)}` }
}

// DEVELOPMENT ONLY — sends nothing. Logs + records the mock edit notification.
export async function sendEnrollmentUpdate(enrollment = {}) {
  await delay(500)
  const email = enrollmentUpdateTemplate(enrollment)
  const entry = {
    to: enrollment.email,
    subject: email.subject,
    body: email.body,
    sentAt: new Date().toISOString(),
    devOnly: true,
  }
  try {
    const raw = JSON.parse(localStorage.getItem(MAIL_STORAGE_KEY) || '[]')
    raw.push(entry)
    localStorage.setItem(MAIL_STORAGE_KEY, JSON.stringify(raw))
  } catch {
    // Storage failure must never block the enrollment flow.
  }
  // eslint-disable-next-line no-console
  console.info('[EmailService:DEVELOPMENT-ONLY] Enrollment update', entry)
  return { ok: true, devOnly: true, messageId: `mock_${Date.now().toString(36)}` }
}