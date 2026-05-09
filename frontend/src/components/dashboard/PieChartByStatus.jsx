import * as React from "react"
import { PieChart, Pie, Cell, Label } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'

const COLORS = {
  OUVERT: '#FCD34D',    // Amber 300
  EN_COURS: '#F59E0B',  // Amber 500
  EN_ATTENTE: '#D97706', // Amber 600
  RESOLU: '#B45309',    // Amber 700
  CLOS: '#44403C',      // Stone 700
}

const CHART_CONFIG = {
  count: {
    label: "Incidents",
  },
  OUVERT: { label: 'Ouvert', color: '#FCD34D' },
  EN_COURS: { label: 'En cours', color: '#F59E0B' },
  EN_ATTENTE: { label: 'En attente', color: '#D97706' },
  RESOLU: { label: 'Résolu', color: '#B45309' },
  CLOS: { label: 'Fermé', color: '#44403C' },
}


export default function PieChartByStatus({ data }) {
  const chartData = React.useMemo(() => {
    return data?.map((d) => ({
      statut: d.statut,
      count: d.count,
      fill: COLORS[d.statut] || '#78716C',
    })) || []
  }, [data])

  const totalIncidents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData])

  if (!chartData.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-stone-800 bg-stone-950/50">
        <p className="text-xs text-stone-500">Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <ChartContainer config={CHART_CONFIG} className="mx-auto aspect-square h-64">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="statut"
          innerRadius={60}
          outerRadius={80}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy - 4}
                      className="fill-stone-100 text-3xl font-bold"
                    >
                      {totalIncidents.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy + 20}
                      className="fill-stone-500 text-xs uppercase tracking-wider"
                    >
                      Total
                    </tspan>
                  </text>

                )
              }
            }}
          />
        </Pie>
        <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap" />
      </PieChart>
    </ChartContainer>
  )
}

