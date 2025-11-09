#!/bin/bash

CONFIG_FILE="/etc/camera-stream/camera-stream.conf"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    WIDTH=1280
    HEIGHT=720
    FPS=30
    BITRATE=2000000
    CODEC=h264
    ROTATION=0
    HFLIP=0
    VFLIP=0
fi

if command -v rpicam-vid &> /dev/null; then
    CAMERA_CMD="rpicam-vid"
    CMD="$CAMERA_CMD -t 0 --width $WIDTH --height $HEIGHT --framerate $FPS"
    CMD="$CMD --codec $CODEC --bitrate $BITRATE --inline --listen"

    [ "$ROTATION" != "0" ] && CMD="$CMD --rotation $ROTATION"
    [ "$HFLIP" = "1" ] && CMD="$CMD --hflip"
    [ "$VFLIP" = "1" ] && CMD="$CMD --vflip"

    CMD="$CMD -o -"

elif command -v raspivid &> /dev/null; then
    CAMERA_CMD="raspivid"
    CMD="$CAMERA_CMD -t 0 -w $WIDTH -h $HEIGHT -fps $FPS"
    CMD="$CMD -b $BITRATE -cd $CODEC -ih -pf baseline"

    [ "$ROTATION" != "0" ] && CMD="$CMD -rot $ROTATION"
    [ "$HFLIP" = "1" ] && CMD="$CMD -hf"
    [ "$VFLIP" = "1" ] && CMD="$CMD -vf"

    CMD="$CMD -o -"
else
    exit 1
fi

$CMD | ffmpeg -re -i pipe:0 -c:v copy -f rtsp rtsp://localhost:8554/camera
