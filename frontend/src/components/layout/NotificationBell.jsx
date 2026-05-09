import { useState } from 'react'
import { useNotifications } from '@/context/NotificationContext'

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (open) markAllRead() }}
        className="relative rounded-md p-2 transition-colors"
        style={{ color: 'rgba(232,230,224,0.45)' }}
        onMouseEnter={(e) => e.target.style.color = '#e8e6e0'}
        onMouseLeave={(e) => e.target.style.color = 'rgba(232,230,224,0.45)'}
        aria-label="Notifications"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold"
            style={{ background: '#E8A020', color: '#0a0a0f' }}
          >
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl shadow-2xl"
          style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <div className="px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
            <p className="text-sm font-medium" style={{ color: '#e8e6e0' }}>Notifications</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-xs" style={{ color: 'rgba(232,230,224,0.25)' }}>Aucune notification</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 text-xs transition-colors"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    color: n.read ? 'rgba(232,230,224,0.45)' : '#e8e6e0',
                    borderLeft: n.read ? 'none' : '2px solid #E8A020',
                    background: n.read ? 'transparent' : 'rgba(232,160,32,0.04)',
                  }}
                >
                  {n.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
