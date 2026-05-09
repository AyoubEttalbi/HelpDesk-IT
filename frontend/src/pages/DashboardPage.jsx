import { useState, useEffect } from 'react'
import { getDashboardStats } from '@/api/dashboard'
import { Card, CardContent } from '@/components/ui/card'
import { StatisticsCard8 } from '@/components/ui/statistics-card-8'
import { Ticket, Activity, CheckCircle, Clock, Archive } from 'lucide-react'
import PieChartByStatus from '@/components/dashboard/PieChartByStatus'
import BarChartByCategory from '@/components/dashboard/BarChartByCategory'
import AvgResolutionCard from '@/components/dashboard/AvgResolutionCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: '#e8e6e0' }}>Tableau de bord</h1>
        <p className="mt-1 text-xs" style={{ color: 'rgba(232, 230, 224, 0.45)' }}>Vue d'ensemble des incidents</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticsCard8 
          title="Total" 
          value={stats?.totalIncidents || 0} 
          variant="total" 
          icon={Ticket}
          description="Total des incidents signalés"
        />
        <StatisticsCard8 
          title="Ouverts" 
          value={stats?.incidentsParStatut?.find((s) => s.statut === 'OUVERT')?.count || 0} 
          variant="open" 
          icon={Clock}
          description="En attente de prise en charge"
        />
        <StatisticsCard8 
          title="En cours" 
          value={stats?.incidentsParStatut?.find((s) => s.statut === 'EN_COURS')?.count || 0} 
          variant="active" 
          icon={Activity}
          description="Actuellement en traitement"
        />
        <StatisticsCard8 
          title="Résolus" 
          value={stats?.incidentsParStatut?.find((s) => s.statut === 'RESOLU')?.count || 0} 
          variant="resolved" 
          icon={CheckCircle}
          description="Solution proposée aux utilisateurs"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-1 text-sm font-semibold" style={{ color: '#e8e6e0' }}>Incidents par statut</h2>
            <p className="mb-4 text-[11px]" style={{ color: 'rgba(232,230,224,0.35)' }}>Répartition des incidents en cours</p>
            <PieChartByStatus data={stats?.incidentsParStatut} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-1 text-sm font-semibold" style={{ color: '#e8e6e0' }}>Incidents par catégorie</h2>
            <p className="mb-4 text-[11px]" style={{ color: 'rgba(232,230,224,0.35)' }}>Volume par catégorie</p>
            <BarChartByCategory data={stats?.incidentsParCategorie} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AvgResolutionCard avgHours={stats?.tempsMoyenResolution} />
        <StatisticsCard8 
          title="Fermés" 
          value={stats?.incidentsParStatut?.find((s) => s.statut === 'CLOS')?.count || 0} 
          variant="total" 
          icon={Archive}
          description="Incidents archivés et clos"
        />
      </div>
    </div>
  )
}
