import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export function useApi<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!url) return
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`/api${url}`)
      setData(res.data)
    } catch {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}