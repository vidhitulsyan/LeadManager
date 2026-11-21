import { useCallback, useState } from 'react'
import { createLead, updateLead } from './api/leads'
import LeadFilters from './components/LeadFilters'
import LeadForm from './components/LeadForm'
import LeadTable from './components/LeadTable'
import Modal from './components/Modal'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { useLeads } from './hooks/useLeads'

const NEW_LEAD = {}

export default function App() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim())
  const { leads, loading, error, reload } = useLeads({ search: debouncedSearch, status })

  // null = form closed, NEW_LEAD = adding, a lead object = editing that lead
  const [formLead, setFormLead] = useState(null)
  const isEditing = Boolean(formLead?.id)
  const closeForm = useCallback(() => setFormLead(null), [])

  const handleSave = async (values) => {
    if (isEditing) {
      await updateLead(formLead.id, values)
    } else {
      await createLead(values)
    }
    closeForm()
    reload()
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Lead Manager</h1>
        <button type="button" className="btn btn-primary" onClick={() => setFormLead(NEW_LEAD)}>
          + Add lead
        </button>
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
        !error && (
          <LeadTable
            leads={leads}
            hasFilters={Boolean(debouncedSearch || status)}
            onEdit={setFormLead}
          />
        )
      )}

      {formLead && (
        <Modal title={isEditing ? 'Edit lead' : 'Add lead'} onClose={closeForm}>
          <LeadForm lead={formLead} onSubmit={handleSave} onCancel={closeForm} />
        </Modal>
      )}
    </main>
  )
}
