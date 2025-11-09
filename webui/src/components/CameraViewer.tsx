import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Video, VideoOff } from 'lucide-react'

interface CameraViewerProps {
  className?: string
  showTitle?: boolean
}

export function CameraViewer({ className = '', showTitle = true }: CameraViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const streamUrl = 'http://192.168.1.104:5000/no_detect'

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
    setLastUpdated(new Date())
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const formatPSTTime = (date: Date | null) => {
    if (!date) return 'Never'

    // Convert to PST (UTC-8) or PDT (UTC-7)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Los_Angeles',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }

    return date.toLocaleString('en-US', options) + ' PST'
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Live Camera Feed
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Last Updated: <span className="font-mono">{formatPSTTime(lastUpdated)}</span>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={showTitle ? '' : 'p-0'}>
        <div className="relative bg-muted rounded-lg overflow-hidden border border-border" style={{ aspectRatio: '16/9', width: '100%', maxWidth: '1280px' }}>
          {/* Blurred background - fills the space when aspect ratio doesn't match */}
          {!isLoading && !hasError && (
            <img
              src={streamUrl}
              alt="Camera stream background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
              aria-hidden="true"
            />
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
              <div className="text-center">
                <Video className="h-12 w-12 mx-auto mb-2 animate-pulse text-primary" />
                <p className="text-sm text-muted-foreground">Loading stream...</p>
              </div>
            </div>
          )}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
              <div className="text-center">
                <VideoOff className="h-12 w-12 mx-auto mb-2 text-destructive" />
                <p className="text-sm text-muted-foreground">Stream unavailable</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Check camera connection at {streamUrl}</p>
              </div>
            </div>
          )}

          {/* Main video - maintains aspect ratio on top */}
          <img
            src={streamUrl}
            alt="Camera stream"
            className="relative w-full h-full object-contain z-10"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      </CardContent>
    </Card>
  )
}
