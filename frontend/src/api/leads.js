const BASE_URL = '/api/leads'

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message)
    this.details = details
  }
}

async function request(path = '', options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Is the API running?')
  }

  if (response.status === 204) return null

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(body?.error || `Request failed (${response.status})`, body?.details)
  }
  return body
}

export function listLeads({ search = '', status = '' } = {}) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (status) params.set('status', status)
  const query = params.toString()
  return request(query ? `?${query}` : '')
}

export function createLead(lead) {
  return request('', { method: 'POST', body: JSON.stringify(lead) })
}

export function updateLead(id, lead) {
  return request(`/${id}`, { method: 'PUT', body: JSON.stringify(lead) })
}

export function deleteLead(id) {
  return request(`/${id}`, { method: 'DELETE' })
}
