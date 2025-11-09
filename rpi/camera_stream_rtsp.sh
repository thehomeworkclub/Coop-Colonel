#!/bin/bash

CONFIG_FILE="/etc/camera-stream/camera-stream.conf"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    WIDTH=640
    HEIGHT=480
    FPS=15
    BITRATE=800000
    ROTATION=0
    HFLIP=0
    VFLIP=0
fi

if command -v raspivid &> /dev/null; then
    CAMERA_CMD="raspivid -t 0 -w $WIDTH -h $HEIGHT -fps $FPS -b $BITRATE -cd H264 -ih -pf baseline"
    [ "$ROTATION" != "0" ] && CAMERA_CMD="$CAMERA_CMD -rot $ROTATION"
    [ "$HFLIP" = "1" ] && CAMERA_CMD="$CAMERA_CMD -hf"
    [ "$VFLIP" = "1" ] && CAMERA_CMD="$CAMERA_CMD -vf"
    CAMERA_CMD="$CAMERA_CMD -o -"

elif command -v rpicam-vid &> /dev/null || command -v libcamera-vid &> /dev/null; then
    CAM=$(command -v rpicam-vid || command -v libcamera-vid)
    CAMERA_CMD="$CAM -t 0 --width $WIDTH --height $HEIGHT --framerate $FPS --codec h264 --bitrate $BITRATE --inline"
    [ "$ROTATION" != "0" ] && CAMERA_CMD="$CAMERA_CMD --rotation $ROTATION"
    [ "$HFLIP" = "1" ] && CAMERA_CMD="$CAMERA_CMD --hflip"
    [ "$VFLIP" = "1" ] && CAMERA_CMD="$CAMERA_CMD --vflip"
    CAMERA_CMD="$CAMERA_CMD -o -"
else
    exit 1
fi

$CAMERA_CMD | ffmpeg -re -i pipe:0 -c:v copy -f rtsp -rtsp_transport tcp -listen 1 rtsp://0.0.0.0:8554/camera
