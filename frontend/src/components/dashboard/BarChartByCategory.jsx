import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const CHART_CONFIG = {
  count: {
    label: "Incidents",
    color: "#E8A020",
  },
}


export default function BarChartByCategory({ data }) {
  const chartData = data?.map((d) => ({
    categorie: d.categorie?.length > 14 ? d.categorie.slice(0, 14) + '…' : d.categorie || 'Inconnue',
    count: d.count,
  })) || []

  if (!chartData.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-stone-800 bg-stone-950/50">
        <p className="text-xs text-stone-500">Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <ChartContainer config={CHART_CONFIG} className="h-64 w-full">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="categorie" 
          tick={{ fontSize: 11, fill: 'rgba(232,230,224,0.35)' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <YAxis 
          tick={{ fontSize: 11, fill: 'rgba(232,230,224,0.35)' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar 
          dataKey="count" 
          fill="var(--color-count)" 
          radius={[4, 4, 0, 0]} 
          barSize={32}
        />
      </BarChart>
    </ChartContainer>
  )
}

