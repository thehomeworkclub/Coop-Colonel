import { CameraViewer } from '../components/CameraViewer'
import { StatsPanel } from '../components/StatsPanel'
import { VideoGallery } from '../components/VideoGallery'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Github, Youtube } from 'lucide-react'

/**
 * Coop Colonel - Tabbed Interface
 * Camera always visible, tabs switch between stats/videos
 */
export function Variant4() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <h1
          className="text-6xl font-bold tracking-wider uppercase"
          style={{
            fontFamily: '"Teko", sans-serif',
            letterSpacing: '0.15em',
            color: '#4a5a3a',
            textShadow: '2px 2px 0px rgba(0,0,0,0.2), -1px -1px 0px rgba(255,255,255,0.1)',
            filter: 'contrast(1.1)',
            WebkitTextStroke: '0.5px rgba(74, 90, 58, 0.3)'
          }}
        >
          COOP COLONEL
        </h1>
        <div className="flex items-center gap-4 mt-3">
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Youtube className="h-6 w-6" />
          </a>
          <a href="https://devpost.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.002 1.61L0 12.004L6.002 22.39h11.996L24 12.004L17.998 1.61H6.002zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31c0 4.436-3.21 6.302-6.456 6.302H7.595V5.694zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861c.009-2.569-1.096-3.853-3.767-3.853H10.112z"/>
            </svg>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-6 w-6" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera view - 2 columns */}
        <div className="lg:col-span-2">
          <CameraViewer />
        </div>

        {/* Tabbed content - 1 column */}
        <div className="flex flex-col">
          <Tabs defaultValue="stats" className="w-full flex flex-col flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="mt-6 flex-1">
              <StatsPanel className="h-full" />
            </TabsContent>
            <TabsContent value="videos" className="mt-6 flex-1">
              <VideoGallery className="h-full" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
