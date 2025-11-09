import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Activity, Camera, Cpu, HardDrive, Thermometer, TrendingUp } from 'lucide-react'
import { Separator } from './ui/separator'

interface Stats {
  camera: {
    status: string
    fps: number
    resolution: string
    uptime: string
  }
  detections: {
    today: number
    this_week: number
    this_month: number
  }
  system: {
    cpu: number
    memory: number
    storage: number
    temperature: number
  }
  models: {
    active: string
    available: string[]
  }
}

interface StatsPanelProps {
  className?: string
  compact?: boolean
}

export function StatsPanel({ className = '', compact = false }: StatsPanelProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        setStats(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading || !stats) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-slate-400">Loading stats...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Camera</span>
              </div>
              <span className="text-sm text-slate-400">{stats.camera.fps} FPS</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">CPU</span>
                <span>{stats.system.cpu}%</span>
              </div>
              <Progress value={stats.system.cpu} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Memory</span>
                <span>{stats.system.memory}%</span>
              </div>
              <Progress value={stats.system.memory} />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Statistics
        </CardTitle>
        <CardDescription>Real-time system and camera metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Camera Status */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Camera className="h-4 w-4 text-green-500" />
            Camera Status
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-400">Status</p>
              <p className="text-sm font-medium capitalize">{stats.camera.status}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">FPS</p>
              <p className="text-sm font-medium">{stats.camera.fps}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Resolution</p>
              <p className="text-sm font-medium">{stats.camera.resolution}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Uptime</p>
              <p className="text-sm font-medium">{stats.camera.uptime}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Detections */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Detections
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-primary">{stats.detections.today}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-primary">{stats.detections.this_week}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-primary">{stats.detections.this_month}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* System Resources */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-500" />
            System Resources
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">CPU Usage</span>
                <span className="text-sm font-medium">{stats.system.cpu}%</span>
              </div>
              <Progress value={stats.system.cpu} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Memory Usage</span>
                <span className="text-sm font-medium">{stats.system.memory}%</span>
              </div>
              <Progress value={stats.system.memory} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400 flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  Storage
                </span>
                <span className="text-sm font-medium">{stats.system.storage}%</span>
              </div>
              <Progress value={stats.system.storage} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  Temperature
                </span>
                <span className="text-sm font-medium">{stats.system.temperature}°C</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
