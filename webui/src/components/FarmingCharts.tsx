import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ChartDataPoint {
  time: string
  eatingTime: number    // minutes spent eating
  drinkingTime: number  // minutes spent drinking
  nestingTime: number   // minutes spent laying eggs
}

interface Detection {
  id: number
  timestamp: string
  chicken_count: number
  location: string
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

// Process detections from API into chart data for the last 24 hours
const processDetections = (detections: Detection[]): ChartDataPoint[] => {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // Create hourly buckets - track unique minutes for each activity
  const hourlyData: Map<string, {
    eating: Set<string>;
    drinking: Set<string>;
    nesting: Set<string>
  }> = new Map()

  // Initialize 24 hours of data going back from now
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hourKey = time.toISOString()
    hourlyData.set(hourKey, {
      eating: new Set(),
      drinking: new Set(),
      nesting: new Set()
    })
  }

  // Filter detections to only last 24 hours
  const recentDetections = detections.filter(d => {
    if (!d.timestamp) return false
    const detectionTime = new Date(d.timestamp)
    return detectionTime >= oneDayAgo && detectionTime <= now
  })

  // Process each recent detection
  recentDetections.forEach((detection) => {
    const detectionTime = new Date(detection.timestamp)

    // Find the closest hour bucket
    const hoursDiff = Math.floor((now.getTime() - detectionTime.getTime()) / (60 * 60 * 1000))
    if (hoursDiff < 0 || hoursDiff >= 24) return

    const bucketTime = new Date(now.getTime() - hoursDiff * 60 * 60 * 1000)

    // Find matching bucket
    let targetBucket: { eating: Set<string>; drinking: Set<string>; nesting: Set<string> } | undefined
    for (const [key, value] of hourlyData.entries()) {
      const bucketDate = new Date(key)
      if (bucketDate.getHours() === bucketTime.getHours()) {
        targetBucket = value
        break
      }
    }

    if (!targetBucket) return

    // Create unique key for this minute (to avoid double-counting)
    const minuteKey = `${detectionTime.getHours()}:${detectionTime.getMinutes()}`
    const location = detection.location.toLowerCase()

    // Add to the appropriate Set (Sets automatically handle uniqueness)
    if (location.includes('feed') || location.includes('eat') || location.includes('food')) {
      targetBucket.eating.add(minuteKey)
    } else if (location.includes('water') || location.includes('drink')) {
      targetBucket.drinking.add(minuteKey)
    } else if (location.includes('egg') || location.includes('nest') || location.includes('lay')) {
      targetBucket.nesting.add(minuteKey)
    }
  })

  // Convert to chart data format with proper time labels
  const chartData: ChartDataPoint[] = []
  const sortedKeys = Array.from(hourlyData.keys()).sort()

  sortedKeys.forEach((key) => {
    const date = new Date(key)
    const timeLabel = `${date.getHours().toString().padStart(2, '0')}:00`
    const data = hourlyData.get(key)!

    chartData.push({
      time: timeLabel,
      eatingTime: data.eating.size,      // Count unique minutes
      drinkingTime: data.drinking.size,  // Count unique minutes
      nestingTime: data.nesting.size     // Count unique minutes
    })
  })

  return chartData
}

export function FarmingCharts({ className = '' }: FarmingChartsProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDetections = async () => {
    try {
      const response = await fetch('/api/detections')
      const result = await response.json()

      if (result.detections && result.detections.length > 0) {
        // Process real detections into chart data
        const processedData = processDetections(result.detections)
        setData(processedData)
        console.log(`✅ Loaded ${result.count} detections from API`)

        // Debug: Show sample of location values
        const locationSamples = result.detections.slice(0, 5).map((d: Detection) => d.location)
        console.log('📍 Sample locations:', locationSamples)

        // Debug: Show data totals
        const totals = processedData.reduce((acc, d) => ({
          eating: acc.eating + d.eatingTime,
          drinking: acc.drinking + d.drinkingTime,
          nesting: acc.nesting + d.nestingTime
        }), { eating: 0, drinking: 0, nesting: 0 })
        console.log('📊 Activity totals (minutes):', totals)
      } else {
        // Use mock data if no detections available
        console.log('⚠️ No detections available, using mock data')
        setData(generateMockData())
      }
      setLoading(false)
    } catch (error) {
      console.error('❌ Failed to fetch detections:', error)
      // Fallback to mock data on error
      setData(generateMockData())
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch initial data
    fetchDetections()

    // Update data every 5 minutes (300000ms)
    const interval = setInterval(() => {
      fetchDetections()
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
