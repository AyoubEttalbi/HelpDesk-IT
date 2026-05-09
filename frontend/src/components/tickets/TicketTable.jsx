import { useNavigate } from 'react-router-dom'
import { StatusBadge, PriorityBadge } from '@/components/common/Badge'

export default function TicketTable({ incidents }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/60">
            {['Ticket', 'Titre', 'Statut', 'Priorité', 'Créé le', 'Créateur', 'Technicien'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc, i) => (
            <tr
              key={inc.idIncident}
              onClick={() => navigate(`/tickets/${inc.idIncident}`)}
              className="group cursor-pointer border-b border-border/30 transition-colors hover:bg-card/60"
            >
              <td className="px-4 py-3">
                <code className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {inc.numeroTicket}
                </code>
              </td>
              <td className="px-4 py-3 text-sm font-medium">{inc.titre}</td>
              <td className="px-4 py-3"><StatusBadge statut={inc.statut} /></td>
              <td className="px-4 py-3"><PriorityBadge priorite={inc.priorite} /></td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {new Date(inc.dateCreation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-4 py-3 text-xs">{inc.createur?.prenom} {inc.createur?.nom}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {inc.technicien ? `${inc.technicien.prenom} ${inc.technicien.nom}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
