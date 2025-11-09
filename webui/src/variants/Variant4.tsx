import { CameraViewer } from '../components/CameraViewer'
import { StatsPanel } from '../components/StatsPanel'
import { VideoGallery } from '../components/VideoGallery'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

/**
 * Coop Camera Dashboard - Tabbed Interface
 * Camera always visible, tabs switch between stats/videos
 */
export function Variant4() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Coop Camera Dashboard</h1>
        <p className="text-slate-400">Live camera feed with statistics and recordings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera view - 2 columns */}
        <div className="lg:col-span-2">
          <CameraViewer />
        </div>

        {/* Tabbed content - 1 column */}
        <div>
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="mt-6">
              <StatsPanel />
            </TabsContent>
            <TabsContent value="videos" className="mt-6">
              <VideoGallery />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
