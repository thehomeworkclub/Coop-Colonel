import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ChartDataPoint {
  time: string
  eatingTime: number    // minutes spent eating
  drinkingTime: number  // minutes spent drinking
  nestingTime: number   // minutes spent laying eggs
}

interface FarmingChartsProps {
  className?: string
}

// Generate mock data for the last 24 hours
const generateMockData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000) // Go back i hours
    const hour = time.getHours()

    data.push({
      time: `${hour}:00`,
      // Eating time: chickens eat more in early morning (6am-9am) and evening (5pm-7pm)
      eatingTime: hour >= 6 && hour <= 9 ? 15 + Math.floor(Math.random() * 20) :
                  hour >= 17 && hour <= 19 ? 12 + Math.floor(Math.random() * 18) :
                  hour >= 10 && hour <= 16 ? 5 + Math.floor(Math.random() * 10) :
                  Math.floor(Math.random() * 5),

      // Drinking time: frequent throughout day, peaks midday and after eating
      drinkingTime: hour >= 10 && hour <= 15 ? 8 + Math.floor(Math.random() * 12) :
                    hour >= 7 && hour <= 9 ? 5 + Math.floor(Math.random() * 10) :
                    hour >= 17 && hour <= 19 ? 6 + Math.floor(Math.random() * 10) :
                    Math.floor(Math.random() * 5),

      // Nesting time: most laying happens 6am-11am (20-50 minutes per session)
      nestingTime: hour >= 6 && hour <= 10 ? 20 + Math.floor(Math.random() * 30) :
                   hour === 11 ? 10 + Math.floor(Math.random() * 15) :
                   hour === 12 ? Math.floor(Math.random() * 10) : 0
    })
  }

  return data
}

export function FarmingCharts({ className = '' }: FarmingChartsProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate initial data
    setData(generateMockData())
    setLoading(false)

    // Update data every 5 minutes (300000ms)
    const interval = setInterval(() => {
      setData(generateMockData())
    }, 300000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className={`${className} flex flex-col h-full`}>
        <CardHeader className="flex-shrink-0">
          <CardTitle>Coop Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading activity data...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className} flex flex-col h-full`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle>Coop Activity</CardTitle>
        <CardDescription>Last 24 hours of eating, drinking, and nesting behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 flex-1 overflow-y-auto">
        {/* Eating & Drinking Time Chart */}
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            Eating & Drinking Time (24h)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="eatingTime"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Eating"
                dot={{ fill: 'hsl(var(--primary))' }}
              />
              <Line
                type="monotone"
                dataKey="drinkingTime"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                name="Drinking"
                dot={{ fill: 'hsl(217, 91%, 60%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Nesting Time Chart */}
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            Nesting Time (24h)
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Line
                type="monotone"
                dataKey="nestingTime"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                name="Nesting Duration"
                dot={{ fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
