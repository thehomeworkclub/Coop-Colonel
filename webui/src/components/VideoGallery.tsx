import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Film, Play, Download, Trash2 } from 'lucide-react'

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
      <Card className={`${className} flex flex-col h-full`}>
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            Recorded Videos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground text-sm">Loading videos...</div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Film className="h-4 w-4" />
            Recent Videos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{video.filename}</p>
                  <p className="text-xs text-muted-foreground">{video.duration} • {video.size}</p>
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
    <Card className={`${className} flex flex-col h-full`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Film className="h-5 w-5" />
          Recorded Videos
        </CardTitle>
        <CardDescription>Manage and playback recorded footage</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-hidden">
        <div className="space-y-2 h-full overflow-y-auto pr-2">
          {videos.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Film className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recordings available</p>
            </div>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-2 p-2 rounded border border-border bg-card hover:bg-accent/50 transition-colors group"
              >
                {/* Thumbnail placeholder */}
                <div className="w-16 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                {/* Video info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs truncate">{video.filename}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                    <span>{video.timestamp}</span>
                    <span>•</span>
                    <span>{video.duration}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <Button size="sm" variant="ghost" title="Play" className="h-7 w-7 p-0">
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Download" className="h-7 w-7 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Delete" className="h-7 w-7 p-0 text-destructive hover:text-destructive/80">
                    <Trash2 className="h-3 w-3" />
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
