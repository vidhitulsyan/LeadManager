import { useState } from 'react'
import { LEAD_SOURCES, LEAD_STATUSES } from '../constants'
import { validateLead } from '../utils/validateLead'

const toFormValues = (lead = {}) => ({
  name: lead.name ?? '',
  email: lead.email ?? '',
  phone: lead.phone ?? '',
  company: lead.company ?? '',
  source: lead.source ?? '',
  status: lead.status ?? 'New',
})

// Backend sends { field: ['message', ...] }; the form shows one message per field.
const toFieldErrors = (details = {}) =>
  Object.fromEntries(Object.entries(details).map(([field, messages]) => [field, messages[0]]))

function Field({ label, error, required, children }) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required && <span className="required"> *</span>}
      </span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}

export default function LeadForm({ lead, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(lead))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateLead(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    setFormError('')
    try {
      await onSubmit(values)
    } catch (err) {
      setFormError(err.message)
      setErrors(toFieldErrors(err.details))
      setSubmitting(false)
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      {formError && <div className="alert alert-error">{formError}</div>}

      <div className="form-grid">
        <Field label="Name" error={errors.name} required>
          <input name="name" value={values.name} onChange={handleChange} autoFocus />
        </Field>

        <Field label="Email" error={errors.email} required>
          <input name="email" type="email" value={values.email} onChange={handleChange} />
        </Field>

        <Field label="Phone" error={errors.phone}>
          <input name="phone" type="tel" value={values.phone} onChange={handleChange} />
        </Field>

        <Field label="Company" error={errors.company}>
          <input name="company" value={values.company} onChange={handleChange} />
        </Field>

        <Field label="Source" error={errors.source} required>
          <select name="source" value={values.source} onChange={handleChange}>
            <option value="">Select a source</option>
            {LEAD_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" error={errors.status} required>
          <select name="status" value={values.status} onChange={handleChange}>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save lead'}
        </button>
      </div>
    </form>
  )
}
