import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const eventSourceRef = useRef(null)
  const token = localStorage.getItem('token')

  const subscribe = useCallback(() => {
    if (!token || eventSourceRef.current) return
    const es = new EventSource(`http://localhost:8080/api/notifications/subscribe?token=${token}`)
    es.onmessage = (event) => {
      const notif = { id: Date.now(), message: event.data, read: false }
      setNotifications((prev) => [notif, ...prev])
      setUnreadCount((prev) => prev + 1)
    }
    es.onerror = () => es.close()
    eventSourceRef.current = es
  }, [token])

  useEffect(() => {
    subscribe()
    return () => eventSourceRef.current?.close()
  }, [subscribe])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
