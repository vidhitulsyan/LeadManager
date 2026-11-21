import { LEAD_STATUSES } from '../constants'

export default function LeadFilters({ search, status, onSearchChange, onStatusChange }) {
  return (
    <div className="filters">
      <input
        type="search"
        placeholder="Search by name…"
        aria-label="Search by name"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
