import { useState, useEffect, useCallback } from 'react'
import { store } from '../data/store'

export function useStore() {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    return store.subscribe(() => forceUpdate(n => n + 1))
  }, [])

  return store
}

export function useEvent(id) {
  const s = useStore()
  return s.getEvent(id)
}

export function useRegistrations(eventId) {
  const s = useStore()
  return s.getRegistrations(eventId)
}
