import { useState } from 'react'
import LeadFilters from './components/LeadFilters'
import LeadTable from './components/LeadTable'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { useLeads } from './hooks/useLeads'

export default function App() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim())

  const { leads, loading, error } = useLeads({ search: debouncedSearch, status })

  return (
    <main className="container">
      <header className="page-header">
        <h1>Lead Manager</h1>
      </header>

      <LeadFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      {error && <div className="alert alert-error">{error}</div>}

      {loading && leads.length === 0 ? (
        <p className="empty-state">Loading…</p>
      ) : (
        !error && <LeadTable leads={leads} hasFilters={Boolean(debouncedSearch || status)} />
      )}
    </main>
  )
}
