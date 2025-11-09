import { Card, CardContent } from './ui/card'
import { FarmingCharts } from './FarmingCharts'

interface StatsPanelProps {
  className?: string
}

export function StatsPanel({ className = '' }: StatsPanelProps) {
  return (
    <Card className={`${className} flex flex-col h-full`}>
      <CardContent className="p-0 flex-1 overflow-hidden">
        {/* Farming Charts - Food, Water, Eggs */}
        <FarmingCharts />
      </CardContent>
    </Card>
  )
}
