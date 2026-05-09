import { Button } from '@/components/ui/button'

const roleColors = {
  ADMIN: 'bg-red-500/10 text-red-400 border-red-500/20',
  TECHNICIAN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  USER: 'bg-muted text-muted-foreground border-border',
}

const roleLabels = {
  ADMIN: 'Admin',
  TECHNICIAN: 'Technicien',
  USER: 'Utilisateur',
}

export default function UserTable({ users, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/60">
            {['Nom', 'Email', 'Rôle', 'Département', 'Spécialité', 'Disponible', ''].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.idUser} className="border-b border-border/30 text-sm hover:bg-card/40 transition-colors">
              <td className="px-4 py-3 text-xs font-medium">{u.prenom} {u.nom}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleColors[u.role]}`}>
                  {roleLabels[u.role]}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{u.departement || '—'}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{u.specialite || '—'}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex h-2 w-2 rounded-full ${u.disponibilite ? 'bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]' : 'bg-muted-foreground'}`} />
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onEdit(u)}>Modifier</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => onDelete(u)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
