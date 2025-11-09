import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Film, Play, Download, Trash2, Calendar } from 'lucide-react'

interface Video {
  id: number
  filename: string
  timestamp: string
  duration: string
  size: string
  thumbnail: string
}

interface VideoGalleryProps {
  className?: string
  compact?: boolean
  limit?: number
}

export function VideoGallery({ className = '', compact = false, limit }: VideoGalleryProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos')
        const data = await response.json()
        setVideos(limit ? data.slice(0, limit) : data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch videos:', error)
        setLoading(false)
      }
    }

    fetchVideos()
  }, [limit])

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            Recorded Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-slate-400">Loading videos...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Film className="h-4 w-4" />
            Recent Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{video.filename}</p>
                  <p className="text-xs text-slate-400">{video.duration} • {video.size}</p>
                </div>
                <Button size="sm" variant="ghost" className="ml-2">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="h-5 w-5" />
          Recorded Videos
        </CardTitle>
        <CardDescription>Manage and playback recorded footage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {videos.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Film className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recordings available</p>
            </div>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors group"
              >
                {/* Thumbnail placeholder */}
                <div className="w-32 h-20 bg-slate-800 rounded flex items-center justify-center flex-shrink-0">
                  <Play className="h-8 w-8 text-slate-600 group-hover:text-blue-500 transition-colors" />
                </div>

                {/* Video info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 truncate">{video.filename}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {video.timestamp}
                    </span>
                    <span>{video.duration}</span>
                    <span>{video.size}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" title="Play">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Delete" className="text-red-500 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
