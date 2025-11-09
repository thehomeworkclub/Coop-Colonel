import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Video, VideoOff } from 'lucide-react'

interface CameraViewerProps {
  className?: string
  showModelSelector?: boolean
  showTitle?: boolean
}

const models = [
  { value: 'model1', label: 'Model 1' },
  { value: 'model2', label: 'Model 2' },
  { value: 'model3', label: 'Model 3' },
  { value: 'model4', label: 'Model 4' },
  { value: 'nodetect', label: 'No Detection' },
]

export function CameraViewer({ className = '', showModelSelector = true, showTitle = true }: CameraViewerProps) {
  const [selectedModel, setSelectedModel] = useState('model4')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const streamUrl = `/api/stream/${selectedModel}`

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
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
            {showModelSelector && (
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={showTitle ? '' : 'p-0'}>
        <div className="relative bg-muted rounded-lg overflow-hidden border border-border" style={{ aspectRatio: '16/9', width: '100%', maxWidth: '1280px' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card">
              <div className="text-center">
                <Video className="h-12 w-12 mx-auto mb-2 animate-pulse text-primary" />
                <p className="text-sm text-muted-foreground">Loading stream...</p>
              </div>
            </div>
          )}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-card">
              <div className="text-center">
                <VideoOff className="h-12 w-12 mx-auto mb-2 text-destructive" />
                <p className="text-sm text-muted-foreground">Stream unavailable</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Make sure coopcam.py is running</p>
              </div>
            </div>
          )}
          <img
            key={selectedModel}
            src={streamUrl}
            alt="Camera stream"
            className="w-full h-full object-contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
        {!showTitle && showModelSelector && (
          <div className="p-4 bg-card border-t">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
