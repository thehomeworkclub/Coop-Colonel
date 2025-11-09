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

TCP_PORT=8554

if command -v raspivid &> /dev/null; then
    CMD="raspivid -t 0 -w $WIDTH -h $HEIGHT -fps $FPS -b $BITRATE -cd H264 -ih -pf baseline -g $((FPS*2))"
    [ "$ROTATION" != "0" ] && CMD="$CMD -rot $ROTATION"
    [ "$HFLIP" = "1" ] && CMD="$CMD -hf"
    [ "$VFLIP" = "1" ] && CMD="$CMD -vf"
    CMD="$CMD -o -"

elif command -v rpicam-vid &> /dev/null || command -v libcamera-vid &> /dev/null; then
    CAM=$(command -v rpicam-vid || command -v libcamera-vid)
    CMD="$CAM -t 0 --width $WIDTH --height $HEIGHT --framerate $FPS --codec h264 --bitrate $BITRATE --inline --intra $((FPS*2))"
    [ "$ROTATION" != "0" ] && CMD="$CMD --rotation $ROTATION"
    [ "$HFLIP" = "1" ] && CMD="$CMD --hflip"
    [ "$VFLIP" = "1" ] && CMD="$CMD --vflip"
    CMD="$CMD -o -"
else
    exit 1
fi

while true; do
    $CMD | nc -l -p $TCP_PORT -q 1
    sleep 1
done
