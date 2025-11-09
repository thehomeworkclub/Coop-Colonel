#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ARCH=$(uname -m)
sudo mkdir -p /etc/camera-stream
sudo mkdir -p /opt/camera-stream
sudo cp "$SCRIPT_DIR/camera-stream.conf" /etc/camera-stream/
sudo cp "$SCRIPT_DIR/camera_stream_tcp.sh" /opt/camera-stream/
sudo chmod +x /opt/camera-stream/camera_stream_tcp.sh
sudo cp "$SCRIPT_DIR/camera-stream.service" /etc/systemd/system/
sudo systemctl daemon-reload
