import { useAuth } from '@/context/AuthContext'
import NotificationBell from './NotificationBell'

const roleLabels = {
  ADMIN: 'Admin',
  TECHNICIAN: 'Technicien',
  USER: 'Utilisateur',
}

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', background: 'var(--background)' }} className="flex h-14 items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(232, 230, 224, 0.45)' }}>
          <span className="inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#4cd88a', boxShadow: '0 0 6px rgba(76,216,138,0.5)' }} />
          Système opérationnel
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="flex items-center gap-3 pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="text-right">
            <p className="text-sm font-medium" style={{ color: '#e8e6e0' }}>{user?.prenom} {user?.nom}</p>
            <p className="text-[11px] uppercase tracking-wider" style={{ color: 'rgba(232,230,224,0.35)' }}>{roleLabels[user?.role]}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-md px-3 py-1.5 text-xs transition-colors"
            style={{ color: 'rgba(232,230,224,0.45)', border: '1px solid rgba(255,255,255,0.10)' }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.20)' }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(255,255,255,0.10)' }}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  )
}
