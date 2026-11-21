import { useCallback, useEffect, useState } from 'react'
import { listLeads } from '../api/leads'

export function useLeads({ search, status }) {
  const [reloadKey, setReloadKey] = useState(0)
  const [result, setResult] = useState({ requestKey: null, leads: [], error: '' })

  const requestKey = JSON.stringify([search, status, reloadKey])

  useEffect(() => {
    // Ignore responses from outdated requests (e.g. fast typing in search).
    let ignore = false

    listLeads({ search, status })
      .then((leads) => {
        if (!ignore) setResult({ requestKey, leads, error: '' })
      })
      .catch((err) => {
        if (!ignore) setResult((prev) => ({ ...prev, requestKey, error: err.message }))
      })

    return () => {
      ignore = true
    }
  }, [search, status, requestKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  return {
    leads: result.leads,
    error: result.error,
    loading: result.requestKey !== requestKey,
    reload,
  }
}
