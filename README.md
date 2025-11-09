# COOP COLONEL

> **Low-cost, open-source chicken health monitoring for small farms**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-purple)](https://github.com/ultralytics/ultralytics)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)

**Live Demo:** [coopcolonel.sebastianalexis.com](https://coopcolonel.sebastianalexis.com)

---

## The Problem

Since 2024, the US has been under a **bird flu epidemic**. In that time:
- **166 million chickens** have been killed
- Egg prices have skyrocketed
- Massive losses for farmers across the country

Unfortunately, current state-of-the-art tools for chicken health monitoring like **AgriStats** require:
- Minimum production values that exceed virtually all small farms
- Annual fees of **$25,000-$100,000**
- This leaves **small farmers without the tools they need**

In fact, this monopoly is so extensive that AgriStats is being sued by the **Justice Department** for monopolistic behavior. Their client base controls over **90% of chicken sales in the US**, and the DOJ report alleges they "encouraged meat processors to raise prices and reduce supply."

## The Solution

**Coop Colonel** is a **first-of-its-kind**, low-power, low-cost, **open-source** chicken monitoring solution for backyard coops and small farms.

### What Makes Us Different

| Traditional Solutions | Coop Colonel |
|----------------------|--------------|
| $25,000-$100,000/year | **~$50 hardware + electricity** |
| Factory farms only | **Any size farm** |
| Proprietary & closed | **Open source** |
| Cloud subscriptions | **Self-hosted** |
| Complex setup | **Plug & play** |

Instead of farmers having to pay annual subscriptions in the tens of thousands, they can leverage **ARM's efficient architecture** and run state-of-the-art health detection, with their only recurring cost being electricity.

---

## Features

- **Live Camera Monitoring** - Real-time HD video feed from your coop
- **AI-Powered Detection** - Fine-tuned YOLOv8 model for chicken tracking
- **Behavioral Analytics** - Monitor feeding, drinking, and egg-laying patterns
- **Anomaly Detection** - Identify sick chickens before diseases spread
- **Web Dashboard** - Beautiful, responsive UI accessible from anywhere
- **Local Storage** - All data stays on your network
- **Low Power** - Runs on Raspberry Pi Zero W (~2W each)
- **Historical Data** - Track trends over days, weeks, and months

---

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Coop Colonel System                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Pi Zero W 1]  ──┐                                         │
│  + Arducam 5MP    │                                         │
│                   │    TCP Stream                           │
│  [Pi Zero W 2]  ──┼────────────────► [Processing Server]   │
│  + Arducam 5MP    │                   │                     │
│                   │                   ├─► YOLOv8 Model     │
│                                       ├─► Position Tracking │
│                                       ├─► Behavior Analysis │
│                                       └─► Anomaly Detection │
│                                           │                  │
│                                           ▼                  │
│                                    [Flask Web Server]        │
│                                           │                  │
│                                           ├─► Live Stream   │
│                                           ├─► Statistics    │
│                                           └─► Alerts        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Detection Pipeline

1. **Camera Capture**: Raspberry Pi Zeros stream video via TCP at ~30 FPS
2. **YOLO Detection**: Custom-trained YOLOv8 model detects chickens in each frame
3. **Position Tracking**: Maps chicken locations to feeding, drinking, or nesting zones
4. **Time Tracking**: Records duration of time spent in each zone per hour
5. **Anomaly Detection**: Identifies behavioral deviations that may indicate illness

**Example Detection:**
- Chicken at feeding station for 5 minutes → Normal
- Chicken hasn't eaten in 8 hours → **Potential illness detected**
- Note that this is oversimplified, and anomaly detection is a bit more complex than this simple example.

---

## Hardware Requirements

### Minimum Setup

- **2x Raspberry Pi Zero W** (~$10 each)
- **2x Arducam 5MP OV5647** (~$15 each)
- **1x Processing Server** (Raspberry Pi 4, PC, or cloud instance)
- **Recycled materials** for camera housing (plastic bottles work great!)
- **Power supplies** for Pi Zeros
- **MicroSD cards** (8GB+ each)

**Total Cost: ~$50-100** (one-time, vs $25k-100k/year!)
---

## Installation

### 1. Camera Nodes (Raspberry Pi Zero W)

```bash
# Install required packages
sudo apt-get update
sudo apt-get install python3-opencv python3-picamera

# Clone repository
git clone https://github.com/thehomeworkclub/Coop-Colonel.git
cd Coop-Colonel

# Start camera stream
python3 camera_stream.py
```

### 2. Processing Server

```bash
# Clone repository
git clone https://github.com/thehomeworkclub/Coop-Colonel.git
cd Coop-Colonel

# Install dependencies
pip install -r requirements.txt

# Download YOLO model
# (Trained model will be included in releases)

# Start detection server
python3 coopcam.py
```

### 3. Web Dashboard

```bash
cd webui

# Install Node.js dependencies
npm install

# Build frontend
npm run build

# Start Flask server
python3 app.py
```

Access at: **http://localhost:5000**

### 4. (Optional) Cloudflare Tunnel - What we used.

For remote access:

```bash
# Start tunnel
./start-tunnel.sh
```

Access at: **https://your-tunnel-url.com**

---

## 📖 Usage

### Web Dashboard

The dashboard provides three main views:

1. **Live Camera Feed**
   - Real-time video from your coop
   - Last updated timestamp (PST)
   - Blur effect for aesthetic letterboxing

2. **Statistics**
   - **Eating Time Graph** - Minutes spent feeding per hour
   - **Drinking Time Graph** - Minutes spent at water station per hour
   - **Nesting Time Graph** - Minutes spent laying eggs per hour
   - Rolling 24-hour view with live updates

3. **Social Links**
   - YouTube demo
   - Devpost submission
   - GitHub repository

### API Endpoints

```python
# Get all detections
GET /api/detections
Response: {
  "detections": [
    {
      "id": 720,
      "timestamp": "2025-11-09 07:08:29",
      "chicken_count": 1,
      "location": "eggs"
    }
  ],
  "count": 720
}

# Get live camera stream
GET /api/camera/stream
Returns: MJPEG stream (broadcast mode - unlimited clients!)
```

---

## Machine Learning

### Model Training

Our YOLOv8 model was trained on **custom-labeled chicken datasets** using:

- **Label Studio** for manual annotation
- **Vultr cloud servers** for rapid training iterations
- **Data augmentation** for varied lighting/angles
- **False positive filtering** for feeding stations

### Training Challenges

1. **False Positives**: Feeding/drinking stations being detected as chickens
   - **Solution**: Manual labeling in Label Studio to mark stations as background

2. **False Negatives**: Partially obstructed chickens
   - **Solution**: Labeled partial chickens, retrained on Vultr

3. **Performance**: Originally expected 1 FPS, achieved near-video framerate!

### Model Performance

- **Detection Rate**: ~28-30 FPS on Raspberry Pi 4
- **Accuracy**: 95%+ on test set
- **Latency**: <50ms per frame

---

## Accomplishments

### Framerate
We were honestly **shocked** at the framerate. After struggles setting up the cameras, seeing such smooth video feed was a welcome surprise!

### Model Performance
We originally expected just 1 FPS detection for backend processing, but our final model runs at **nearly the same framerate as the video itself**. We have **Vultr** to thank - being able to retrain frequently using powerful cloud compute left us with a model we can only describe as **beautiful**.

### ARM Optimization
We **literally would not have been able to do this project** without properly utilizing ARM. The entire BCM2835 SoC is a VideoCore IV computer with an ARM chip attached. Although the Pi Zeros have only:
- Single core
- 1GHz clock speed
- 512MB RAM

...we achieved incredible performance through VideoCore IV GPU acceleration!
---

## Contributing

We welcome contributions! This is an open-source project built for farmers, by developers who care.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas We Need Help

- Bug fixes and testing
- Documentation improvements
- UI/UX enhancements
- Model improvements
- Internationalization
- Mobile app development

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR**: You can use this for anything, including commercial purposes, as long as you include the license.

---

## Acknowledgments

- **Vultr** - Cloud compute for model training
- **Ultralytics** - YOLOv8 framework
- **Label Studio** - Annotation platform
- **ARM** - Efficient architecture that made this possible
- **The open-source community** - For amazing tools and libraries

---

## Contact

- **GitHub**: [@thehomeworkclub](https://github.com/thehomeworkclub/Coop-Colonel)
- **Devpost**: [Coop Colonel](https://devpost.com/software/coop-colonel)
- **YouTube**: [Demo Video](https://youtu.be/i8XpmjvNMpA)
