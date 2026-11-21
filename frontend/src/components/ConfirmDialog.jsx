import { useState } from 'react'

export default function ConfirmDialog({ message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleConfirm = async () => {
    setBusy(true)
    setError('')
    try {
      await onConfirm()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>}
      <p>{message}</p>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={handleConfirm} disabled={busy}>
          {busy ? 'Working…' : confirmLabel}
        </button>
      </div>
    </>
  )
}
