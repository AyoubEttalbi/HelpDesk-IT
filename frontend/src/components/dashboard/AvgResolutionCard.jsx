import { StatisticsCard8 } from '@/components/ui/statistics-card-8'
import { Zap } from 'lucide-react'

export default function AvgResolutionCard({ avgHours }) {
  const days = Math.floor(avgHours / 24)
  const hours = Math.round(avgHours % 24)
  const value = avgHours != null ? `${days}j ${hours}h` : '—'

  return (
    <StatisticsCard8 
      title="Temps moyen de résolution" 
      value={value} 
      variant="resolved" 
      icon={Zap}
      description="Basé sur les incidents résolus"
    />
  )
}

