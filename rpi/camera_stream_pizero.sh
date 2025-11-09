#!/bin/bash

CONFIG_FILE="/etc/camera-stream/camera-stream.conf"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    WIDTH=640
    HEIGHT=480
    FPS=15
    BITRATE=1000000
    ROTATION=0
    HFLIP=0
    VFLIP=0
fi

if command -v rpicam-vid &> /dev/null; then
    CMD="rpicam-vid -t 0 --width $WIDTH --height $HEIGHT --framerate $FPS"
    CMD="$CMD --codec h264 --bitrate $BITRATE --inline"

    [ "$ROTATION" != "0" ] && CMD="$CMD --rotation $ROTATION"
    [ "$HFLIP" = "1" ] && CMD="$CMD --hflip"
    [ "$VFLIP" = "1" ] && CMD="$CMD --vflip"

    CMD="$CMD -o -"

elif command -v raspivid &> /dev/null; then
    CMD="raspivid -t 0 -w $WIDTH -h $HEIGHT -fps $FPS"
    CMD="$CMD -b $BITRATE -cd H264 -ih -pf baseline"

    [ "$ROTATION" != "0" ] && CMD="$CMD -rot $ROTATION"
    [ "$HFLIP" = "1" ] && CMD="$CMD -hf"
    [ "$VFLIP" = "1" ] && CMD="$CMD -vf"

    CMD="$CMD -o -"
else
    exit 1
fi

$CMD | ffmpeg -re -i - -c:v copy -f rtsp -rtsp_transport tcp rtsp://0.0.0.0:8554/camera
