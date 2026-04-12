import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null) // { name, email, role: 'organizer'|'participant' }
  const [toasts, setToasts] = useState([])
  const [sessionWarning, setSessionWarning] = useState(false)

  const login = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('qr_user', JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('qr_user')
  }, [])

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <AppContext.Provider value={{
      user, login, logout,
      toasts, addToast, removeToast,
      sessionWarning, setSessionWarning
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
