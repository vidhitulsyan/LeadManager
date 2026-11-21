import StatusBadge from './StatusBadge'

// SQLite stores UTC timestamps as "YYYY-MM-DD HH:MM:SS".
const formatDate = (value) => new Date(`${value.replace(' ', 'T')}Z`).toLocaleDateString()

export default function LeadTable({ leads, hasFilters, onEdit }) {
  if (leads.length === 0) {
    return (
      <p className="empty-state">
        {hasFilters ? 'No leads match your search.' : 'No leads yet. Add your first lead!'}
      </p>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Source</th>
            <th>Status</th>
            <th>Created</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="cell-strong">{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone || '—'}</td>
              <td>{lead.company || '—'}</td>
              <td>{lead.source}</td>
              <td>
                <StatusBadge status={lead.status} />
              </td>
              <td>{formatDate(lead.created_at)}</td>
              <td className="cell-actions">
                <button type="button" className="btn btn-small btn-secondary" onClick={() => onEdit(lead)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
