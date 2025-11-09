# Coop Camera Web Dashboard

A modern, responsive web dashboard for viewing camera streams with tabbed interface. Built with Flask, React, shadcn/ui, and Tailwind CSS.

## Features

- **Live Camera Streaming** - Real-time 1280x720 video feed from your camera
- **Tabbed Interface** - Camera always visible with tabs for statistics and recordings
- **Statistics Dashboard** - Monitor camera status, detections, and system resources
- **Video Gallery** - Browse and manage recorded footage
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **Desktop Optimized** - Layout designed for 1920x1080+ displays

## Dashboard Layout

The dashboard uses a clean tabbed interface:
- **Left side (2/3 width)**: Live camera feed with model selector
- **Right side (1/3 width)**: Tabbed panel switching between:
  - **Statistics**: Camera status, detection counts, system resources
  - **Videos**: Recorded footage gallery with playback controls

## Prerequisites

- Python 3.8+
- Node.js 18+ and npm
- Running `coopcam.py` instance (for video streaming)

## Installation

### 1. Install Python Dependencies

```bash
cd webui
pip3 install -r requirements.txt
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Build the React Frontend

```bash
npm run build
```

This will create a `dist/` folder with the compiled React application.

## Running the Application

### Quick Start

```bash
./start.sh
```

This script will:
1. Install dependencies (if needed)
2. Build the frontend (if needed)
3. Start the Flask server

### Manual Start

1. Make sure `coopcam.py` is running (default: http://localhost:5001)

2. Start the Flask server:

```bash
python3 app.py
```

3. Open your browser and navigate to:
   - **http://localhost:5000**

### Development Mode

For frontend development with hot reload:

1. In one terminal, start the Flask backend:

```bash
python3 app.py
```

2. In another terminal, start the Vite dev server:

```bash
npm run dev
```

3. Open http://localhost:3000 for development

The Vite dev server will proxy API requests to Flask at http://localhost:5000.

## Configuration

### Environment Variables

Create a `.env` file in the `webui/` directory:

```env
COOPCAM_URL=http://localhost:5001
```

### Camera Models

The dashboard supports the following camera detection models:
- `model1`
- `model2`
- `model3`
- `model4`
- `nodetect` (no detection, raw stream)

Switch between models using the dropdown in the camera viewer.

## Project Structure

```
webui/
├── app.py                    # Flask backend
├── requirements.txt          # Python dependencies
├── package.json              # Node.js dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── start.sh                 # Quick start script
├── README.md                # This file
├── templates/               # Flask templates
│   └── index.html          # Main dashboard template
├── src/                     # React source code
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Main app component
│   ├── index.css           # Global styles
│   ├── components/         # Shared components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── CameraViewer.tsx
│   │   ├── StatsPanel.tsx
│   │   └── VideoGallery.tsx
│   ├── variants/          # Dashboard layout
│   │   └── Variant4.tsx   # Tabbed interface
│   └── lib/
│       └── utils.ts       # Utility functions
└── dist/                  # Built assets (generated)
```

## API Endpoints

### Flask Backend

- `GET /` - Main dashboard page
- `GET /api/stats` - Get camera and system statistics
- `GET /api/videos` - Get list of recorded videos
- `GET /api/stream/<model>` - Proxy video stream from coopcam

### Example API Response

**GET /api/stats**
```json
{
  "camera": {
    "status": "online",
    "fps": 30,
    "resolution": "1280x720",
    "uptime": "24h 15m"
  },
  "detections": {
    "today": 127,
    "this_week": 856,
    "this_month": 3420
  },
  "system": {
    "cpu": 45,
    "memory": 62,
    "storage": 78,
    "temperature": 42
  },
  "models": {
    "active": "model4",
    "available": ["model1", "model2", "model3", "model4", "nodetect"]
  }
}
```

**GET /api/videos**
```json
[
  {
    "id": 1,
    "filename": "recording_2025-01-08_14-30.mp4",
    "timestamp": "2025-01-08 14:30:45",
    "duration": "00:05:23",
    "size": "45.2 MB",
    "thumbnail": "/api/thumbnail/1"
  }
]
```

## Technologies Used

### Backend
- **Flask** - Python web framework
- **Requests** - HTTP library for proxying streams

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **Radix UI** - Headless UI components (Tabs, Select, etc.)
- **Lucide React** - Icon library

## Troubleshooting

### Stream not loading
- Ensure `coopcam.py` is running on port 5001
- Check the `COOPCAM_URL` environment variable
- Verify network connectivity between Flask and coopcam
- Check browser console for errors

### White screen / Assets not loading
- Rebuild the frontend: `npm run build`
- Clear browser cache and reload
- Check that `dist/` folder exists and contains assets

### Build errors
- Delete `node_modules/` and run `npm install` again
- Ensure you're using Node.js 18 or higher: `node --version`
- Check for TypeScript errors in the output

### Flask errors
- Ensure all Python dependencies are installed: `pip3 install -r requirements.txt`
- Check that port 5000 is not in use by another application
- Verify Flask can access the `dist/` folder

## Customization

### Changing the Layout

The main dashboard component is in `/src/variants/Variant4.tsx`. You can customize:
- Grid layout proportions
- Tab order and labels
- Component styling
- Panel visibility

### Adding New Features

1. Create new components in `/src/components/`
2. Import and use them in `Variant4.tsx`
3. Rebuild with `npm run build`

### Updating Stats Display

Modify `/src/components/StatsPanel.tsx` to:
- Add/remove metrics
- Change update intervals
- Customize the visual layout

## License

This project is part of the Coop-Colonel camera monitoring system.

## Contributing

Feel free to submit issues and enhancement requests!
