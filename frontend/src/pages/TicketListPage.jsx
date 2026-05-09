import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIncidents } from '@/api/incidents'
import { getCategories } from '@/api/categories'
import { useAuth } from '@/context/AuthContext'
import TicketTable from '@/components/tickets/TicketTable'
import FilterBar from '@/components/tickets/FilterBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import EmptyState from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'

export default function TicketListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ statut: '', priorite: '', idCategorie: '', search: '' })

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.statut) params.statut = filters.statut
    if (filters.priorite) params.priorite = filters.priorite
    if (filters.idCategorie) params.idCategorie = Number(filters.idCategorie)
    if (filters.search) params.search = filters.search

    getIncidents(params)
      .then(setIncidents)
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: '#e8e6e0' }}>Incidents</h1>
          <p className="mt-0.5 text-xs" style={{ color: 'rgba(232,230,224,0.45)' }}>
            {incidents.length} incident{incidents.length !== 1 ? 's' : ''}
          </p>
        </div>
        {user?.role !== 'TECHNICIAN' && (
          <Button size="sm" onClick={() => navigate('/tickets/new')}>
            Nouvel incident
          </Button>
        )}
      </div>

      <FilterBar filters={filters} onChange={setFilters} categories={categories} />

      {loading ? (
        <LoadingSpinner />
      ) : incidents.length === 0 ? (
        <EmptyState title="Aucun incident" description="Aucun incident ne correspond à vos critères." />
      ) : (
        <div className="rounded-xl" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <TicketTable incidents={incidents} />
        </div>
      )}
    </div>
  )
}
