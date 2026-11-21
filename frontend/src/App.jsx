import { useEffect, useState } from 'react'
import { listLeads } from './api/leads'

export default function App() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listLeads()
      .then(setLeads)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="container">
      <header className="page-header">
        <h1>Lead Manager</h1>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? <p>Loading…</p> : !error && <p>{leads.length} leads</p>}
    </main>
  )
}
