import { LEAD_SOURCES, LEAD_STATUSES } from '../constants'

// Mirrors backend/src/validators/lead.schema.js
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+\d][\d\s()-]{6,19}$/

export function validateLead(values) {
  const errors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const phone = values.phone.trim()
  const company = values.company.trim()

  if (!name) errors.name = 'Name is required'
  else if (name.length > 100) errors.name = 'Name must be at most 100 characters'

  if (!email) errors.email = 'Email is required'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address'

  if (phone && !PHONE_PATTERN.test(phone)) errors.phone = 'Enter a valid phone number'

  if (company.length > 100) errors.company = 'Company must be at most 100 characters'

  if (!LEAD_SOURCES.includes(values.source)) errors.source = 'Select a source'

  if (!LEAD_STATUSES.includes(values.status)) errors.status = 'Select a status'

  return errors
}
