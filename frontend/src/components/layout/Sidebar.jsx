import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '◈', roles: ['ADMIN', 'TECHNICIAN'] },
  { to: '/tickets', label: 'Incidents', icon: '◆', roles: ['ADMIN', 'TECHNICIAN', 'USER'] },
  { to: '/users', label: 'Utilisateurs', icon: '◉', roles: ['ADMIN'] },
  { to: '/categories', label: 'Catégories', icon: '▣', roles: ['ADMIN'] },
]

export default function Sidebar({ open, onToggle }) {
  const { user } = useAuth()
  const items = navItems.filter((i) => i.roles.includes(user?.role))

  return (
    <aside
      style={{ background: 'var(--sidebar)', borderRight: '0.5px solid rgba(255,255,255,0.04)' }}
      className={cn('flex flex-col transition-all duration-300', open ? 'w-64' : 'w-14')}
    >
      <div
        className="flex items-center px-4 transition-all duration-300"
        style={{ height: '48px', borderBottom: '1px solid rgba(255,255,255,0.04)', justifyContent: open ? 'space-between' : 'center' }}
      >
        {open ? (
          <>
            <span className="text-sm font-bold tracking-tight" style={{ color: '#E8A020' }}>
              HelpDesk
            </span>
            <div className="flex items-center gap-2">
              <span
                className="rounded px-1 py-px text-[9px] font-semibold tracking-wider uppercase"
                style={{ background: 'rgba(232,160,32,0.12)', color: '#E8A020' }}
              >
                IT
              </span>
              <button
                onClick={onToggle}
                className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                style={{ color: 'rgba(232,230,224,0.25)' }}
              >
                ☰
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={onToggle}
            className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[rgba(255,255,255,0.06)]"
            style={{ color: 'rgba(232,230,224,0.25)' }}
          >
            ☰
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded px-3 py-2 text-sm font-medium transition-all duration-200',
                open ? 'gap-3' : 'justify-center gap-0',
                isActive ? '' : 'hover:bg-[rgba(255,255,255,0.03)]'
              )
            }
            style={({ isActive }) => ({
              background: isActive ? 'rgba(232,160,32,0.08)' : 'transparent',
              color: isActive ? '#E8A020' : 'rgba(232,230,224,0.35)',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ color: isActive ? '#E8A020' : 'rgba(232,230,224,0.18)' }} className="text-base leading-none">
                  {item.icon}
                </span>
                {open && item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {open ? (
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-bold"
              style={{ background: 'rgba(232,160,32,0.12)', color: '#E8A020' }}
            >
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-xs font-medium" style={{ color: 'rgba(232,230,224,0.45)' }}>{user?.prenom} {user?.nom}</p>
            </div>
          </div>
        ) : (
          <div
            className="mx-auto flex h-8 w-8 items-center justify-center rounded text-xs font-bold"
            style={{ background: 'rgba(232,160,32,0.12)', color: '#E8A020' }}
          >
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
        )}
      </div>
    </aside>
  )
}
