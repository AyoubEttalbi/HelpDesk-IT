import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getIncidentById, updateStatut, assignTechnicien, addCommentaire, deleteIncident } from '@/api/incidents'
import { getUsers } from '@/api/users'
import { useAuth } from '@/context/AuthContext'
import { StatusBadge, PriorityBadge } from '@/components/common/Badge'
import StatusTimeline from '@/components/tickets/StatusTimeline'
import CommentList from '@/components/tickets/CommentList'
import CommentForm from '@/components/tickets/CommentForm'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const nextStatuts = {
  OUVERT: [
    { statut: 'EN_COURS', label: 'Prendre en charge', roles: ['TECHNICIAN', 'ADMIN'] },
    { statut: 'CLOS', label: 'Annuler', roles: ['ADMIN'] },
  ],
  EN_COURS: [
    { statut: 'EN_ATTENTE', label: 'Demander des infos', roles: ['TECHNICIAN', 'ADMIN'] },
    { statut: 'RESOLU', label: 'Proposer solution', roles: ['TECHNICIAN', 'ADMIN'] },
  ],
  EN_ATTENTE: [
    { statut: 'EN_COURS', label: 'Reprendre', roles: ['TECHNICIAN', 'ADMIN'] },
  ],
  RESOLU: [
    { statut: 'CLOS', label: 'Confirmer résolution', roles: ['USER', 'ADMIN'] },
    { statut: 'EN_COURS', label: 'Rouvrir', roles: ['TECHNICIAN', 'ADMIN'] },
  ],
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [incident, setIncident] = useState(null)
  const [techniciens, setTechniciens] = useState([])
  const [selectedTech, setSelectedTech] = useState('')
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  const fetchIncident = () => getIncidentById(id).then(setIncident)

  useEffect(() => {
    fetchIncident().finally(() => setLoading(false))
    if (user?.role === 'ADMIN' || user?.role === 'TECHNICIAN') {
      getUsers().then((users) => setTechniciens(users.filter((u) => u.role === 'TECHNICIAN'))).catch(() => {})
    }
  }, [id])

  const handleStatutChange = async (statut) => {
    await updateStatut(id, statut)
    await fetchIncident()
  }

  const handleAssign = async () => {
    if (!selectedTech) return
    await assignTechnicien(id, Number(selectedTech))
    setSelectedTech('')
    await fetchIncident()
  }

  const handleComment = async (contenu) => {
    await addCommentaire(id, contenu)
    await fetchIncident()
  }

  const handleDelete = async () => {
    await deleteIncident(id)
    navigate('/tickets')
  }

  if (loading) return <LoadingSpinner />
  if (!incident) return <p className="p-6 text-xs" style={{ color: 'rgba(232,230,224,0.45)' }}>Incident non trouvé.</p>

  const allowedTransitions = nextStatuts[incident.statut]?.filter((t) => t.roles.includes(user?.role)) || []

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <code className="text-xs font-mono" style={{ color: 'rgba(232,230,224,0.45)' }}>{incident.numeroTicket}</code>
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-tight" style={{ color: '#e8e6e0' }}>{incident.titre}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge statut={incident.statut} />
          <PriorityBadge priorite={incident.priorite} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(232,230,224,0.35)' }}>Description</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(232,230,224,0.8)' }}>{incident.description}</p>
          </div>

          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(232,230,224,0.35)' }}>
              Commentaires ({incident.commentaires?.length || 0})
            </h2>
            <CommentList commentaires={incident.commentaires} />
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <CommentForm onSubmit={handleComment} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(232,230,224,0.35)' }}>Détails</h2>
            <div className="space-y-2.5 text-xs" style={{ color: '#e8e6e0' }}>
              <div className="flex justify-between">
                <span style={{ color: 'rgba(232,230,224,0.45)' }}>Créateur</span>
                <span className="font-medium">{incident.createur?.prenom} {incident.createur?.nom}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'rgba(232,230,224,0.45)' }}>Technicien</span>
                <span className="font-medium">{incident.technicien ? `${incident.technicien.prenom} ${incident.technicien.nom}` : <span style={{ color: 'rgba(232,230,224,0.25)' }}>—</span>}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'rgba(232,230,224,0.45)' }}>Catégorie</span>
                <span className="font-medium">{incident.categorie?.libelle}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'rgba(232,230,224,0.45)' }}>Créé le</span>
                <span className="font-medium tabular-nums">{new Date(incident.dateCreation).toLocaleDateString('fr-FR')}</span>
              </div>
              {incident.dateResolution && (
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(232,230,224,0.45)' }}>Résolu le</span>
                  <span className="font-medium tabular-nums">{new Date(incident.dateResolution).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          </div>

          {(user?.role === 'ADMIN' || user?.role === 'TECHNICIAN') && (
            <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(232,230,224,0.35)' }}>Assignation</h2>
              <div className="space-y-2">
                <Select value={selectedTech} onValueChange={setSelectedTech}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Choisir un technicien" /></SelectTrigger>
                  <SelectContent>
                    {techniciens.map((t) => (
                      <SelectItem key={t.idUser} value={String(t.idUser)}>
                        {t.prenom} {t.nom}{t.specialite ? ` · ${t.specialite}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="w-full h-8 text-xs" size="sm" onClick={handleAssign} disabled={!selectedTech}>
                  Assigner
                </Button>
              </div>
            </div>
          )}

          {allowedTransitions.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(232,230,224,0.35)' }}>Actions</h2>
              <div className="space-y-1.5">
                {allowedTransitions.map((t) => (
                  <Button key={t.statut} className="w-full h-8 text-xs justify-start" variant="outline" size="sm" onClick={() => handleStatutChange(t.statut)}>
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {user?.role === 'ADMIN' && (
            <Button variant="destructive" className="w-full h-8 text-xs" size="sm" onClick={() => setShowDelete(true)}>
              Supprimer l'incident
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.10)' }}>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(232,230,224,0.35)' }}>Historique</h2>
        <StatusTimeline historique={incident.historique} />
      </div>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Supprimer l'incident"
        description="Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
      />
    </div>
  )
}
